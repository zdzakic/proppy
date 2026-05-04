from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import Payment, PaymentTransactionType, ServiceCharge


class PaymentListSerializer(serializers.ModelSerializer):
    """
    PaymentListSerializer

    WHAT:
    - Read-only shape for listing payments (GET).

    WHY:
    - ListCreateAPIView uses a slim serializer; create stays on PaymentCreateSerializer.
    """

    transaction_type_name = serializers.CharField(
        source="transaction_type.name", read_only=True, default=None
    )
    property_name = serializers.CharField(
        source="service_charge.property.name", read_only=True
    )
    display_label = serializers.SerializerMethodField()

    def get_display_label(self, obj):
        first_owner = obj.service_charge.property.owners.first()
        return first_owner.display_label if first_owner else ""

    class Meta:
        model = Payment
        fields = ["id", "amount", "date_paid", "comment", "transaction_type", "transaction_type_name", "property_name", "display_label"]


class PaymentCreateSerializer(serializers.ModelSerializer):
    """
    PaymentCreateSerializer

    WHAT:
    - Minimal serializer for creating a Payment towards a ServiceCharge.

    WHY:
    - Keeps the API KISS (POST on ListCreateAPIView + ModelSerializer), mirroring Blocks create style.
    """

    service_charge = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCharge.objects.all()
    )
    transaction_type = serializers.SlugRelatedField(
        queryset=PaymentTransactionType.objects.all(),
        slug_field="name",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Payment
        fields = ["id", "service_charge", "amount", "date_paid", "comment", "transaction_type"]

    def validate_amount(self, value):
        if value is None:
            return value
        if value <= Decimal("0"):
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

    def validate(self, attrs):
        service_charge = attrs.get("service_charge")
        amount = attrs.get("amount")

        # Optional but useful: prevent paying more than remaining.
        if service_charge is not None and amount is not None:
            paid_total = (
                Payment.objects.filter(service_charge=service_charge).aggregate(
                    total=Sum("amount")
                )["total"]
                or Decimal("0")
            )
            remaining = service_charge.amount - paid_total
            if amount > remaining:
                raise serializers.ValidationError(
                    {"amount": "Amount cannot exceed remaining balance."}
                )

        return attrs


class PaymentUpdateSerializer(serializers.ModelSerializer):
    """
    PaymentUpdateSerializer

    WHAT:
    - Handles PATCH/PUT on an existing Payment.

    WHY service_charge is excluded:
    - Immutable after create; changing it would corrupt accounting history.

    WHY self.instance in validate:
    - Overpayment check must exclude the current payment from the total,
      otherwise editing (e.g. correcting a typo) always fails the check.
    """

    transaction_type = serializers.SlugRelatedField(
        queryset=PaymentTransactionType.objects.all(),
        slug_field="name",
        required=False,
        allow_null=True,
    )
    transaction_type_name = serializers.CharField(
        source="transaction_type.name", read_only=True, default=None
    )

    class Meta:
        model = Payment
        fields = ["id", "amount", "date_paid", "comment", "transaction_type", "transaction_type_name"]

    def validate_amount(self, value):
        if value is None:
            return value
        if value <= Decimal("0"):
            raise serializers.ValidationError("Amount must be greater than 0.")
        return value

    def validate(self, attrs):
        amount = attrs.get("amount")

        if self.instance is not None and amount is not None:
            service_charge = self.instance.service_charge
            paid_total = (
                Payment.objects.filter(service_charge=service_charge)
                .exclude(pk=self.instance.pk)
                .aggregate(total=Sum("amount"))["total"]
                or Decimal("0")
            )
            remaining = service_charge.amount - paid_total
            if amount > remaining:
                raise serializers.ValidationError(
                    {"amount": "Amount cannot exceed remaining balance."}
                )

        return attrs


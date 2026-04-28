from decimal import Decimal

from django.db.models import Sum
from rest_framework import serializers

from .models import Payment, ServiceCharge


class PaymentCreateSerializer(serializers.ModelSerializer):
    """
    PaymentCreateSerializer

    WHAT:
    - Minimal serializer for creating a Payment towards a ServiceCharge.

    WHY:
    - Keeps the API KISS (CreateAPIView + ModelSerializer), mirroring Blocks create style.
    """

    service_charge = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCharge.objects.all()
    )

    class Meta:
        model = Payment
        fields = ["id", "service_charge", "amount", "date_paid"]

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


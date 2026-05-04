# properties/serializers.py
from rest_framework import serializers
from users.models import Role
from .models import Block, Property, PropertyOwner, UserRookeryRole, Company, ServiceCharge, Payment, ServicePeriod
from django.contrib.auth import get_user_model
from django.db import transaction
from .constants import TITLE_CHOICES
from django.db.models import Sum, Max


User = get_user_model()


class PropertyOwnerSerializer(serializers.ModelSerializer):
    """
    PropertyOwner CRUD (company admin). `property` comes from URL, not body.
    """

    email = serializers.EmailField(write_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    title = serializers.ChoiceField(choices=TITLE_CHOICES, required=False, allow_blank=True, write_only=True)

    first_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    last_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True, write_only=True)
    address_1 = serializers.CharField(required=False, allow_blank=True, write_only=True)
    postcode = serializers.CharField(required=False, allow_blank=True, write_only=True)
    country = serializers.CharField(required=False, allow_blank=True, write_only=True)
    display_label = serializers.CharField(required=False, allow_blank=True)

    # Read-only profile fields for nested property lists / edit forms (sourced from linked User).
    user_first_name = serializers.CharField(source="user.first_name", read_only=True)
    user_last_name = serializers.CharField(source="user.last_name", read_only=True)
    user_phone = serializers.CharField(source="user.phone", read_only=True)
    user_address_1 = serializers.CharField(source="user.address_1", read_only=True)
    user_postcode = serializers.CharField(source="user.postcode", read_only=True)
    user_country = serializers.CharField(source="user.country", read_only=True)
    user_title = serializers.CharField(source="user.title", read_only=True)

    # FK property → block id (URLs for owner create/delete). Duplicate of Property.block_id but
    # survives clients that omit root-level block_id on Property.
    block_id = serializers.IntegerField(source="property.block_id", read_only=True)

 
    class Meta:
        model = PropertyOwner
        fields = [
            "id",
            "email",
            "user_email",
            "title",
            "block_id",
            "display_name",
            "display_label", 
            "date_from",
            "date_to",
            "comment",
            "order",
            "first_name",
            "last_name",
            "phone",
            "address_1",
            "postcode",
            "country",
            "user_first_name",
            "user_last_name",
            "user_phone",
            "user_address_1",
            "user_postcode",
            "user_country",
            "user_title",
                ]


    def get_fields(self):
        """
        Get the fields for the serializer.
        """
        fields = super().get_fields()
        # On update allow changing only metadata fields (display_name/comment/etc),
        # while 'email' is an input-only field for create.
        if self.instance is not None and "email" in fields:
            fields["email"].read_only = True
        return fields

    def validate(self, data):
        # Email is required only on create requests (when there is no instance yet).
        if self.instance is None and not data.get("email"):
            raise serializers.ValidationError("Email is required.")

        return data

    def create(self, validated_data):
        for field in [
            "email",
            "first_name",
            "last_name",
            "phone",
            "address_1",
            "postcode",
            "country",
        ]:
            validated_data.pop(field, None)

        return super().create(validated_data)


class PropertySerializer(serializers.ModelSerializer):
    """
    Simple serializer for Property.

    WHY:
    - used inside Block
    - owners nested read-only for list/detail
    """

    owners = PropertyOwnerSerializer(many=True, read_only=True)

    block_name = serializers.CharField(source="block.name", read_only=True)
    company_name = serializers.CharField(source="block.company.name", read_only=True)
    block_id = serializers.IntegerField(source="block.id", read_only=True)

    class Meta:
        model = Property
        fields = ["id", "name", "comment", "owners", "block_name", "company_name", "block_id"]


class BlockSerializer(serializers.ModelSerializer):
    """
    Block serializer with nested properties.

    WHY:
    - CompanyAdmin gets full structure in one call
    """

    properties = PropertySerializer(many=True, read_only=True)
    company = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        required=False,
    )
    company_name = serializers.CharField(source="company.name", read_only=True)


    class Meta:
        model = Block
        fields = ["id", "name", "comment", "company", "company_name", "properties"]

    def validate_company(self, company):
        user = self.context["request"].user

        is_admin = UserRookeryRole.objects.filter(
            user=user,
            company=company,
            role__code="COMPANYADMIN"
        ).exists()

        if not is_admin:
            raise serializers.ValidationError(
                "You cannot create block in this company."
            )

        return company


class AddCompanyAdminSerializer(serializers.Serializer):
    """
    AddCompanySerializer

    ŠTA RADI:
    - dodaje novu firmu za već postojećeg usera

    ZAŠTO:
    - odvajamo registration flow od company managementa
    - sigurnije (koristi request.user)
    """

    email = serializers.EmailField()
    name = serializers.CharField(max_length=100)
    address = serializers.CharField(max_length=255, required=False, allow_blank=True)

    def create(self, validated_data):
        """Create new company admin role for existing user."""

        email = validated_data["email"]
        user = User.objects.get(email=email)
        company = self.context["company"]

        with transaction.atomic():
            company = Company.objects.create(
                name=validated_data["name"],
                address=validated_data.get("address", ""),
            )
            role = Role.objects.get(code="COMPANYADMIN")
            UserRookeryRole.objects.create(
                user=user,
                company=company,
                role=role
            )

        return company
            

    def validate_email(self, email):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")
        return email
    
    

class ServiceChargeListSerializer(serializers.ModelSerializer):
    """
    ServiceChargeListSerializer

    WHAT:
    - Flat serializer for CompanyAdmin billing table

    WHY:
    - FE needs simple structure:
      Block | Property | Owner | Charge | Paid | Remaining | Status

    APPROACH:
    - No nesting
    - Aggregates for payments
    - Derived fields for status
    """

    block_name = serializers.CharField(source="property.block.name", read_only=True)
    property_name = serializers.CharField(source="property.name", read_only=True)
    company_name = serializers.CharField(source="company.name", read_only=True)
    period_name = serializers.CharField(source="service_period.name", read_only=True)

    owner_name = serializers.SerializerMethodField()
    display_label = serializers.SerializerMethodField()

    paid = serializers.SerializerMethodField()
    remaining = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    last_payment_date = serializers.SerializerMethodField()

    class Meta:
        model = ServiceCharge
        fields = [
            "id",
            "block_name",
            "property_name",
            "company_name",
            "owner_name",
            "display_label",
            "period_name",  # ostavljamo (debug + FE context)
            "amount",
            "paid",
            "remaining",
            "status",
            "last_payment_date",
            "notice_sent_at",
        ]

    def get_owner_name(self, obj):
        """
        Returns first owner (simple version)

        NOTE:
        - Later we can improve with active owner logic
        """
        owner = obj.property.owners.first()

        if not owner:
            return "-"

        if owner.user:
            full_name = f"{owner.user.first_name} {owner.user.last_name}".strip()
            return full_name or owner.user.email

        return owner.display_name or "-"

    def get_display_label(self, obj):
        first_owner = obj.property.owners.first()
        return first_owner.display_label if first_owner else ""

    def get_paid(self, obj):
        """
        Sum of all payments
        """
        return obj.payments.aggregate(total=Sum("amount"))["total"] or 0

    def get_remaining(self, obj):
        """
        Remaining = charge - paid
        """
        return obj.amount - self.get_paid(obj)

    def get_status(self, obj):
        """
        UI status logic
        """
        paid = self.get_paid(obj)

        if paid == 0:
            return "unpaid"
        elif paid >= obj.amount:
            return "paid"
        return "partial"

    def get_last_payment_date(self, obj):
        """
        Last payment date (optional UI info)
        """
        return obj.payments.aggregate(last=Max("date_paid"))["last"]


class ServicePeriodSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for period dropdown data.
    Only id + name are needed by the FE filter select.
    """

    class Meta:
        model = ServicePeriod
        fields = ["id", "name"]
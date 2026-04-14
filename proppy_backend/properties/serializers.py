# properties/serializers.py
from rest_framework import serializers
from users.models import Role
from .models import Block, Property, PropertyOwner, UserRookeryRole, Company
from django.contrib.auth import get_user_model
from django.db import transaction


User = get_user_model()


class PropertyOwnerSerializer(serializers.ModelSerializer):
    """
    PropertyOwner CRUD (company admin). `property` comes from URL, not body.
    """

    email = serializers.EmailField(write_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = PropertyOwner
        fields = [
            "id",
            "email",
            "user_email",
            "display_name",
            "date_from",
            "date_to",
            "comment",
            "order",
        ]

    def get_fields(self):
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


class PropertySerializer(serializers.ModelSerializer):
    """
    Simple serializer for Property.

    WHY:
    - used inside Block
    - owners nested read-only for list/detail
    """

    owners = PropertyOwnerSerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = ["id", "name", "comment", "owners"]


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
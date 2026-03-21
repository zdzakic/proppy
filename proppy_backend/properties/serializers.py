# serializers.py
from rest_framework import serializers
from django.db import transaction
from .models import Property, Company, CompanyMembership
from django.contrib.auth import get_user_model
from users.validators import validate_password_match

User = get_user_model()

class OwnershipSerializer(serializers.Serializer):
    """
    Serializer for representing ownership relationships in a flat structure.

    This is a manual serializer (not ModelSerializer) because it pulls fields 
    from multiple related models: `User` (owner) and `Property`. It is used for
    aggregated read-only API views (e.g. list of ownerships).
    """
    owner_id = serializers.IntegerField(source='user.id')
    owner_email = serializers.EmailField(source='user.email')
    owner_name = serializers.SerializerMethodField()

    property_id = serializers.IntegerField(source='property.id')
    property_name = serializers.CharField(source='property.name')
    block_id = serializers.IntegerField(source='property.block.id', default=None)
    block_name = serializers.CharField(source='property.block.name', default=None)
    company_name = serializers.CharField(source='property.company.name', default=None)
    comment = serializers.CharField(source='property.comment')

    def get_owner_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()    


class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer for the Property model including extra read-only fields.

    Adds `block_name` and `company_name` for convenience in frontend displays,
    avoiding extra queries on the client side. Uses `source` to access related
    fields through foreign keys.
    """
    block_name = serializers.CharField(source='block.name', read_only=True)
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'name', 'comment', 'block', 'block_name', 'company', 'company_name']


class OwnerListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.SerializerMethodField()
    email = serializers.EmailField()
    properties = serializers.SerializerMethodField()

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_properties(self, obj):
        return [
            {
                "id": ownership.property.id,
                "name": ownership.property.name
            }
            for ownership in obj.ownerships.all()
        ]


class CompanyRegistrationSerializer(serializers.Serializer):
    """
    Serializer for self-service company registration.

    What it does:
    - accepts the minimal data needed for onboarding
    - creates a new user
    - creates a new company
    - links the user to that company as admin via CompanyMembership

    Why this approach:
    - we are creating multiple related models in one flow
    - plain Serializer is a better fit than ModelSerializer here
    - transaction.atomic() ensures all-or-nothing DB writes
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    company_name = serializers.CharField(max_length=255)

    def validate_email(self, value):
        """
        Validate that the email is unique.
        """
        value = value.lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with this email already exists.")
        return value

    def validate_password(self, value):
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError as DjangoValidationError

        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        return value

    def validate(self, data):
        validate_password_match(
            data["password"],
            data["password_confirm"]
        )
        return data

    @transaction.atomic
    def create(self, validated_data):
        """
        Create user + company + company membership in a single transaction.

        Why atomic:
        - if any step fails, nothing is partially saved
        - prevents half-created onboarding state
        """
        validated_data.pop("password_confirm")

        email = validated_data["email"]
        password = validated_data["password"]
        company_name = validated_data["company_name"]

        try:
            user = User.objects.create_user(
                email=email,
                password=password,
            )
        except IntegrityError:
            raise serializers.ValidationError(
                {"email": "User with this email already exists."}
            )
             

        company = Company.objects.create(
            name=company_name,
        )

        CompanyMembership.objects.create(
            user=user,
            company=company,
            role="admin",
        )

        return user
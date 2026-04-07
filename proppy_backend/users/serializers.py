# users/serializers.py

"""
Serializers for user authentication and representation.

Why:
- JWT login needs CustomTokenObtainPairSerializer
- API endpoints (like /users/me/) need a UserSerializer
"""


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth import get_user_model
from properties.models import Company, UserRookeryRole
from users.models import Role


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Basic serializer for returning user data via API.

    Why:
    - Used by /users/me/ endpoint
    - Avoids repeating user fields in multiple places
    """
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_active",
            "roles"
        ]

    def get_roles(self, obj):        
        return list(set(
            obj.rookery_roles
            .select_related("role")
            .values_list("role__code", flat=True))
        )


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # koristi email kao username

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get("request"), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

        roles = list(set(
            user.rookery_roles.select_related("role").values_list("role__code", flat=True))) # list(set(user.rookery_roles.select_related("role").values_list("role__code", flat=True)))

        self.user = user
        data = super().validate(attrs)
        data['user'] = {
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff,
            'is_active': user.is_active,    
            'roles': roles
        }
        return data


class RegisterCompanySerializer(serializers.Serializer):
    """
    RegisterCompanySerializer

    ŠTA RADI:
    - validira input
    - kreira user + company + COMPANYADMIN role

    ZAŠTO Serializer:
    - multi-model create (nije jedan model)
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    company_name = serializers.CharField()

    def validate_email(self, value):
        value = value.lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match."
            })
        return data

    def create(self, validated_data):
        with transaction.atomic():

            # 1. USER
            user = User.objects.create_user(
                email=validated_data["email"],
                password=validated_data["password"]
            )

            # 2. COMPANY
            company = Company.objects.create(
                name=validated_data["company_name"]
            )

            # 3. ROLE
            role = Role.objects.get(code="COMPANYADMIN")

            # 4. LINK
            UserRookeryRole.objects.create(
                user=user,
                company=company,
                role=role
            )

        return user


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["id", "name"]
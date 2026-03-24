# users/serializers.py

"""
Serializers for user authentication and representation.

Why:
- JWT login needs CustomTokenObtainPairSerializer
- API endpoints (like /users/me/) need a UserSerializer
"""


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """
    Basic serializer for returning user data via API.

    Why:
    - Used by /users/me/ endpoint
    - Avoids repeating user fields in multiple places
    """

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "is_staff",
            "is_active",
        ]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'  # koristi email kao username

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        user = authenticate(request=self.context.get("request"), email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")

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
        }
        return data
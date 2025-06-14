# users/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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
            'name': user.first_name,
            'is_admin': user.is_staff,
        }
        return data
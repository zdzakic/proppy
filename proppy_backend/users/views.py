from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.generics import RetrieveAPIView
from .serializers import CustomTokenObtainPairSerializer,UserSerializer, RegisterCompanySerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken


User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    JWT login endpoint.
    POST /api/token/
    """

    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(RetrieveAPIView):
    """
    Returns currently authenticated user.
    GET /api/users/me/

    Why:
    - Frontend refresh
    - Dashboard initialization
    """
    

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterCompanyView(APIView):
    """
    Register company + auto login

    ZAŠTO APIView:1
    - custom flow (nije CRUD)
    """

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterCompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # 🔥 AUTO LOGIN (bitno za UX)
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Registration successful",
            "user": {
                "id": user.id,
                "email": user.email,
            },
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
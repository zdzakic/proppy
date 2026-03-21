from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.generics import RetrieveAPIView
from .serializers import CustomTokenObtainPairSerializer,UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model


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
import os

from rest_framework_simplejwt.views import TokenObtainPairView
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .serializers import CustomTokenObtainPairSerializer,UserSerializer, RegisterCompanySerializer, CompanySerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from properties.models import Company, UserRookeryRole
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from django.core.mail import send_mail
from core.pagination import OptionalPageNumberPagination


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



class DeleteCompanyView(APIView):
    """
    Delete company (and optionally user).

    WHY APIView:
    - custom logic (nije čist CRUD)
    - kontrola nad flow-om (kao RegisterCompanyView)

    RULES:
    - samo COMPANYADMIN može obrisati firmu
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request, company_id):
        user = request.user

        admin_roles = UserRookeryRole.objects.filter(
            user=user,
            role__code="COMPANYADMIN"
        )

        is_admin = admin_roles.filter(company_id=company_id).exists()
        if not is_admin:
            raise PermissionDenied("You are not admin of this company.")

        admin_companies_count = (
            admin_roles.values("company_id").distinct().count()
        )
        if admin_companies_count <= 1:
            raise PermissionDenied("You cannot delete your last company.")

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response(
                {"detail": "Company not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        company_id_val = company.id
        company.delete()

        return Response(
            {"message": f"Company {company_id_val} deleted"},
            status=status.HTTP_200_OK
        )



class CompanyListView(ListAPIView):
    """
    Returns all companies where user is COMPANYADMIN.

    WHY:
    - frontend company switch
    - dashboard context
    """

    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = OptionalPageNumberPagination

    def get_queryset(self):
        user = self.request.user

        company_ids = UserRookeryRole.objects.filter(
            user=user,
            role__code="COMPANYADMIN"
        ).values_list("company_id", flat=True)

        # return Company.objects.filter(id__in=company_ids).order_by("id")
        return Company.objects.filter(id__in=company_ids).annotate(
            block_count=Count('blocks', distinct=True),
            property_count=Count('blocks__properties', distinct=True)
        ).order_by("id")


class UpdateCompanyView(APIView):
    """
    Update company name for companies where user is COMPANYADMIN.
    """

    permission_classes = [IsAuthenticated]

    def put(self, request, company_id):
        user = request.user

        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response(
                {"detail": "Company not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        is_admin = UserRookeryRole.objects.filter(
            user=user,
            company=company,
            role__code="COMPANYADMIN",
        ).exists()

        if not is_admin:
            raise PermissionDenied("You are not admin of this company.")

        serializer = CompanySerializer(company, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)




class PasswordResetRequestView(APIView):
    """
    Password reset request endpoint.
    POST /api/users/password-reset/

    Handles password reset requests by sending a reset link via email.
    Always returns success to prevent email enumeration.
    """

    permission_classes = [AllowAny]

    def post(self, request):
        # Get email from request data
        email = request.data.get("email")

        # Validate that email is provided
        if not email:
            return Response(
                {"detail": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find user by email (do not reveal if user exists for security)
        user = User.objects.filter(email=email).first()

        if user:
            # Generate secure token and UID for password reset
            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
            reset_link = f"{frontend_url}/reset-password/{uid}/{token}/"

            # Send reset email to console (for development; configure EMAIL_BACKEND in settings)
            send_mail(
                subject="Password Reset Request",
                message=f"Click here to reset your password: {reset_link}",
                from_email="noreply@proppy.com",  # Use a default from email
                recipient_list=[email],
                fail_silently=False,  # Raise error if email fails
            )

        # Always return 200 OK for security (prevents email enumeration)
        return Response(
            {"message": "If the email exists, a reset link has been sent."},
            status=status.HTTP_200_OK
        )


class PasswordResetConfirmView(APIView):
    """
    Password reset confirm endpoint.
    POST /api/users/password-reset/confirm/
    """

    permission_classes = [AllowAny]
    token_generator = PasswordResetTokenGenerator()

    def post(self, request):
        # Extract data from request
        uid = request.data.get("uid")
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        # Validate that all required fields are provided
        if not all([uid, token, new_password]):
            return Response(
                {"detail": "Missing fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Decode UID and retrieve user
        try:
            uid = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid)
        except Exception:
            return Response(
                {"detail": "Invalid UID."},
                status=status.HTTP_400_BAD_REQUEST
            )
   
        # Check if token is valid for this user
        if not self.token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid token."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set new password and save user
        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )
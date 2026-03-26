# properties/views.py

from rest_framework import generics, permissions
from .models import Block, UserRookeryRole
from .serializers import BlockSerializer
from .permissions import IsCompanyAdmin


class BlockListAPIView(generics.ListAPIView):
    """
    Returns blocks for companies where user is COMPANYADMIN.

    WHY ListAPIView:
    - read-only endpoint
    - minimal code
    - DRF handles everything else
    """

    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        user = self.request.user

        company_ids = UserRookeryRole.objects.filter(
            user=user,
            role__code="COMPANYADMIN"
        ).values_list("company_id", flat=True)

        return Block.objects.filter(
            company_id__in=company_ids
        ).prefetch_related("properties")


class BlockCreateAPIView(generics.CreateAPIView):
    """
    Create Block.

    WHY CreateAPIView:
    - standard DRF create flow
    - minimal code
    - serializer handles validation

    RULES:
    - only COMPANYADMIN
    - only inside own company
    """

    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]


























# from rest_framework.views import APIView
# from rest_framework import generics
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Ownership, Property
# from .serializers import OwnershipSerializer, PropertySerializer, OwnerListSerializer, CompanyRegistrationSerializer
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from users.permissions import IsOwnerOrAdmin
# from users.models import User
# from rest_framework_simplejwt.tokens import RefreshToken

# class OwnershipListAPIView(generics.ListAPIView):
#     """
#     Returns ownership records:
#     - Admins see all ownerships
#     - Owners see only their own

#     Why ListAPIView:
#     - Enables pagination, filtering, and ordering
#     - Cleaner than APIView (no need for custom `get()` method)
#     - Works seamlessly with DRF's ecosystem

#     Why get_queryset():
#     - Filters data based on authenticated user's role
#     - Ensures modular and testable access control logic
#     - Keeps data exposure safe and controlled

#     Why RolePermission (IsOwnerOrAdmin):
#     - Ensures only users with role 'owner' or 'admin' can access this view
#     - Easily extendable for future roles (e.g. manager, support)
#     - Prevents unauthorized access before any DB queries are executed
#     """

#     permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
#     serializer_class = OwnershipSerializer

#     def get_queryset(self):
#         user = self.request.user

#         if user.role == 'admin':
#             return Ownership.objects.select_related('user', 'property')
#         elif user.role == 'owner':
#             return Ownership.objects.select_related('user', 'property').filter(user=user)
#         else:
#             return Ownership.objects.none()


# class PropertyListAPIView(generics.ListAPIView):
#     """
#     Returns all property records:
#     - Admins and Owners can access the full list

#     Why ListAPIView:
#     - Inherits built-in pagination, filtering and ordering
#     - Avoids manual query logic, leverages DRF capabilities

#     Why get_queryset():
#     - Clean separation of filtering logic from view behavior
#     - Only users with roles 'admin' or 'owner' can access
#     - Future filtering rules can be easily injected per role

#     Why RolePermission (IsOwnerOrAdmin):
#     - Ensures role-based access control at the permission level
#     - Centralized and consistent across all views
#     """

#     permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
#     serializer_class = PropertySerializer

#     def get_queryset(self):
#         user = self.request.user

#         if user.role in ['admin', 'owner']:
#             return Property.objects.select_related('company', 'block')
#         else:
#             return Property.objects.none()


# class OwnerListAPIView(generics.ListAPIView):
#     """
#     Returns a list of owners with their properties.

#     - Admins see all owners
#     - Owners see only themselves
#     """

#     permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
#     serializer_class = OwnerListSerializer

#     def get_queryset(self):
#         qs = User.objects.filter(role='owner').prefetch_related(
#             'ownerships__property',
#             'ownerships__property__block'
#         )

#         user = self.request.user
#         if user.role == 'owner':
#             return qs.filter(id=user.id)
#         return qs



# class CompanyRegistrationView(APIView):
#     """
#     API endpoint for self-service company registration.

#     What it does:
#     - receives registration data
#     - delegates creation logic to serializer
#     - returns JWT tokens immediately after successful registration

#     Why APIView:
#     - this is a custom onboarding flow, not standard model CRUD
#     - APIView keeps the logic explicit and easy to extend later
#     """

#     permission_classes = [AllowAny]

#     def post(self, request, *args, **kwargs):
#         """
#         Register a new company admin account and issue JWT tokens.
#         """
#         serializer = CompanyRegistrationSerializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         user = serializer.save()

#         refresh = RefreshToken.for_user(user)

#         return Response(
#             {
#                 "message": "Registration successful.",
#                 "user": {
#                     "id": user.id,
#                     "email": user.email,
#                 },
#                 "tokens": {
#                     "refresh": str(refresh),
#                     "access": str(refresh.access_token),
#                 },
#             },
#             status=status.HTTP_201_CREATED,
#         )
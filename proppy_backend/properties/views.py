# views.py
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.response import Response
from .models import Ownership, Property
from .serializers import OwnershipSerializer, PropertySerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsOwnerOnly, IsAdminOnly, IsTenantOnly, IsOwnerOrAdmin

class OwnershipListAPIView(generics.ListAPIView):
    """
    Returns ownership records:
    - Admins see all ownerships
    - Owners see only their own

    Why ListAPIView:
    - Enables pagination, filtering, and ordering
    - Cleaner than APIView (no need for custom `get()` method)
    - Works seamlessly with DRF's ecosystem

    Why get_queryset():
    - Filters data based on authenticated user's role
    - Ensures modular and testable access control logic
    - Keeps data exposure safe and controlled

    Why RolePermission (IsOwnerOrAdmin):
    - Ensures only users with role 'owner' or 'admin' can access this view
    - Easily extendable for future roles (e.g. manager, support)
    - Prevents unauthorized access before any DB queries are executed
    """

    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = OwnershipSerializer

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Ownership.objects.select_related('user', 'property')
        elif user.role == 'owner':
            return Ownership.objects.select_related('user', 'property').filter(user=user)
        else:
            return Ownership.objects.none()



class PropertyListAPIView(generics.ListAPIView):
    """
    Returns all property records:
    - Admins and Owners can access the full list

    Why ListAPIView:
    - Inherits built-in pagination, filtering and ordering
    - Avoids manual query logic, leverages DRF capabilities

    Why get_queryset():
    - Clean separation of filtering logic from view behavior
    - Only users with roles 'admin' or 'owner' can access
    - Future filtering rules can be easily injected per role

    Why RolePermission (IsOwnerOrAdmin):
    - Ensures role-based access control at the permission level
    - Centralized and consistent across all views
    """

    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = PropertySerializer

    def get_queryset(self):
        user = self.request.user

        if user.role in ['admin', 'owner']:
            return Property.objects.select_related('company', 'block')
        else:
            return Property.objects.none()

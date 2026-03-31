from rest_framework.permissions import BasePermission
from .models import UserRookeryRole


class IsCompanyAdmin(BasePermission):
    """
    Checks if user has COMPANYADMIN role.

    WHY:
    - reusable across endpoints
    - keeps views clean
    """

    message = "Only company admins allowed."

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        return UserRookeryRole.objects.filter(
            user=user,
            role__code="COMPANYADMIN"
        ).exists()

    def has_object_permission(self, request, view, obj):
        """
        Check if user is admin for the specific object's company.
        """
        user = request.user
        
        if not user or not user.is_authenticated:
            return False
            
        # Get company from object (block or property)
        if hasattr(obj, 'company'):
            company = obj.company
        elif hasattr(obj, 'block') and hasattr(obj.block, 'company'):
            company = obj.block.company
        else:
            return False
            
        return UserRookeryRole.objects.filter(
            user=user,
            company=company,
            role__code="COMPANYADMIN"
        ).exists()
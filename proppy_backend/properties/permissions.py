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
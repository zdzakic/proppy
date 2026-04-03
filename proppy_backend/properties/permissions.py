from rest_framework.permissions import BasePermission

from .models import Block, Property, PropertyOwner, UserRookeryRole


def _company_for_obj(obj):
    if isinstance(obj, Block):
        return obj.company
    if isinstance(obj, Property):
        return obj.block.company
    if isinstance(obj, PropertyOwner):
        return obj.property.block.company
    return None


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

        company = _company_for_obj(obj)
        if company is None:
            return False

        return UserRookeryRole.objects.filter(
            user=user,
            company=company,
            role__code="COMPANYADMIN",
        ).exists()
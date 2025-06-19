from rest_framework.permissions import BasePermission

class RolePermission(BasePermission):
    """
    Base permission class for role-based access.
    Define `allowed_roles` in subclasses.
    """

    allowed_roles = []

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in self.allowed_roles


class IsOwnerOnly(RolePermission):
    allowed_roles = ['owner']


class IsAdminOnly(RolePermission):
    allowed_roles = ['admin']


class IsTenantOnly(RolePermission):
    allowed_roles = ['tenant']


class IsOwnerOrAdmin(RolePermission):
    allowed_roles = ['owner', 'admin']

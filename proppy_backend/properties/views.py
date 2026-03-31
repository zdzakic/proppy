# properties/views.py

from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from .models import Block, UserRookeryRole, Property
from .serializers import BlockSerializer, PropertySerializer
from .permissions import IsCompanyAdmin


class CompanyAdminScopedMixin:
    """
    Centralize: "COMPANYADMIN => which companies user can act on".
    """

    def get_admin_company_ids(self):
        user = self.request.user
        return UserRookeryRole.objects.filter(
            user=user,
            role__code="COMPANYADMIN"
        ).values_list("company_id", flat=True)

    def get_properties_queryset(self, *, block_id=None, with_owners_prefetch=True):
        company_ids = self.get_admin_company_ids()
        qs = Property.objects.filter(block__company_id__in=company_ids)
        if with_owners_prefetch:
            qs = qs.prefetch_related("owners")
        if block_id:
            qs = qs.filter(block_id=block_id)
        return qs


class BlockListAPIView(CompanyAdminScopedMixin, generics.ListAPIView):
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
        company_ids = self.get_admin_company_ids()
        return Block.objects.filter(company_id__in=company_ids).prefetch_related("properties")


class BlockCreateAPIView(generics.CreateAPIView):
    """
    Create Block.

    WHY CreateAPIView:
    - standard DRF create flow
    - minimal codes
    - serializer handles validation

    RULES:
    - only COMPANYADMIN
    - only inside own company
    """

    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]


class BlockDeleteAPIView(generics.DestroyAPIView):
    """
    Delete Block.

    RULES:
    - only COMPANYADMIN
    - only within user's company
    """

    queryset = Block.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        block_id = instance.id
        
        self.perform_destroy(instance)

        return Response(
            {"message": f"Block {block_id} deleted successfully"}, 
            status=status.HTTP_200_OK
        )


class PropertyListAPIView(CompanyAdminScopedMixin, generics.ListAPIView):
    """
    Returns properties for blocks where user is COMPANYADMIN.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        block_id = self.kwargs.get('block_id')
        return self.get_properties_queryset(block_id=block_id)


class PropertyCreateAPIView(CompanyAdminScopedMixin, generics.CreateAPIView):
    """
    Create Property.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def perform_create(self, serializer):
        block_id = self.kwargs.get('block_id')

        company_ids = self.get_admin_company_ids()
        try:
            # Ensure the block belongs to a company where the user is COMPANYADMIN.
            block = Block.objects.get(id=block_id, company_id__in=company_ids)
        except Block.DoesNotExist:
            raise PermissionDenied("You cannot create property in this block.")

        serializer.save(block=block)


class PropertyUpdateAPIView(CompanyAdminScopedMixin, generics.UpdateAPIView):
    """
    Update Property.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        block_id = self.kwargs.get('block_id')
        return self.get_properties_queryset(block_id=block_id, with_owners_prefetch=False)


class PropertyDestroyAPIView(CompanyAdminScopedMixin, generics.DestroyAPIView):
    """
    Delete Property.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        block_id = self.kwargs.get('block_id')
        return self.get_properties_queryset(block_id=block_id, with_owners_prefetch=False)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        property_id = instance.id
        
        self.perform_destroy(instance)

        return Response(
            {"message": f"Property {property_id} deleted successfully"}, 
            status=status.HTTP_200_OK
        )

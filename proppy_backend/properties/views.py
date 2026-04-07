# properties/views.py

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status
from users.models import Role
from .models import Block, UserRookeryRole, Property, PropertyOwner
from .serializers import BlockSerializer, PropertySerializer, PropertyOwnerSerializer, AddCompanyAdminSerializer
from .permissions import IsCompanyAdmin
from django.contrib.auth import get_user_model
from rest_framework.views import APIView


User = get_user_model()


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
            qs = qs.prefetch_related("owners", "owners__user")
        if block_id:
            qs = qs.filter(block_id=block_id)
        return qs

    def get_property_for_scope(self):
        """
        Property must belong to block_id in URL and to a company where request user is COMPANYADMIN.
        """
        block_id = self.kwargs.get("block_id")
        property_id = self.kwargs.get("property_id")
        company_ids = self.get_admin_company_ids()
        return get_object_or_404(
            Property,
            id=property_id,
            block_id=block_id,
            block__company_id__in=company_ids,
        )


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
        return Block.objects.filter(company_id__in=company_ids).prefetch_related(
            "properties",
            "properties__owners",
            "properties__owners__user",
        )


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


class PropertyOwnerListAPIView(CompanyAdminScopedMixin, generics.ListAPIView):
    serializer_class = PropertyOwnerSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        prop = self.get_property_for_scope()
        return (
            PropertyOwner.objects.filter(property=prop)
            .select_related("user")
            .order_by("order", "id")
        )


class PropertyOwnerCreateAPIView(CompanyAdminScopedMixin, generics.CreateAPIView):
    serializer_class = PropertyOwnerSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def perform_create(self, serializer):
        prop = self.get_property_for_scope()
        email = serializer.validated_data.pop("email").lower()
        user = User.objects.filter(email=email).first()

        if not user:
            import uuid
            user = User.objects.create_user(email=email, password=str(uuid.uuid4()))

        with transaction.atomic():
            owner = serializer.save(property=prop, user=user)
            role_owner, _ = Role.objects.get_or_create(
                code="OWNER",
                defaults={"name": "Owner"},
            )
            UserRookeryRole.objects.get_or_create(
                user=user,
                company=prop.block.company,
                role=role_owner,
                property_owner=owner,
            )


class PropertyOwnerRetrieveAPIView(CompanyAdminScopedMixin, generics.RetrieveAPIView):
    serializer_class = PropertyOwnerSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        prop = self.get_property_for_scope()
        return PropertyOwner.objects.filter(property=prop).select_related("user")


class PropertyOwnerUpdateAPIView(CompanyAdminScopedMixin, generics.UpdateAPIView):
    serializer_class = PropertyOwnerSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        prop = self.get_property_for_scope()
        return PropertyOwner.objects.filter(property=prop).select_related("user")


class PropertyOwnerDestroyAPIView(CompanyAdminScopedMixin, generics.DestroyAPIView):
    serializer_class = PropertyOwnerSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        prop = self.get_property_for_scope()
        return PropertyOwner.objects.filter(property=prop)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        owner_id = instance.id
        UserRookeryRole.objects.filter(property_owner=instance).delete()
        self.perform_destroy(instance)
        return Response(
            {"message": f"Property owner {owner_id} deleted successfully"},
            status=status.HTTP_200_OK,
        )

class AddCompanyView(APIView):
    """
    Add new company for logged-in user.

    WHY:
    - omogućava postojećem useru da doda firmu
    - koristi request.user → nema sigurnosnog rizika
    """

    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def post(self, request):
        serializer = AddCompanyAdminSerializer(data=request.data, context={"company": None})
        serializer.is_valid(raise_exception=True)
        company = serializer.save()
    
        return Response({
            "message": "Company added successfully",
            "company_id": company.id,
            "company_name": company.name}, 
            status=status.HTTP_201_CREATED)
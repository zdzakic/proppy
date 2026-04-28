# properties/views.py

from django.db import transaction
from django.db.models import Max
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework import status
from users.models import Role
from .models import Block, UserRookeryRole, Property, PropertyOwner, ServiceCharge, Payment, ServicePeriod
from .serializers import BlockSerializer, PropertySerializer, PropertyOwnerSerializer, \
    AddCompanyAdminSerializer, ServiceChargeListSerializer
from .serializers_payment import PaymentCreateSerializer
from .permissions import IsCompanyAdmin
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from core.pagination import OptionalPageNumberPagination


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
        qs = Property.objects.filter(block__company_id__in=company_ids).order_by("id")
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

    def resolve_single_admin_company(self):
        """
        Resolve company from COMPANYADMIN scope when request body does not include it.
        """
        admin_roles = UserRookeryRole.objects.filter(
            user=self.request.user,
            role__code="COMPANYADMIN",
        ).select_related("company")

        if not admin_roles.exists():
            raise PermissionDenied("You are not assigned as COMPANYADMIN.")

        if admin_roles.count() > 1:
            raise PermissionDenied("Company is required when you manage multiple companies.")

        return admin_roles.first().company


class BlockListCreateAPIView(CompanyAdminScopedMixin, generics.ListCreateAPIView):
    """
    Returns blocks for companies where user is COMPANYADMIN.

    WHY ListCreateAPIView:
    - list + create on one endpoint
    - minimal code
    - DRF handles everything else
    """

    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]
    pagination_class = OptionalPageNumberPagination

    def get_queryset(self):
        company_ids = self.get_admin_company_ids()
        return Block.objects.filter(company_id__in=company_ids).prefetch_related(
            "properties",
            "properties__owners",
            "properties__owners__user",
        ).order_by("id")

    def perform_create(self, serializer):
        company = serializer.validated_data.get("company")

        if company is None:
            company = self.resolve_single_admin_company()

        serializer.save(company=company)


class BlockRetrieveUpdateDestroyAPIView(CompanyAdminScopedMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    REST-style block endpoint used by frontend:
    - GET    /blocks/{id}/
    - PUT    /blocks/{id}/
    - DELETE /blocks/{id}/
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

    def perform_update(self, serializer):
        # Keep existing company on update unless explicit value is provided and validated.
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        block_id = instance.id
        self.perform_destroy(instance)
        return Response(
            {"message": f"Block {block_id} deleted successfully"},
            status=status.HTTP_200_OK,
        )


class PropertyListAPIView(CompanyAdminScopedMixin, generics.ListAPIView):
    """
    Returns properties for blocks where user is COMPANYADMIN.
    """
    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]
    pagination_class = OptionalPageNumberPagination

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
    pagination_class = OptionalPageNumberPagination

    def get_queryset(self):
        prop = self.get_property_for_scope()
        return (
            PropertyOwner.objects.filter(property=prop)
            .select_related("user")
            .order_by("order", "id")
        )


class PropertyOwnerCreateAPIView(CompanyAdminScopedMixin, generics.CreateAPIView):
    """
    Create Property Owner

    WHAT:
    - CompanyAdmin creates owner for a property

    DOES:
    - creates or reuses User (by email)
    - creates PropertyOwner (link user ↔ property)
    - assigns OWNER role in company
    """
    serializer_class = PropertyOwnerSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def perform_create(self, serializer):
        """
        Create Property Owner
        
        WHAT:
        - creates or reuses User (by email)
        - creates PropertyOwner (link user ↔ property)
        - assigns OWNER role in company
        """
        prop = self.get_property_for_scope()
        data = serializer.validated_data

        email = data.get("email").lower()
        first_name = data.get("first_name", "")
        last_name = data.get("last_name", "")
        phone = data.get("phone", "")
        address_1 = data.get("address_1", "")
        postcode = data.get("postcode", "")
        country = data.get("country", "")

        # ✅ CREATE OR REUSE USER
        user = User.objects.filter(email=email).first()

        if not user:
            import uuid
            user = User.objects.create_user(
                email=email,
                password=str(uuid.uuid4()),  # random → reset later
                first_name=first_name,
                last_name=last_name,
                phone=phone,
                address_1=address_1,
                postcode=postcode,
                country=country,
            )
        else:
            # User already exists (e.g. re-assigned after delete in edit flow).
            # Update their profile so the edit form reflects the submitted values on next open.
            user.first_name = first_name
            user.last_name = last_name
            user.phone = phone
            user.address_1 = address_1
            user.postcode = postcode
            user.country = country
            user.save(update_fields=["first_name", "last_name", "phone", "address_1", "postcode", "country"])

        # ✅ CREATE OWNER + ROLE
        with transaction.atomic():

            display_name = (
                data.get("display_name")
                or f"{first_name} {last_name}".strip()
                or email
            )

            # 🚫 Prevent duplicate owner for same property
            if user and PropertyOwner.objects.filter(property=prop, user=user).exists():
                raise ValidationError("This user is already an owner of this property.")

            owner = serializer.save(
                property=prop,
                user=user,
                display_name=display_name
            )

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
            "company_name": company.name,
            "company_address": company.address,
        }, status=status.HTTP_201_CREATED)


class PropertyGlobalListAPIView(CompanyAdminScopedMixin, generics.ListAPIView):
    """
    GLOBAL PROPERTY LIST (WITH OWNERS)

    WHAT:
    - returns all properties for companies where user is COMPANYADMIN

    WHY:
    - used for ownership management UI
    - shows properties WITH and WITHOUT owners
    """

    serializer_class = PropertySerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]
    pagination_class = OptionalPageNumberPagination

    def get_queryset(self):
        company_ids = self.get_admin_company_ids()

        owners_qs = PropertyOwner.objects.select_related("property", "property__block", "user")

        return (
            Property.objects
            .filter(block__company_id__in=company_ids)
            .select_related("block", "block__company")
            .prefetch_related(Prefetch("owners", queryset=owners_qs))
            .order_by("id")
        )
        
        
class ServiceChargeListView(CompanyAdminScopedMixin, ListAPIView):
    """
    ServiceChargeListView

    WHAT:
    - Returns billing table data for CompanyAdmin

    WHY:
    - Main dashboard for tracking payments

    LOGIC:
    - Scoped to user's companies
    - If ?period is provided → filter by that service_period
    - If no ?period → return all charges across all periods
    """

    serializer_class = ServiceChargeListSerializer
    permission_classes = [IsCompanyAdmin]

    def get_queryset(self):
        company_ids = self.get_admin_company_ids()

        qs = ServiceCharge.objects.filter(
            company_id__in=company_ids
        ).select_related(
            "property__block",
            "service_period",
        ).prefetch_related(
            "payments",
            "property__owners",
        )

        period_id = self.request.query_params.get("period")
        if period_id:
            qs = qs.filter(service_period_id=period_id)

        return qs


class PaymentCreateView(CompanyAdminScopedMixin, generics.CreateAPIView):
    """
    PaymentCreateView
    - POST /payments/

    Creates a payment for a ServiceCharge, scoped to the admin's companies.
    """

    serializer_class = PaymentCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsCompanyAdmin]

    def perform_create(self, serializer):
        company_ids = self.get_admin_company_ids()
        service_charge = serializer.validated_data.get("service_charge")

        allowed_charge = get_object_or_404(
            ServiceCharge.objects.select_related("property__block__company"),
            id=service_charge.id,
            property__block__company_id__in=company_ids,
        )

        serializer.save(service_charge=allowed_charge)
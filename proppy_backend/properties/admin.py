from django.contrib import admin
from django.db.models import Count, Sum

from .models import Company, Block, Property, PropertyOwner, \
    UserRookeryRole, ServiceCharge, Payment, ServicePeriod


class GhostCompanyFilter(admin.SimpleListFilter):
    """Firma kreirana ali bez ijednog bloka (nema ni nekretnina ispod)."""

    title = "prazna firma (ghost)"
    parameter_name = "ghost"

    def lookups(self, request, model_admin):
        return (
            ("1", "Da — 0 blokova"),
            ("0", "Ne — ima barem jedan blok"),
        )

    def queryset(self, request, queryset):
        if self.value() == "1":
            return queryset.filter(block_count=0)
        if self.value() == "0":
            return queryset.filter(block_count__gt=0)
        return queryset


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "address", "is_valid", "block_count_display", "property_count_display")
    search_fields = ("name", "address")
    list_filter = (GhostCompanyFilter,)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(
            block_count=Count("blocks", distinct=True),
            property_count=Count("blocks__properties", distinct=True),
        )

    @admin.display(description="Blokovi", ordering="block_count")
    def block_count_display(self, obj):
        return getattr(obj, "block_count", 0)

    @admin.display(description="Nekretnine", ordering="property_count")
    def property_count_display(self, obj):
        return getattr(obj, "property_count", 0)


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "company")
    search_fields = ("name", "company__name")
    list_filter = ("company",)


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "block")
    search_fields = ("name", "block__name", "block__company__name")
    list_filter = ("block__company",)


@admin.register(PropertyOwner)
class PropertyOwnerAdmin(admin.ModelAdmin):
    list_display = ("user", "property", "date_from", "date_to")
    search_fields = ("user__email", "property__name")
    list_filter = ("property__block__company",)
    autocomplete_fields = ("user", "property")


class CompanyAdminGhostFilter(admin.SimpleListFilter):
    """COMPANYADMIN dodijeljen firmi koja još nema blokove."""

    title = "COMPANYADMIN / prazna firma"
    parameter_name = "ca_ghost"

    def lookups(self, request, model_admin):
        return (("1", "Da — admin, firma bez blokova"),)

    def queryset(self, request, queryset):
        if self.value() == "1":
            return queryset.filter(role__code="COMPANYADMIN", block_count=0)
        return queryset


@admin.register(UserRookeryRole)
class UserRookeryRoleAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "company",
        "role",
        "block_count_display",
        "property_count_display",
        "property_owner",
    )
    list_filter = ("role", "company", CompanyAdminGhostFilter)
    search_fields = ("user__email", "company__name")
    autocomplete_fields = ("user", "company", "property_owner")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("user", "company", "role").annotate(
            block_count=Count("company__blocks", distinct=True),
            property_count=Count("company__blocks__properties", distinct=True),
        )

    @admin.display(description="Blokovi (firma)", ordering="block_count")
    def block_count_display(self, obj):
        return getattr(obj, "block_count", 0)

    @admin.display(description="Nekretnine (firma)", ordering="property_count")
    def property_count_display(self, obj):
        return getattr(obj, "property_count", 0)
    
    
@admin.register(ServiceCharge)
class ServiceChargeAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "property",
        "company",
        "service_period",
        "amount",
        "paid_amount",
        "remaining_amount",
        "status",
    )

    list_filter = ("service_period", "property__block__company")

    search_fields = (
        "property__name",
        "property__block__name",
        "property__block__company__name",
    )

    def company(self, obj):
        return obj.property.block.company

    def paid_amount(self, obj):
        return obj.payments.aggregate(total=Sum("amount"))["total"] or 0

    def remaining_amount(self, obj):
        return obj.amount - self.paid_amount(obj)

    def status(self, obj):
        paid = self.paid_amount(obj)

        if paid == 0:
            return "UNPAID"
        elif paid >= obj.amount:
            return "PAID"
        return "PARTIAL"
    


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """
    What:
    Admin for payments

    Why:
    Quick manual entry and debugging
    """

    list_display = (
        "id",
        "service_charge",
        "property",
        "company",
        "amount",
        "date_paid",
    )

    list_filter = ("date_paid", "service_charge__property__block__company")

    search_fields = ("service_charge__property__name",)

    def property(self, obj):
        return obj.service_charge.property

    def company(self, obj):
        return obj.service_charge.property.block.company
    


@admin.register(ServicePeriod)
class ServicePeriodAdmin(admin.ModelAdmin):
    """
    What:
    Billing periods per company

    Why:
    Needed for filtering and organization
    """

    list_display = (
        "id",
        "name",
        "company",
        "start_date",
        "end_date",
        "is_active",
    )

    list_filter = ("company", "is_active")

    search_fields = ("name", "company__name")
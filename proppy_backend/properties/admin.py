from django.contrib import admin
from .models import Company, Block, Property, PropertyOwner, UserRookeryRole


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "address", "is_valid")
    search_fields = ("name", "address")


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


@admin.register(UserRookeryRole)
class UserRookeryRoleAdmin(admin.ModelAdmin):
    list_display = ("user", "company", "role", "property_owner")
    list_filter = ("role", "company")
    search_fields = ("user__email", "company__name")
    autocomplete_fields = ("user", "company", "property_owner")
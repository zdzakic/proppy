from django.contrib import admin
from .models import Company, Block, Property, PropertyOwner


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "is_valid")


@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ("name", "company")


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("name", "block")  


@admin.register(PropertyOwner)
class PropertyOwnerAdmin(admin.ModelAdmin):
    list_display = ("user", "property", "date_from", "date_to")
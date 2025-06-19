from django.contrib import admin
from .models import Company, Block, Property, Ownership
from django.conf import settings

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_valid')
    search_fields = ('name',)

@admin.register(Block)
class BlockAdmin(admin.ModelAdmin):
    list_display = ('name', 'company')
    search_fields = ('name',)
    list_filter = ('company',)

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'block')
    list_filter = ('company', 'block')
    search_fields = ('name',)

@admin.register(Ownership)
class OwnershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'property', 'start_date', 'end_date')
    list_filter = ('start_date', 'end_date')
    search_fields = ('user__email', 'property__name')

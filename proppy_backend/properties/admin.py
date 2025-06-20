from django.contrib import admin
from .models import Company, Block, Property, Ownership, Insurance, HealthSafety
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
    list_display = ('user', 'property', 'get_block_id', 'get_block_name', 'start_date', 'end_date')
    list_filter = ('start_date', 'end_date', 'property__block')
    search_fields = ('user__email', 'property__name', 'property__block__name')
    raw_id_fields = ('user', 'property')

    def get_block_id(self, obj):
        return obj.property.block.id if obj.property.block else "-"
    get_block_id.short_description = 'Block ID'

    def get_block_name(self, obj):
        return obj.property.block.name if obj.property.block else "-"
    get_block_name.short_description = 'Block Name'


@admin.register(Insurance)
class InsuranceAdmin(admin.ModelAdmin):
    list_display = ('company', 'insurance_type', 'start_date', 'end_date', 'provider')
    search_fields = ('insurance_type', 'provider', 'provider_reference')
    list_filter = ('company', 'insurance_type')

@admin.register(HealthSafety)
class HealthSafetyAdmin(admin.ModelAdmin):
    list_display = ('company', 'document_type', 'start_date', 'end_date', 'amount')
    search_fields = ('document_type', 'provider', 'provider_reference')
    list_filter = ('company', 'document_type')
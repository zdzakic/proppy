from django.contrib import admin
from .models import Owner, Property

@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'date_left')

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('name', 'block_id')
    filter_horizontal = ('owners',)

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('email', 'first_name', 'last_name', 'phone', 'role', 'is_active', 'is_staff')
    ordering = ('email',)
    list_filter = ('role', 'is_staff', 'is_active')

    fieldsets = (
        (None, {
            'fields': ('email', 'password', 'first_name', 'last_name', 'address', 'phone', 'date_left', 'comment', 'role')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email', 'first_name', 'last_name', 'address', 'phone', 'date_left', 'comment',
                'role', 'password1', 'password2', 'is_active', 'is_staff'
            )}
        ),
    )

    search_fields = ('email', 'first_name', 'last_name', 'phone')

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Proper Django UserAdmin.

    WHY:
    - ensures password is hashed correctly
    - uses Django built-in forms
    """

    model = User

    list_display = ("email", "first_name", "last_name", "is_staff")
    ordering = ("email",)
    list_filter = ("is_active", "is_staff", "is_superuser")
    readonly_fields = ("date_created",)
    search_fields = ("email", "first_name", "last_name")

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("first_name", "last_name", "title")}),
        ("Address", {"fields": ("address_1", "address_2", "postcode", "country")}),
        ("Other", {"fields": ("phone", "gender", "date_of_birth", "comment","date_created")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2"),
        }),
    )

    search_fields = ("email",)

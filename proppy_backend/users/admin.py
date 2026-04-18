from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db.models import Count, Prefetch

from properties.models import UserRookeryRole

from .models import User, Role


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Proper Django UserAdmin.

    WHY:
    - ensures password is hashed correctly
    - uses Django built-in forms
    """

    model = User

    list_display = ("email", "first_name", "last_name", "rookery_roles_summary", "is_staff")
    ordering = ("email",)
    list_filter = ("is_active", "is_staff", "is_superuser")
    readonly_fields = ("date_created",)
    search_fields = ("email", "first_name", "last_name")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        rr_qs = UserRookeryRole.objects.select_related("company", "role").annotate(
            _block_count=Count("company__blocks", distinct=True),
            _property_count=Count("company__blocks__properties", distinct=True),
        )
        return qs.prefetch_related(Prefetch("rookery_roles", queryset=rr_qs))

    @admin.display(description="Roles / companies (B=blocks, P=properties)")
    def rookery_roles_summary(self, obj):
        parts: list[str] = []
        for rr in obj.rookery_roles.all():
            code = rr.role.code if rr.role_id else "?"
            cname = rr.company.name if rr.company_id else "?"
            bc = getattr(rr, "_block_count", 0)
            pc = getattr(rr, "_property_count", 0)
            parts.append(f"{code} @ {cname} (B:{bc} P:{pc})")
        return "; ".join(parts) if parts else "—"

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



@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("code", "name")
    search_fields = ("code", "name")

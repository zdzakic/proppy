from django.db import models
from django.contrib.auth import get_user_model
from users.models import Role
from .constants import TITLE_CHOICES

User = get_user_model()


# =========================================================
# COMPANY
# =========================================================
class Company(models.Model):
    """
    Represents a company managing properties.

    WHY:
    - Top-level tenant in system
    - One company manages multiple blocks and properties
    """

    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)
    is_valid = models.BooleanField(default=True)
    comment = models.TextField(blank=True)

    def __str__(self):
        return self.name


# =========================================================
# BLOCK
# =========================================================
class Block(models.Model):
    """
    Represents a building block.

    WHY:
    - Company → Blocks → Properties hierarchy
    """

    name = models.CharField(max_length=255)

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="blocks"
    )

    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.company.name})"      


# =========================================================
# PROPERTY
# =========================================================
class Property(models.Model):
    """
    Represents an apartment / flat / unit.

    WHY:
    - Each block contains multiple properties
    """

    name = models.CharField(max_length=255)

    block = models.ForeignKey(
        Block,
        on_delete=models.CASCADE,
        related_name="properties"
    )

    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.block.name})"


# =========================================================
# PROPERTY OWNER (ownership history)
# =========================================================
class PropertyOwner(models.Model):
    """
    Links User ↔ Property.

    WHY:
    - Tracks ownership history over time
    - Supports multiple owners and historical changes

    IMPORTANT:
    - This is the ONLY place where ownership lives
    """

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="owners"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_properties",
        null=False,
        blank=False,
    )

    display_name = models.CharField(max_length=255, blank=True)
    title = models.CharField(max_length=10, blank=True, choices=TITLE_CHOICES, default='', help_text='Title of the owner')
    date_from = models.DateField(null=True, blank=True)
    date_to = models.DateField(null=True, blank=True)
    comment = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    display_label = models.CharField(max_length=255,blank=True, help_text="UI label (default: first_name + property name)"
)
    
    def save(self, *args, **kwargs):
        """
        Ensure display_value has a default value if not provided.

        Why:
        - Used for UI display (OwnerTable)
        - Allows user override
        - Keeps logic centralized
        """

        if not self.display_label:
            first_name = ""

            if self.user and self.user.first_name:
                first_name = self.user.first_name

            property_name = ""
            if self.property and self.property.name:
                property_name = self.property.name

            self.display_label = f"{first_name}-{property_name}"

        super().save(*args, **kwargs)
    

    def __str__(self):
        owner_label = self.user.email if self.user else self.display_name or "Unknown owner"
        return f"{owner_label} → {self.property.name}"


# =========================================================
# USER ROOKERY ROLE (ACCESS CONTROL)
# =========================================================
class UserRookeryRole(models.Model):
    """
    UserRookeryRole

    Purpose:
    - Defines application-level access for a user within a specific company

    This is NOT ownership:
    - Ownership is handled via PropertyOwner model

    This IS access control:
    - Determines whether a user can access the application
    - Defines what role they have (OWNER, COMPANYADMIN, ADMIN)

    Key relationships:
    - user → who
    - company → where
    - role → how (permissions level)
    - property_owner → optional link (required only for OWNER role)

    Example:
    - User A is COMPANYADMIN in Company X
    - User B is OWNER in Company Y (linked to PropertyOwner)

    Design note:
    - Role is a ForeignKey → avoids hardcoded strings and ensures consistency
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="rookery_roles"
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="user_roles"
    )

    # role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    role = models.ForeignKey(
        Role,
        on_delete=models.CASCADE,
        related_name="user_roles",
        help_text="Defines the role of the user within a company context"
    )

    property_owner = models.ForeignKey(
        PropertyOwner,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    def clean(self):
        """
        Business validation for role assignment.

        Rules:
        - OWNER must have property_owner
        - property_owner must belong to the same user
        - property_owner must belong to the same company

        Why:
        - Prevents inconsistent data (wrong ownership links)
        """

        from django.core.exceptions import ValidationError

        # Rule 1: OWNER must have property_owner
        if self.role and self.role.code == "OWNER" and not self.property_owner:
            raise ValidationError("OWNER role must have a related PropertyOwner.")

        # Rule 2: property_owner must match user
        if self.property_owner and self.property_owner.user != self.user:
            raise ValidationError("PropertyOwner must belong to the same user.")

        # Rule 3: property_owner must match company
        if self.property_owner:
            property_company = self.property_owner.property.block.company
            if property_company != self.company:
                raise ValidationError("PropertyOwner must belong to the same company.")

    def __str__(self):
        return f"{self.user.email} - {self.role} ({self.company.name})"

    def save(self, *args, **kwargs):
        """
        Ensure model validation is always executed.

        Why:
        - Django does NOT call clean() automatically on save()
        - Without this, invalid data can be inserted via API or scripts
        """
        # self.full_clean()
        super().save(*args, **kwargs)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "company", "role"],
                condition=models.Q(property_owner__isnull=True),
                name="unique_user_company_role_no_property_owner",
            ),
            models.UniqueConstraint(
                fields=["property_owner"],
                condition=models.Q(property_owner__isnull=False),
                name="unique_userrookeryrole_per_property_owner",
            ),
        ]


# =========================================================
# SERVICES
# =========================================================
class Service(models.Model):
    """
    Defines service type (plumber, electrician, etc).

    WHY:
    - External service providers
    - May later get system access
    """

    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class UserService(models.Model):
    """
    Links user to service type.

    WHY:
    - A user can provide multiple services
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="services"
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE
    )

    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.service}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "service"],
                name="unique_user_service"
            )
        ]


# =========================================================
# SERVICE PERIOD (billing cycle)
# =========================================================
class ServicePeriod(models.Model):
    """
    Defines a billing period (e.g. June 2026).

    WHY:
    - Groups charges per cycle
    - Enables filtering and reporting
    """

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="service_periods"
    )

    name = models.CharField(max_length=100)
    due_date = models.DateField()
    is_active = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.company.name})"
    
    
# =========================================================
# SERVICE CHARGE (what is owed)
# =========================================================
class ServiceCharge(models.Model):
    """
    Represents the amount owed by a property for a given period.

    WHY:
    - Core financial entity
    - Tracks debt per property
    """

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="service_charges"
    )

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="service_charges"
    )

    service_period = models.ForeignKey(
        ServicePeriod,
        on_delete=models.CASCADE,
        related_name="charges"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    notice_sent_at = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["property", "service_period"],
                name="unique_property_service_period_charge"
            )
        ]

    def __str__(self):
        return f"{self.property} - {self.amount} ({self.service_period})"
    

# =========================================================
# PAYMENT (what is paid)
# =========================================================
class Payment(models.Model):
    """
    Represents a payment towards a ServiceCharge.

    WHY:
    - Allows tracking payments separately
    - Supports partial payments
    """

    service_charge = models.ForeignKey(
        ServiceCharge,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_paid = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    comment = models.TextField(blank=True)

    def __str__(self):
        return f"{self.amount} paid on {self.date_paid}"
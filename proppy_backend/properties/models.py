from django.db import models
from django.contrib.auth import get_user_model

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
        related_name="owned_properties"
    )

    display_name = models.CharField(max_length=255, blank=True)

    date_from = models.DateField(null=True, blank=True)
    date_to = models.DateField(null=True, blank=True)

    comment = models.TextField(blank=True)

    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.email} → {self.property.name}"


# =========================================================
# USER ROOKERY ROLE (ACCESS CONTROL)
# =========================================================

class UserRookeryRole(models.Model):
    """
    Defines access to the system.

    WHY:
    - Central table from Access DB
    - Controls who can access which company

    IMPORTANT:
    - OWNER requires property_owner
    """

    ROLE_CHOICES = [
        ("OWNER", "Owner"),
        ("COMPANYADMIN", "Company Admin"),
        ("ADMIN", "System Admin"),
    ]

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

    role = models.CharField(max_length=50, choices=ROLE_CHOICES)

    property_owner = models.ForeignKey(
        PropertyOwner,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def clean(self):
        """
        Business rule from Access:

        OWNER must be linked to a PropertyOwner record.
        """
        from django.core.exceptions import ValidationError

        if self.role == "OWNER" and not self.property_owner:
            raise ValidationError("OWNER must have property_owner assigned")

    def __str__(self):
        return f"{self.user.email} - {self.role}"


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
        return f"{self.user.email} - {self.service.name}"

# class Company(models.Model):
#     name = models.CharField(max_length=255)         
#     address = models.TextField()                    
#     is_valid = models.BooleanField(default=True)    
#     comment = models.TextField(blank=True)          

#     def __str__(self):
#         return self.name


# class Block(models.Model):
#     name = models.CharField(max_length=255)            
#     company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='blocks') 
#     comment = models.TextField(blank=True)         

#     def __str__(self):
#         return self.name


# class Property(models.Model):
#     name = models.CharField(max_length=255)  # propertyname
#     company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='properties')
#     block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True, blank=True)
#     comment = models.TextField(blank=True)

#     def __str__(self):
#         return self.name


# # class Ownership(models.Model):
# #     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ownerships')
# #     property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='ownerships')
# #     start_date = models.DateField(null=True, blank=True)
# #     end_date = models.DateField(null=True, blank=True)  # null znači da je još uvijek aktivno
# #     comment = models.TextField(blank=True)

# #     def __str__(self):
# #         return f"{self.user.email} → {self.property.name} ({self.start_date} to {self.end_date or 'present'})"

# class Ownership(models.Model):
#     """
#     Represents relationship between user and property.

#     ZAŠTO:
#     - jedan user može imati više stanova
#     - jedan stan može imati više usera
#     - mora postojati kontekst (owner ili tenant)

#     ŠTA RJEŠAVA:
#     - zamjenjuje ownerrole iz Access baze
#     - omogućava više role-a za istog usera
#     """

#     ROLE_CHOICES = (
#         ("owner", "Owner"),
#         ("tenant", "Tenant"),
#     )

#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name='ownerships'
#     )

#     property = models.ForeignKey(
#         Property,
#         on_delete=models.CASCADE,
#         related_name='ownerships'
#     )

#     role = models.CharField(              
#         max_length=20,
#         choices=ROLE_CHOICES
#     )

#     start_date = models.DateField(null=True, blank=True)
#     end_date = models.DateField(null=True, blank=True)
#     comment = models.TextField(blank=True)

#     def __str__(self):
#         return f"{self.user.email} → {self.property.name} ({self.role})"


# class Insurance(models.Model):
#     """
#     Represents an insurance record associated with a specific insurance company.
#     The company field is a foreign key to the Company model (tblCompanies),
#     matching the structure shown in the Access DB diagram (inscompanyid → companyid).
#     """
#     company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='insurances')
#     insurance_type = models.CharField(max_length=100)
#     start_date = models.DateField()
#     end_date = models.DateField(null=True, blank=True)
#     provider = models.CharField(max_length=255)
#     provider_reference = models.CharField(max_length=100, blank=True) 

#     def __str__(self):
#         return f"{self.insurance_type} ({self.company.name})"



# class HealthSafety(models.Model):
#     """
#     Represents a Health & Safety record linked to a specific company.
#     Follows structure from MS Access table 'tblHanS'.
#     """
#     company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='health_safety_docs')
#     document_type = models.CharField(max_length=100)  # hanstype
#     start_date = models.DateField()  # hansdtstart
#     end_date = models.DateField(null=True, blank=True)  # hansdtend
#     provider = models.TextField()  # hansprovider
#     provider_reference = models.CharField(max_length=100, blank=True)  # provnumber
#     amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # hansamount

#     def __str__(self):
#         return f"{self.document_type} ({self.company.name})"


# class CompanyMembership(models.Model):
#     """
#     Connects a user with a company and stores the user's role inside that company.

#     Why this exists:
#     - Django auth user represents identity/login only.
#     - Company-level access must be modeled separately because one company can have
#       multiple admins, and one user may belong to multiple companies later.

#     What this solves:
#     - introduces company_admin role cleanly
#     - prepares the backend for company-scoped permissions
#     - keeps the design scalable without changing current auth flow yet
#     """

#     ROLE_CHOICES = (
#         ("admin", "Company Admin"),
#     )

#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name="company_memberships",
#     )
#     company = models.ForeignKey(
#         Company,
#         on_delete=models.CASCADE,
#         related_name="memberships",
#     )
#     role = models.CharField(
#         max_length=20,
#         choices=ROLE_CHOICES,
#         default="admin",
#     )

#     # Optional metadata, useful later if you want Access-like history/comments.
#     display_name = models.CharField(max_length=255, blank=True)
#     date_from = models.DateField(null=True, blank=True)
#     date_to = models.DateField(null=True, blank=True)
#     comment = models.TextField(blank=True)
#     order_index = models.PositiveIntegerField(null=True, blank=True)

#     class Meta:
#         unique_together = ("user", "company", "role")

#     def __str__(self):
#         return f"{self.user.email} -> {self.company.name} ({self.role})"


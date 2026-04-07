from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# =========================================================
# USER MANAGER
# =========================================================

class CustomUserManager(BaseUserManager):
    """
    Custom manager for User model.

    WHY:
    - Django default expects username
    - We use email as unique identifier

    SOLVES:
    - authentication using email + password
    """
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

# =========================================================
# USER (tblPerson equivalent)
# =========================================================
class User(AbstractBaseUser, PermissionsMixin):
    """
    Central user entity.

    WHY:
    - Represents a real person in the system
    - Based on Access tblPerson structure

    IMPORTANT:
    - NO role field here (roles handled via relations)
    - Email is used for authentication
    """

    # AUTH
    email = models.EmailField(unique=True)

    # BASIC INFO
    title = models.CharField(max_length=50, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)

    # ADDRESS
    address_1 = models.CharField(max_length=255, blank=True)
    address_2 = models.CharField(max_length=255, blank=True)
    postcode = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # CONTACT
    phone = models.CharField(max_length=50, blank=True)

    # EXTRA
    gender = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    date_left = models.DateField(null=True, blank=True)

    comment = models.TextField(blank=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    date_created = models.DateTimeField(auto_now_add=True)

    # DJANGO FLAGS
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class Role(models.Model):
    """
    Role model

    Purpose:
    - Represents a catalog of all application roles (e.g. OWNER, COMPANYADMIN, ADMIN)

    Why this exists:
    - Replaces hardcoded string roles with a normalized database table
    - Enables validation, consistency, and easier querying

    Design decision:
    - `code` is used as a stable identifier (e.g. "OWNER")
    - `name` is human-readable (e.g. "Owner")

    Future extensibility:
    - Can be extended with permissions, scopes, flags, etc.
    """

    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} ({self.name})"
    
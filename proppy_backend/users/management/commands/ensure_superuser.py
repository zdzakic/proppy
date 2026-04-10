import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or upgrade a superuser from environment variables if needed."

    def handle(self, *args, **options):
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "").strip().lower()
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "")
        first_name = os.getenv("DJANGO_SUPERUSER_FIRST_NAME", "").strip()
        last_name = os.getenv("DJANGO_SUPERUSER_LAST_NAME", "").strip()

        if not email or not password:
            self.stdout.write(
                self.style.WARNING(
                    "Skipping superuser creation: DJANGO_SUPERUSER_EMAIL or DJANGO_SUPERUSER_PASSWORD not set."
                )
            )
            return

        user_model = get_user_model()
        user = user_model.objects.filter(email=email).first()

        if user is None:
            user_model.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            self.stdout.write(self.style.SUCCESS(f"Created superuser {email}."))
            return

        updated_fields = []

        if not user.is_staff:
            user.is_staff = True
            updated_fields.append("is_staff")

        if not user.is_superuser:
            user.is_superuser = True
            updated_fields.append("is_superuser")

        if first_name and user.first_name != first_name:
            user.first_name = first_name
            updated_fields.append("first_name")

        if last_name and user.last_name != last_name:
            user.last_name = last_name
            updated_fields.append("last_name")

        if updated_fields:
            user.save(update_fields=updated_fields)
            self.stdout.write(self.style.SUCCESS(f"Updated existing user {email} to superuser."))
            return

        self.stdout.write(self.style.SUCCESS(f"Superuser {email} already exists."))

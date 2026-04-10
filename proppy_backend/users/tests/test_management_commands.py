import os

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase


User = get_user_model()


class EnsureSuperuserCommandTests(TestCase):
    def tearDown(self):
        for key in [
            "DJANGO_SUPERUSER_EMAIL",
            "DJANGO_SUPERUSER_PASSWORD",
            "DJANGO_SUPERUSER_FIRST_NAME",
            "DJANGO_SUPERUSER_LAST_NAME",
        ]:
            os.environ.pop(key, None)

    def test_creates_superuser_when_env_vars_exist(self):
        os.environ["DJANGO_SUPERUSER_EMAIL"] = "admin@test.com"
        os.environ["DJANGO_SUPERUSER_PASSWORD"] = "StrongPass123"
        os.environ["DJANGO_SUPERUSER_FIRST_NAME"] = "Admin"
        os.environ["DJANGO_SUPERUSER_LAST_NAME"] = "User"

        call_command("ensure_superuser")

        user = User.objects.get(email="admin@test.com")
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertEqual(user.first_name, "Admin")
        self.assertEqual(user.last_name, "User")
        self.assertTrue(user.check_password("StrongPass123"))

    def test_noop_when_env_vars_missing(self):
        call_command("ensure_superuser")
        self.assertEqual(User.objects.count(), 0)

    def test_upgrades_existing_user_to_superuser(self):
        user = User.objects.create_user(email="admin@test.com", password="StrongPass123")
        self.assertFalse(user.is_superuser)

        os.environ["DJANGO_SUPERUSER_EMAIL"] = "admin@test.com"
        os.environ["DJANGO_SUPERUSER_PASSWORD"] = "StrongPass123"

        call_command("ensure_superuser")

        user.refresh_from_db()
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
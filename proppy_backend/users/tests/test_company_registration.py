from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from users.models import Role
from properties.models import Company, UserRookeryRole

User = get_user_model()


class RegisterCompanyTests(TestCase):
    """
    Tests for company registration endpoint.

    ŠTA TESTIRAMO:
    - success flow (user + company + role + tokens)
    - validation errors
    - edge cases (duplicate email)
    """

    def setUp(self):
        self.client = APIClient()

        # ensure role exists
        self.role = Role.objects.create(
            code="COMPANYADMIN",
            name="Company Admin"
        )

    # --------------------------------------------------
    # ✅ SUCCESS CASE
    # --------------------------------------------------
    def test_register_company_success(self):
        payload = {
            "email": "newuser@test.com",
            "password": "Test123!",
            "password_confirm": "Test123!",
            "company_name": "Test Company"
        }

        response = self.client.post(
            "/api/users/register-company/",
            payload,
            format="json"
        )

        self.assertEqual(response.status_code, 201)

        data = response.json()

        # ✅ tokens returned
        self.assertIn("tokens", data)
        self.assertIn("access", data["tokens"])
        self.assertIn("refresh", data["tokens"])

        # ✅ user created
        user = User.objects.get(email="newuser@test.com")
        self.assertIsNotNone(user)

        # ✅ company created
        company = Company.objects.get(name="Test Company")
        self.assertIsNotNone(company)

        # ✅ role assigned
        urr = UserRookeryRole.objects.get(user=user, company=company)
        self.assertEqual(urr.role.code, "COMPANYADMIN")

    # --------------------------------------------------
    # ❌ PASSWORD MISMATCH
    # --------------------------------------------------
    def test_register_company_password_mismatch(self):
        payload = {
            "email": "fail@test.com",
            "password": "Test123!",
            "password_confirm": "Wrong123!",
            "company_name": "Fail Company"
        }

        response = self.client.post(
            "/api/users/register-company/",
            payload,
            format="json"
        )

        self.assertEqual(response.status_code, 400)

        data = response.json()
        self.assertIn("password_confirm", data)

    # --------------------------------------------------
    # ❌ DUPLICATE EMAIL
    # --------------------------------------------------
    def test_register_company_duplicate_email(self):
        # existing user
        User.objects.create_user(
            email="existing@test.com",
            password="Test123!"
        )

        payload = {
            "email": "existing@test.com",
            "password": "Test123!",
            "password_confirm": "Test123!",
            "company_name": "Another Company"
        }

        response = self.client.post(
            "/api/users/register-company/",
            payload,
            format="json"
        )

        self.assertEqual(response.status_code, 400)

        data = response.json()
        self.assertIn("email", data)

    # --------------------------------------------------
    # ❌ MISSING FIELD
    # --------------------------------------------------
    def test_register_company_missing_company_name(self):
        payload = {
            "email": "missing@test.com",
            "password": "Test123!",
            "password_confirm": "Test123!"
        }

        response = self.client.post(
            "/api/users/register-company/",
            payload,
            format="json"
        )

        self.assertEqual(response.status_code, 400)

        data = response.json()
        self.assertIn("company_name", data)
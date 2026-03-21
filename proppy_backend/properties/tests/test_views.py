import pytest
from rest_framework.test import APIClient
from django.test import override_settings
from users.models import User
from properties.models import Company, CompanyMembership


@pytest.fixture
def api_client():
    return APIClient()


REGISTER_URL = "/api/properties/register-company/"


@pytest.mark.django_db
class TestCompanyRegistrationView:
    """
    Tests for company registration endpoint.

    What we cover:
    - successful registration
    - duplicate email handling
    - password mismatch validation
    - DB integrity (user + company + membership)
    """

    def test_register_company_success(self, api_client):
        data = {
            "email": "admin@test.com",
            "password": "Test12345!",
            "password_confirm": "Test12345!",
            "company_name": "Test Company",
        }

        response = api_client.post(REGISTER_URL, data, format="json")

        assert response.status_code == 201

        # response data
        assert response.data["user"]["email"] == data["email"]
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]

        # DB checks
        user = User.objects.get(email=data["email"])
        company = Company.objects.get(name=data["company_name"])
        membership = CompanyMembership.objects.get(user=user, company=company)

        assert membership.role == "admin"

    def test_register_company_duplicate_email(self, api_client):
        data = {
            "email": "admin@test.com",
            "password": "Test12345!",
            "password_confirm": "Test12345!",
            "company_name": "Test Company",
        }

        # prvi request OK
        api_client.post(REGISTER_URL, data, format="json")

        # drugi request FAIL
        response = api_client.post(REGISTER_URL, data, format="json")

        assert response.status_code == 400
        assert "email" in response.data

    def test_register_company_password_mismatch(self, api_client):
        data = {
            "email": "admin@test.com",
            "password": "Test12345!",
            "password_confirm": "Different123!",
            "company_name": "Test Company",
        }

        response = api_client.post(REGISTER_URL, data, format="json")

        assert response.status_code == 400
        assert "password" in response.data

    def test_register_company_creates_all_entities(self, api_client):
        """
        Explicit DB integrity test.

        Ensures:
        - user is created
        - company is created
        - membership is linked correctly
        """

        data = {
            "email": "owner@test.com",
            "password": "Test12345!",
            "password_confirm": "Test12345!",
            "company_name": "Owner Company",
        }

        api_client.post(REGISTER_URL, data, format="json")

        assert User.objects.filter(email=data["email"]).exists()
        assert Company.objects.filter(name=data["company_name"]).exists()

        user = User.objects.get(email=data["email"])
        company = Company.objects.get(name=data["company_name"])

        assert CompanyMembership.objects.filter(
            user=user,
            company=company,
            role="admin"
        ).exists()

@pytest.mark.django_db
@override_settings(
    AUTH_PASSWORD_VALIDATORS=[
        {
            "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
            "OPTIONS": {"min_length": 8},
        }
    ]
)
def test_register_company_weak_password(api_client):
    url = "/api/properties/register-company/"

    data = {
        "email": "weak@test.com",
        "password": "123",  # preslab
        "password_confirm": "123",
        "company_name": "Weak Company",
    }

    response = api_client.post(url, data, format="json")

    assert response.status_code == 400
    assert "password" in response.data
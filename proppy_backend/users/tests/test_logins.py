from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from users.models import Role
from properties.models import Company, UserRookeryRole

User = get_user_model()

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='test@example.com',
            password='securepass123',
            first_name='Test',
            last_name='User',
        )

    def test_login_returns_token_pair(self):
        response = self.client.post('/api/token/', {
            'email': 'test@example.com',
            'password': 'securepass123'
        })

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn('access', data)
        self.assertIn('refresh', data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['email'], 'test@example.com')

    def test_refresh_token_returns_new_access_token(self):
        login_response = self.client.post('/api/token/', {
            'email': 'test@example.com',
            'password': 'securepass123'
        })

        self.assertEqual(login_response.status_code, 200)
        refresh_token = login_response.json().get('refresh')
        self.assertIsNotNone(refresh_token)

        refresh_response = self.client.post('/api/token/refresh/', {
            'refresh': refresh_token
        })

        self.assertEqual(refresh_response.status_code, 200)
        data = refresh_response.json()

        self.assertIn('access', data)
        self.assertTrue(len(data['access']) > 0)

    def test_me_endpoint_returns_roles(self):
        """
        Debug test – print roles iz /me endpointa
        """

        # create role
        role, _ = Role.objects.get_or_create(
            code="COMPANYADMIN",
            defaults={"name": "Company Admin"},
        )

        # create user
        user = User.objects.create_user(
            email="me@test.com",
            password="Test123!"
        )

        # create company
        company = Company.objects.create(name="Test Company")

        # link role
        UserRookeryRole.objects.create(
            user=user,
            company=company,
            role=role
        )

        # authenticate
        self.client.force_authenticate(user=user)

        response = self.client.get("/api/users/me/")

        self.assertEqual(response.status_code, 200)

        data = response.json()

        print("\nROLES:", data["roles"])



class PasswordResetRequestViewTests(APITestCase):
    def setUp(self):
        self.url = "/api/users/password-reset/"

    def test_password_reset_request_returns_200_for_existing_user(self):
        User.objects.create_user(email="existing@example.com", password="testpass123")

        response = self.client.post(self.url, {"email": "existing@example.com"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {"message": "If the email exists, a reset link has been sent."}
        )

    def test_password_reset_request_returns_200_for_unknown_email(self):
        response = self.client.post(self.url, {"email": "unknown@example.com"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {"message": "If the email exists, a reset link has been sent."}
        )

    def test_password_reset_request_requires_email(self):
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["detail"], "Email is required.")
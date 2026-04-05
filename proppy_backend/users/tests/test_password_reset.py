from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core import mail
from django.test import override_settings

User = get_user_model()


class PasswordResetTestCase(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='oldpassword123'
        )
        self.reset_url = reverse('password-reset')
        self.confirm_url = reverse('password-reset-confirm')

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_password_reset_request_valid_email(self):
        """Test password reset request with valid email."""
        data = {'email': 'test@example.com'}
        response = self.client.post(self.reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('reset link has been sent', response.data['message'])
        # Check that email was sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('test@example.com', mail.outbox[0].to)
        self.assertIn('Password Reset Request', mail.outbox[0].subject)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_password_reset_request_invalid_email(self):
        """Test password reset request with invalid email (no user)."""
        data = {'email': 'nonexistent@example.com'}
        response = self.client.post(self.reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('reset link has been sent', response.data['message'])
        # Email should not be sent for non-existent user
        self.assertEqual(len(mail.outbox), 0)

    def test_password_reset_request_missing_email(self):
        """Test password reset request with missing email."""
        data = {}
        response = self.client.post(self.reset_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Email is required', response.data['detail'])

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_password_reset_confirm_valid(self):
        """Test password reset confirm with valid data."""
        # First, request reset to get token
        data = {'email': 'test@example.com'}
        self.client.post(self.reset_url, data, format='json')
        # Get the token from email
        email_body = mail.outbox[0].body
        # Extract uid and token from the link (assuming format: .../reset-password/{uid}/{token}/)
        # For simplicity, since we know uid='MQ' for pk=1, but here pk may vary
        # In test, we can extract from the email
        import re
        match = re.search(r'/reset-password/([^/]+)/([^/]+)/', email_body)
        if match:
            uid = match.group(1)
            token = match.group(2)
        else:
            self.fail("Could not extract uid and token from email")

        # Now confirm with new password
        confirm_data = {
            'uid': uid,
            'token': token,
            'new_password': 'newpassword123'
        }
        response = self.client.post(self.confirm_url, confirm_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Password has been reset successfully', response.data['message'])

        # Check that password was changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))

    def test_password_reset_confirm_invalid_uid(self):
        """Test password reset confirm with invalid uid."""
        data = {
            'uid': 'invalid',
            'token': 'invalid',
            'new_password': 'newpassword123'
        }
        response = self.client.post(self.confirm_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid UID', response.data['detail'])

    def test_password_reset_confirm_invalid_token(self):
        """Test password reset confirm with invalid token."""
        # Use valid uid but invalid token
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        data = {
            'uid': uid,
            'token': 'invalidtoken',
            'new_password': 'newpassword123'
        }
        response = self.client.post(self.confirm_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Invalid token', response.data['detail'])

    def test_password_reset_confirm_missing_fields(self):
        """Test password reset confirm with missing fields."""
        data = {}
        response = self.client.post(self.confirm_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Missing fields', response.data['detail'])
from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',  # ⬅️ obavezno
            email='test@example.com',
            password='securepass123'
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
        # Prvo login
        login_response = self.client.post('/api/token/', {
            'email': 'test@example.com',
            'password': 'securepass123'
        })

        self.assertEqual(login_response.status_code, 200)
        refresh_token = login_response.json().get('refresh')
        self.assertIsNotNone(refresh_token)

        # Sad refresh
        refresh_response = self.client.post('/api/token/refresh/', {
            'refresh': refresh_token
        })

        self.assertEqual(refresh_response.status_code, 200)
        data = refresh_response.json()

        self.assertIn('access', data)
        self.assertTrue(len(data['access']) > 0)

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from properties.models import Owner, Property


class OwnershipListAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = Owner.objects.create(name="John Smith", email="john@example.com")
        self.property = Property.objects.create(
            name="Flat A",
            block_id=101,
            comment="Nice flat"
        )
        self.owner.properties.add(self.property)

    def test_returns_ownership_data(self):
        response = self.client.get('/api/properties/ownerships/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 1)

        expected = {
            "owner_id": self.owner.id,
            "owner_name": "John Smith",
            "owner_email": "john@example.com",
            "property_id": self.property.id,
            "property_name": "Flat A",
            "block_id": 101,
            "comment": "Nice flat"
        }

        self.assertDictEqual(data[0], expected)

    def test_returns_multiple_ownership_entries(self):
        owner2 = Owner.objects.create(name="Ana Novak", email="ana@example.com")
        property2 = Property.objects.create(
            name="Flat B",
            block_id=202,
            comment="Cozy and modern"
        )
        owner2.properties.add(property2)

        response = self.client.get('/api/properties/ownerships/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 2)

        # Basic checks
        names = [entry["owner_name"] for entry in data]
        self.assertIn("John Smith", names)
        self.assertIn("Ana Novak", names)

    def test_returns_empty_list_when_no_owners(self):
        # Očisti bazu ručno
        Owner.objects.all().delete()
        Property.objects.all().delete()

        response = self.client.get('/api/properties/ownerships/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data, [])

    def test_owner_list_returns_all_owners_with_properties(self):
        # Setup još jednog vlasnika
        owner2 = Owner.objects.create(name="Ana Novak", email="ana@example.com")
        property2 = Property.objects.create(name="Flat B", block_id=202, comment="New flat")
        owner2.properties.add(property2)

        response = self.client.get('/api/properties/owners/')
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(len(data), 2)

        owner_names = [owner["name"] for owner in data]
        self.assertIn("John Smith", owner_names)
        self.assertIn("Ana Novak", owner_names)

        # Check properties nested inside
        ana_entry = next((o for o in data if o["name"] == "Ana Novak"), None)
        self.assertIsNotNone(ana_entry)
        self.assertEqual(len(ana_entry["properties"]), 1)
        self.assertEqual(ana_entry["properties"][0]["name"], "Flat B")




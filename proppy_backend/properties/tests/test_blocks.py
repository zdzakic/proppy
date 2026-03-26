import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from properties.models import Company, Block, UserRookeryRole
from users.models import Role

User = get_user_model()


@pytest.mark.django_db
def test_company_admin_can_see_blocks():
    client = APIClient()

    user = User.objects.create_user(email="test@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    company = Company.objects.create(name="Test Company")

    UserRookeryRole.objects.create(
        user=user,
        company=company,
        role=role
    )

    Block.objects.create(name="Block A", company=company)

    client.force_authenticate(user=user)

    response = client.get("/api/properties/blocks/")

    assert response.status_code == 200
    assert len(response.data) == 1


@pytest.mark.django_db
def test_company_admin_can_create_block():
    client = APIClient()

    user = User.objects.create_user(email="test@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company = Company.objects.create(name="Test Company")

    UserRookeryRole.objects.create(
        user=user,
        company=company,
        role=role
    )

    client.force_authenticate(user=user)

    response = client.post("/api/properties/blocks/create/", {
        "name": "Block A",
        "company": company.id
    })

    assert response.status_code == 201
    assert response.data["name"] == "Block A"

@pytest.mark.django_db
def test_non_admin_cannot_create_block():
    client = APIClient()

    # user BEZ role
    user = User.objects.create_user(
        email="user@test.com",
        password="1234"
    )

    # company postoji
    company = Company.objects.create(name="Test Company")

    client.force_authenticate(user=user)

    response = client.post("/api/properties/blocks/create/", {
        "name": "Block X",
        "company": company.id
    })

    assert response.status_code == 403

@pytest.mark.django_db
def test_admin_cannot_create_block_in_other_company():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    company1 = Company.objects.create(name="Company 1")
    company2 = Company.objects.create(name="Company 2")

    # admin samo u company1
    UserRookeryRole.objects.create(
        user=user,
        company=company1,
        role=role
    )

    client.force_authenticate(user=user)

    response = client.post("/api/properties/blocks/create/", {
        "name": "Block X",
        "company": company2.id
    })

    assert response.status_code == 400
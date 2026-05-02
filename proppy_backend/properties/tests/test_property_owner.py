import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from properties.models import Company, Block, Property, PropertyOwner, UserRookeryRole
from users.models import Role


User = get_user_model()


@pytest.mark.django_db
def test_create_property_owner_success():
    client = APIClient()

    admin_user = User.objects.create_user(email="admin@test.com", password="1234")
    role_company_admin = Role.objects.get_or_create(
        code="COMPANYADMIN",
        defaults={"name": "Company Admin"},
    )[0]

    company = Company.objects.create(name="Test Company")
    block = Block.objects.create(name="Block A", company=company)
    prop = Property.objects.create(name="Property 1", block=block)

    UserRookeryRole.objects.create(user=admin_user, company=company, role=role_company_admin)

    client.force_authenticate(user=admin_user)

    owner_email = "owner.created@test.com"
    url = f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/create/"
    payload = {
        "email": owner_email,
        "first_name": "Ana",
        "last_name": "Owner",
    }

    r = client.post(url, payload, format="json")

    assert r.status_code == 201

    assert User.objects.filter(email=owner_email).exists()
    owner_user = User.objects.get(email=owner_email)

    assert PropertyOwner.objects.filter(property=prop, user=owner_user).exists()
    owner = PropertyOwner.objects.get(property=prop, user=owner_user)

    assert Role.objects.filter(code="OWNER").exists()
    assert UserRookeryRole.objects.filter(
        user=owner_user,
        company=company,
        role__code="OWNER",
        property_owner=owner,
    ).exists()


@pytest.mark.django_db
def test_create_property_owner_duplicate():
    client = APIClient()

    admin_user = User.objects.create_user(email="admin@test.com", password="1234")
    role_company_admin = Role.objects.get_or_create(
        code="COMPANYADMIN",
        defaults={"name": "Company Admin"},
    )[0]

    company = Company.objects.create(name="Test Company")
    block = Block.objects.create(name="Block A", company=company)
    prop = Property.objects.create(name="Property 1", block=block)

    UserRookeryRole.objects.create(user=admin_user, company=company, role=role_company_admin)

    client.force_authenticate(user=admin_user)

    owner_email = "duplicate@test.com"
    url = f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/create/"
    payload = {"email": owner_email}

    r1 = client.post(url, payload, format="json")
    assert r1.status_code == 201

    r2 = client.post(url, payload, format="json")
    assert r2.status_code == 400


@pytest.mark.django_db
def test_display_label_auto_computed():
    owner_user = User.objects.create_user(
        email="owner.label@test.com",
        password="1234",
        first_name="Ana",
    )

    company = Company.objects.create(name="Test Company")
    block = Block.objects.create(name="Block A", company=company)
    prop = Property.objects.create(name="Property 1", block=block)

    owner = PropertyOwner(
        user=owner_user,
        property=prop,
        display_label="",
    )
    owner.save()

    assert owner.display_label == f"{owner_user.first_name}-{prop.name}"


@pytest.mark.django_db
def test_display_label_user_override():
    owner_user = User.objects.create_user(
        email="owner.label.override@test.com",
        password="1234",
        first_name="Ana",
    )

    company = Company.objects.create(name="Test Company")
    block = Block.objects.create(name="Block A", company=company)
    prop = Property.objects.create(name="Property 1", block=block)

    owner = PropertyOwner(
        user=owner_user,
        property=prop,
        display_label="My Custom Label",
    )
    owner.save()

    assert owner.display_label == "My Custom Label"


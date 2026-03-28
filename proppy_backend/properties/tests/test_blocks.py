import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from properties.models import Company, Block, Property, UserRookeryRole
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


@pytest.mark.django_db
def test_company_admin_can_delete_block():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    company = Company.objects.create(name="Test Company")

    UserRookeryRole.objects.create(
        user=user,
        company=company,
        role=role
    )

    block = Block.objects.create(name="Block A", company=company)

    client.force_authenticate(user=user)

    response = client.delete(f"/api/properties/blocks/{block.id}/delete/")

    assert response.status_code == 200
    assert "deleted successfully" in response.data["message"]

    # 🔥 NAJBITNIJE — stvarno obrisan
    assert Block.objects.count() == 0


@pytest.mark.django_db
def test_non_admin_cannot_delete_block():
    client = APIClient()

    user = User.objects.create_user(email="user@test.com", password="1234")
    company = Company.objects.create(name="Test Company")

    block = Block.objects.create(name="Block A", company=company)

    client.force_authenticate(user=user)

    response = client.delete(f"/api/properties/blocks/{block.id}/delete/")

    assert response.status_code == 403


@pytest.mark.django_db
def test_admin_cannot_delete_block_from_other_company():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    company1 = Company.objects.create(name="Company 1")
    company2 = Company.objects.create(name="Company 2")

    UserRookeryRole.objects.create(
        user=user,
        company=company1,
        role=role
    )

    block = Block.objects.create(name="Block A", company=company2)

    client.force_authenticate(user=user)

    response = client.delete(f"/api/properties/blocks/{block.id}/delete/")

    assert response.status_code == 403
    assert response.data["detail"] == "You cannot delete this block."

@pytest.mark.django_db
def test_delete_non_existing_block():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company = Company.objects.create(name="Test Company")

    UserRookeryRole.objects.create(
        user=user,
        company=company,
        role=role
    )

    client.force_authenticate(user=user)

    response = client.delete("/api/properties/blocks/999/delete/")

    assert response.status_code == 404

@pytest.mark.django_db
def test_company_admin_can_create_multiple_blocks():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    company = Company.objects.create(name="Test Company")

    UserRookeryRole.objects.create(
        user=user,
        company=company,
        role=role
    )

    client.force_authenticate(user=user)

    # prvi block
    response1 = client.post("/api/properties/blocks/create/", {
        "name": "Block A",
        "company": company.id
    })

    # drugi block
    response2 = client.post("/api/properties/blocks/create/", {
        "name": "Block B",
        "company": company.id
    })

    assert response1.status_code == 201
    assert response2.status_code == 201

    assert Block.objects.count() == 2


@pytest.mark.django_db
def test_company_admin_can_list_and_create_properties():
    client = APIClient()
    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company = Company.objects.create(name="Test Company")
    UserRookeryRole.objects.create(user=user, company=company, role=role)
    block = Block.objects.create(name="Block A", company=company)

    client.force_authenticate(user=user)

    r = client.get(f"/api/properties/blocks/{block.id}/properties/")
    assert r.status_code == 200
    assert r.data == []

    r = client.post(
        f"/api/properties/blocks/{block.id}/properties/create/",
        {"name": "Stan 1", "comment": ""},
        format="json",
    )
    assert r.status_code == 201
    assert r.data["name"] == "Stan 1"

    r = client.get(f"/api/properties/blocks/{block.id}/properties/")
    assert len(r.data) == 1
    assert r.data[0]["name"] == "Stan 1"


@pytest.mark.django_db
def test_admin_gets_404_for_block_in_other_company():
    client = APIClient()
    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    c1 = Company.objects.create(name="C1")
    c2 = Company.objects.create(name="C2")
    UserRookeryRole.objects.create(user=user, company=c1, role=role)
    block = Block.objects.create(name="B", company=c2)

    client.force_authenticate(user=user)

    r = client.post(
        f"/api/properties/blocks/{block.id}/properties/create/",
        {"name": "X"},
        format="json",
    )
    assert r.status_code == 404


@pytest.mark.django_db
def test_non_admin_cannot_create_property():
    client = APIClient()
    user = User.objects.create_user(email="u@test.com", password="1234")
    company = Company.objects.create(name="C")
    block = Block.objects.create(name="B", company=company)
    client.force_authenticate(user=user)

    r = client.post(
        f"/api/properties/blocks/{block.id}/properties/create/",
        {"name": "X"},
        format="json",
    )
    assert r.status_code == 403


@pytest.mark.django_db
def test_company_admin_can_update_and_delete_property():
    client = APIClient()
    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company = Company.objects.create(name="C")
    UserRookeryRole.objects.create(user=user, company=company, role=role)
    block = Block.objects.create(name="B", company=company)
    prop = Property.objects.create(name="Old", block=block)

    client.force_authenticate(user=user)

    r = client.patch(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/",
        {"name": "New"},
        format="json",
    )
    assert r.status_code == 200
    assert r.data["name"] == "New"

    r = client.delete(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/delete/",
    )
    assert r.status_code == 200
    assert Property.objects.count() == 0
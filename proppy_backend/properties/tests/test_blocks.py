import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient, APIRequestFactory
from rest_framework.views import APIView

from properties.models import Company, Block, Property, PropertyOwner, UserRookeryRole
from users.models import Role
from properties.permissions import IsCompanyAdmin

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

    response = client.post("/api/properties/blocks/", {
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

    response = client.post("/api/properties/blocks/", {
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

    response = client.post("/api/properties/blocks/", {
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

    response = client.delete(f"/api/properties/blocks/{block.id}/")

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

    response = client.delete(f"/api/properties/blocks/{block.id}/")

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

    response = client.delete(f"/api/properties/blocks/{block.id}/")

    assert response.status_code == 404

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

    response = client.delete("/api/properties/blocks/999/")

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
    response1 = client.post("/api/properties/blocks/", {
        "name": "Block A",
        "company": company.id
    })

    # drugi block
    response2 = client.post("/api/properties/blocks/", {
        "name": "Block B",
        "company": company.id
    })

    assert response1.status_code == 201
    assert response2.status_code == 201

    assert Block.objects.count() == 2


@pytest.mark.django_db
def test_company_admin_can_create_block_without_company_when_single_company_admin():
    client = APIClient()

    user = User.objects.create_user(email="admin-single@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company = Company.objects.create(name="Only Company")

    UserRookeryRole.objects.create(user=user, company=company, role=role)

    client.force_authenticate(user=user)

    response = client.post("/api/properties/blocks/", {"name": "Block Solo"}, format="json")

    assert response.status_code == 201
    assert response.data["name"] == "Block Solo"
    assert response.data["company"] == company.id


@pytest.mark.django_db
def test_company_admin_must_send_company_when_admin_of_multiple_companies():
    client = APIClient()

    user = User.objects.create_user(email="admin-multi@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company1 = Company.objects.create(name="Company 1")
    company2 = Company.objects.create(name="Company 2")

    UserRookeryRole.objects.create(user=user, company=company1, role=role)
    UserRookeryRole.objects.create(user=user, company=company2, role=role)

    client.force_authenticate(user=user)

    response = client.post("/api/properties/blocks/", {"name": "Block Ambiguous"}, format="json")

    assert response.status_code == 403
    assert response.data["detail"] == "Company is required when you manage multiple companies."


@pytest.mark.django_db
def test_company_admin_can_retrieve_block_detail():
    client = APIClient()

    user = User.objects.create_user(email="admin-detail@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company = Company.objects.create(name="Detail Company")

    UserRookeryRole.objects.create(user=user, company=company, role=role)
    block = Block.objects.create(name="Detail Block", company=company, comment="Core detail")

    client.force_authenticate(user=user)

    response = client.get(f"/api/properties/blocks/{block.id}/")

    assert response.status_code == 200
    assert response.data["id"] == block.id
    assert response.data["name"] == "Detail Block"
    assert response.data["comment"] == "Core detail"


@pytest.mark.django_db
def test_admin_gets_404_for_block_detail_from_other_company():
    client = APIClient()

    user = User.objects.create_user(email="admin-detail-scope@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    own_company = Company.objects.create(name="Own Company")
    other_company = Company.objects.create(name="Other Company")

    UserRookeryRole.objects.create(user=user, company=own_company, role=role)
    other_block = Block.objects.create(name="Other Block", company=other_company)

    client.force_authenticate(user=user)

    response = client.get(f"/api/properties/blocks/{other_block.id}/")

    assert response.status_code == 404


@pytest.mark.django_db
def test_company_admin_can_update_block_name():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")
    company = Company.objects.create(name="Test Company")

    UserRookeryRole.objects.create(user=user, company=company, role=role)
    block = Block.objects.create(name="Block Old", company=company)

    client.force_authenticate(user=user)

    response = client.patch(
        f"/api/properties/blocks/{block.id}/",
        {"name": "Block New"},
        format="json",
    )

    assert response.status_code == 200
    assert response.data["name"] == "Block New"


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
    assert r.status_code == 403
    assert r.data["detail"] == "You cannot create property in this block."


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


@pytest.mark.django_db
def test_admin_cannot_update_property_from_other_company():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    c1 = Company.objects.create(name="C1")
    c2 = Company.objects.create(name="C2")

    # admin only in c1
    UserRookeryRole.objects.create(user=user, company=c1, role=role)

    block_other = Block.objects.create(name="B", company=c2)
    prop_other = Property.objects.create(name="Old", block=block_other)

    client.force_authenticate(user=user)

    r = client.patch(
        f"/api/properties/blocks/{block_other.id}/properties/{prop_other.id}/",
        {"name": "New"},
        format="json",
    )
    assert r.status_code == 404


@pytest.mark.django_db
def test_admin_cannot_delete_property_from_other_company():
    client = APIClient()

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    c1 = Company.objects.create(name="C1")
    c2 = Company.objects.create(name="C2")

    # admin only in c1
    UserRookeryRole.objects.create(user=user, company=c1, role=role)

    block_other = Block.objects.create(name="B", company=c2)
    prop_other = Property.objects.create(name="Old", block=block_other)

    client.force_authenticate(user=user)

    r = client.delete(
        f"/api/properties/blocks/{block_other.id}/properties/{prop_other.id}/delete/",
    )
    assert r.status_code == 404


@pytest.mark.django_db
def test_company_admin_object_permission_block_and_property():
    """
    Direktno provjerava has_object_permission logiku permission-a:
    - Block/Property iz tuđe firme => False
    - Block iz adminove firme => True
    """
    factory = APIRequestFactory()
    request = factory.get("/")

    user = User.objects.create_user(email="admin@test.com", password="1234")
    role = Role.objects.create(code="COMPANYADMIN", name="Admin")

    c1 = Company.objects.create(name="C1")
    c2 = Company.objects.create(name="C2")
    UserRookeryRole.objects.create(user=user, company=c1, role=role)

    block_own = Block.objects.create(name="B1", company=c1)
    block_other = Block.objects.create(name="B2", company=c2)
    prop_own = Property.objects.create(name="P1", block=block_own)
    prop_other = Property.objects.create(name="P2", block=block_other)

    request.user = user

    permission = IsCompanyAdmin()
    view = APIView()

    assert permission.has_object_permission(request, view, block_own) is True
    assert permission.has_object_permission(request, view, block_other) is False
    assert permission.has_object_permission(request, view, prop_own) is True
    assert permission.has_object_permission(request, view, prop_other) is False

    owner_user = User.objects.create_user(email="owner@test.com", password="1234")
    po_own = PropertyOwner.objects.create(user=owner_user, property=prop_own)
    po_other = PropertyOwner.objects.create(user=owner_user, property=prop_other)
    assert permission.has_object_permission(request, view, po_own) is True
    assert permission.has_object_permission(request, view, po_other) is False


@pytest.mark.django_db
def test_company_admin_property_owner_crud_and_owner_role():
    client = APIClient()
    admin = User.objects.create_user(email="admin@test.com", password="1234")
    owner_user = User.objects.create_user(email="owner@test.com", password="1234")
    role_admin = Role.objects.create(code="COMPANYADMIN", name="Admin")
    Role.objects.create(code="OWNER", name="Owner")

    company = Company.objects.create(name="C")
    UserRookeryRole.objects.create(user=admin, company=company, role=role_admin)
    block = Block.objects.create(name="B", company=company)
    prop = Property.objects.create(name="Stan", block=block)

    client.force_authenticate(user=admin)

    r = client.get(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/",
    )
    assert r.status_code == 200
    assert r.data == []

    r = client.post(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/create/",
        {"email": owner_user.email, "display_name": "Vlasnik", "comment": ""},
        format="json",
    )
    assert r.status_code == 201
    assert r.data["user_email"] == owner_user.email
    assert r.data["display_name"] == "Vlasnik"

    po = PropertyOwner.objects.get(id=r.data["id"])
    assert UserRookeryRole.objects.filter(
        user=owner_user,
        company=company,
        role__code="OWNER",
        property_owner=po,
    ).exists()

    r = client.get(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/{po.id}/",
    )
    assert r.status_code == 200
    assert r.data["user_email"] == owner_user.email

    r = client.patch(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/{po.id}/update/",
        {"display_name": "Novo ime"},
        format="json",
    )
    assert r.status_code == 200
    assert r.data["display_name"] == "Novo ime"

    r = client.delete(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/{po.id}/delete/",
    )
    assert r.status_code == 200
    assert PropertyOwner.objects.count() == 0
    assert not UserRookeryRole.objects.filter(role__code="OWNER", user=owner_user).exists()


@pytest.mark.django_db
def test_non_admin_cannot_create_property_owner():
    client = APIClient()
    user = User.objects.create_user(email="u@test.com", password="1234")
    owner_target = User.objects.create_user(email="o@test.com", password="1234")
    company = Company.objects.create(name="C")
    block = Block.objects.create(name="B", company=company)
    prop = Property.objects.create(name="P", block=block)
    client.force_authenticate(user=user)

    r = client.post(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/create/",
        {"email": owner_target.email},
        format="json",
    )
    assert r.status_code == 403


@pytest.mark.django_db
def test_admin_cannot_create_property_owner_in_other_company():
    client = APIClient()
    admin = User.objects.create_user(email="admin@test.com", password="1234")
    owner_user = User.objects.create_user(email="owner@test.com", password="1234")
    Role.objects.create(code="COMPANYADMIN", name="Admin")
    Role.objects.create(code="OWNER", name="Owner")

    c1 = Company.objects.create(name="C1")
    c2 = Company.objects.create(name="C2")
    UserRookeryRole.objects.create(
        user=admin,
        company=c1,
        role=Role.objects.get(code="COMPANYADMIN"),
    )
    block = Block.objects.create(name="B", company=c2)
    prop = Property.objects.create(name="P", block=block)

    client.force_authenticate(user=admin)
    r = client.post(
        f"/api/properties/blocks/{block.id}/properties/{prop.id}/owners/create/",
        {"email": owner_user.email},
        format="json",
    )
    assert r.status_code == 404
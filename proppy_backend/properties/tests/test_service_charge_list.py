import pytest
from datetime import date
from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from properties.models import (
    Block,
    Company,
    Payment,
    Property,
    ServiceCharge,
    ServicePeriod,
    UserRookeryRole,
)
from users.models import Role


User = get_user_model()
URL = "/api/properties/service-charges/"


def create_company_admin(*, email: str, company_name: str):
    """
    Creates one COMPANYADMIN user tied to one company.

    This keeps tenant setup consistent across tests; removing it would duplicate
    the same access-control wiring in every case.
    """
    user = User.objects.create_user(email=email, password="1234")
    company = Company.objects.create(name=company_name)
    role = Role.objects.get_or_create(code="COMPANYADMIN", defaults={"name": "Company Admin"})[0]

    UserRookeryRole.objects.create(user=user, company=company, role=role)

    return user, company


def create_charge(*, company, block_name, property_name, period_name, due_date, amount, is_active=True):
    """
    Builds a service charge with its block, property, and billing period.

    Tests use this to focus on endpoint behavior instead of repetitive fixture
    setup; without it the cases would be much noisier to read.
    """
    block = Block.objects.create(name=block_name, company=company)
    prop = Property.objects.create(name=property_name, block=block)
    period = ServicePeriod.objects.create(
        company=company,
        name=period_name,
        due_date=due_date,
        is_active=is_active,
    )
    charge = ServiceCharge.objects.create(
        company=company,
        property=prop,
        service_period=period,
        amount=amount,
    )

    return charge, prop, period


@pytest.mark.django_db
def test_service_charge_list_is_scoped_to_admin_company():
    client = APIClient()
    user, own_company = create_company_admin(email="admin@own.test", company_name="Own Company")
    other_company = Company.objects.create(name="Other Company")
    other_role = Role.objects.get_or_create(code="COMPANYADMIN", defaults={"name": "Company Admin"})[0]
    other_user = User.objects.create_user(email="admin@other.test", password="1234")
    UserRookeryRole.objects.create(user=other_user, company=other_company, role=other_role)

    own_charge, _, _ = create_charge(
        company=own_company,
        block_name="Own Block",
        property_name="Own Unit",
        period_name="Own Period",
        due_date=date(2026, 5, 1),
        amount=Decimal("100.00"),
    )
    create_charge(
        company=other_company,
        block_name="Other Block",
        property_name="Other Unit",
        period_name="Other Period",
        due_date=date(2026, 5, 1),
        amount=Decimal("100.00"),
    )

    client.force_authenticate(user=user)
    response = client.get(URL)

    assert response.status_code == 200
    assert [row["id"] for row in response.data] == [own_charge.id]
    assert response.data[0]["block_name"] == "Own Block"
    assert response.data[0]["property_name"] == "Own Unit"


@pytest.mark.django_db
def test_service_charge_list_filters_by_period_query_param():
    client = APIClient()
    user, company = create_company_admin(email="period@admin.test", company_name="Period Company")
    block = Block.objects.create(name="Main Block", company=company)
    prop = Property.objects.create(name="Unit 1", block=block)

    period_a = ServicePeriod.objects.create(
        company=company,
        name="January 2026",
        due_date=date(2026, 1, 15),
        is_active=False,
    )
    period_b = ServicePeriod.objects.create(
        company=company,
        name="February 2026",
        due_date=date(2026, 2, 15),
        is_active=True,
    )

    charge_a = ServiceCharge.objects.create(
        company=company,
        property=prop,
        service_period=period_a,
        amount=Decimal("50.00"),
    )
    ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Unit 2", block=block),
        service_period=period_b,
        amount=Decimal("60.00"),
    )

    client.force_authenticate(user=user)
    response = client.get(URL, {"period": period_a.id})

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["id"] == charge_a.id
    assert response.data[0]["period_name"] == "January 2026"


@pytest.mark.django_db
def test_service_charge_list_returns_all_charges_when_no_period_param():
    """No ?period → all charges for the admin's companies are returned."""
    client = APIClient()
    user, company = create_company_admin(email="active@admin.test", company_name="Active Company")
    block = Block.objects.create(name="Active Block", company=company)

    period_a = ServicePeriod.objects.create(
        company=company,
        name="Active Period",
        due_date=date(2026, 1, 10),
        is_active=True,
    )
    period_b = ServicePeriod.objects.create(
        company=company,
        name="Later Period",
        due_date=date(2026, 2, 10),
        is_active=False,
    )

    charge_a = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Active Unit", block=block),
        service_period=period_a,
        amount=Decimal("75.00"),
    )
    charge_b = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Later Unit", block=block),
        service_period=period_b,
        amount=Decimal("80.00"),
    )

    client.force_authenticate(user=user)
    response = client.get(URL)

    assert response.status_code == 200
    assert len(response.data) == 2
    returned_ids = {row["id"] for row in response.data}
    assert returned_ids == {charge_a.id, charge_b.id}


@pytest.mark.django_db
def test_service_charge_list_returns_all_periods_when_no_active_period_exists():
    """No ?period and no active period → still returns all charges, not just the latest."""
    client = APIClient()
    user, company = create_company_admin(email="latest@admin.test", company_name="Latest Company")
    block = Block.objects.create(name="Latest Block", company=company)

    older_period = ServicePeriod.objects.create(
        company=company,
        name="Older Period",
        due_date=date(2026, 1, 10),
        is_active=False,
    )
    latest_period = ServicePeriod.objects.create(
        company=company,
        name="Latest Period",
        due_date=date(2026, 2, 10),
        is_active=False,
    )

    older_charge = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Older Unit", block=block),
        service_period=older_period,
        amount=Decimal("70.00"),
    )
    latest_charge = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Latest Unit", block=block),
        service_period=latest_period,
        amount=Decimal("90.00"),
    )

    client.force_authenticate(user=user)
    response = client.get(URL)

    assert response.status_code == 200
    assert len(response.data) == 2
    returned_ids = {row["id"] for row in response.data}
    assert returned_ids == {older_charge.id, latest_charge.id}


@pytest.mark.django_db
def test_service_charge_list_calculates_payment_status_and_balances():
    client = APIClient()
    user, company = create_company_admin(email="payments@admin.test", company_name="Payments Company")
    block = Block.objects.create(name="Payments Block", company=company)
    period = ServicePeriod.objects.create(
        company=company,
        name="Billing Period",
        due_date=date(2026, 3, 1),
        is_active=True,
    )

    unpaid_charge = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Unpaid Unit", block=block),
        service_period=period,
        amount=Decimal("100.00"),
    )
    partial_charge = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Partial Unit", block=block),
        service_period=period,
        amount=Decimal("100.00"),
    )
    paid_charge = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Paid Unit", block=block),
        service_period=period,
        amount=Decimal("100.00"),
    )
    overpaid_charge = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Overpaid Unit", block=block),
        service_period=period,
        amount=Decimal("100.00"),
    )

    Payment.objects.create(service_charge=partial_charge, amount=Decimal("40.00"), date_paid=date(2026, 3, 5))
    Payment.objects.create(service_charge=paid_charge, amount=Decimal("100.00"), date_paid=date(2026, 3, 5))
    Payment.objects.create(service_charge=overpaid_charge, amount=Decimal("130.00"), date_paid=date(2026, 3, 5))

    client.force_authenticate(user=user)
    response = client.get(URL, {"period": period.id})

    assert response.status_code == 200

    rows = {row["property_name"]: row for row in response.data}

    assert Decimal(str(rows["Unpaid Unit"]["paid"])) == Decimal("0")
    assert Decimal(str(rows["Unpaid Unit"]["remaining"])) == Decimal("100.00")
    assert rows["Unpaid Unit"]["status"] == "unpaid"

    assert Decimal(str(rows["Partial Unit"]["paid"])) == Decimal("40.00")
    assert Decimal(str(rows["Partial Unit"]["remaining"])) == Decimal("60.00")
    assert rows["Partial Unit"]["status"] == "partial"

    assert Decimal(str(rows["Paid Unit"]["paid"])) == Decimal("100.00")
    assert Decimal(str(rows["Paid Unit"]["remaining"])) == Decimal("0")
    assert rows["Paid Unit"]["status"] == "paid"

    assert Decimal(str(rows["Overpaid Unit"]["paid"])) == Decimal("130.00")
    assert Decimal(str(rows["Overpaid Unit"]["remaining"])) == Decimal("-30.00")
    assert rows["Overpaid Unit"]["status"] == "paid"


@pytest.mark.django_db
def test_service_charge_list_returns_dash_when_property_has_no_owner():
    client = APIClient()
    user, company = create_company_admin(email="owner@admin.test", company_name="Ownerless Company")
    block = Block.objects.create(name="Ownerless Block", company=company)
    period = ServicePeriod.objects.create(
        company=company,
        name="Ownerless Period",
        due_date=date(2026, 4, 1),
        is_active=True,
    )

    charge = ServiceCharge.objects.create(
        company=company,
        property=Property.objects.create(name="Ownerless Unit", block=block),
        service_period=period,
        amount=Decimal("55.00"),
    )

    client.force_authenticate(user=user)
    response = client.get(URL, {"period": period.id})

    assert response.status_code == 200
    assert response.data[0]["id"] == charge.id
    assert response.data[0]["owner_name"] == "-"


@pytest.mark.django_db
def test_service_charge_list_period_filter_returns_all_admin_companies_for_same_named_period():
    """
    When multiple companies have ServicePeriod rows with the same display name, the UI
    deduplicates by name and sends all matching IDs as a CSV: ?period=1,2.

    This endpoint must return charges for *all* admin-scoped companies for that period name
    (i.e. must not appear to "hide" one company).
    """
    client = APIClient()

    user = User.objects.create_user(email="multi@admin.test", password="1234")
    role = Role.objects.get_or_create(code="COMPANYADMIN", defaults={"name": "Company Admin"})[0]
    company_a = Company.objects.create(name="Company A")
    company_b = Company.objects.create(name="Company B")
    UserRookeryRole.objects.create(user=user, company=company_a, role=role)
    UserRookeryRole.objects.create(user=user, company=company_b, role=role)

    period_name = "Dec 2026"
    charge_a, _, period_a = create_charge(
        company=company_a,
        block_name="A Block",
        property_name="A Unit",
        period_name=period_name,
        due_date=date(2026, 12, 10),
        amount=Decimal("100.00"),
    )
    charge_b, _, period_b = create_charge(
        company=company_b,
        block_name="B Block",
        property_name="B Unit",
        period_name=period_name,
        due_date=date(2026, 12, 10),
        amount=Decimal("110.00"),
    )

    client.force_authenticate(user=user)
    response = client.get(URL, {"period": f"{period_a.id},{period_b.id}"})

    assert response.status_code == 200
    returned_ids = {row["id"] for row in response.data}
    assert returned_ids == {charge_a.id, charge_b.id}
    returned_companies = {row["company_name"] for row in response.data}
    assert returned_companies == {"Company A", "Company B"}


@pytest.mark.django_db
def test_service_charge_list_no_period_returns_multiple_periods_across_multiple_companies():
    """No ?period → returns all charges for all admin-scoped companies, across periods."""
    client = APIClient()

    user = User.objects.create_user(email="noparam@admin.test", password="1234")
    role = Role.objects.get_or_create(code="COMPANYADMIN", defaults={"name": "Company Admin"})[0]
    company_a = Company.objects.create(name="Company A")
    company_b = Company.objects.create(name="Company B")
    UserRookeryRole.objects.create(user=user, company=company_a, role=role)
    UserRookeryRole.objects.create(user=user, company=company_b, role=role)

    charge_a1, _, _ = create_charge(
        company=company_a,
        block_name="A Block",
        property_name="A Unit 1",
        period_name="Jan 2026",
        due_date=date(2026, 1, 10),
        amount=Decimal("50.00"),
    )
    charge_a2, _, _ = create_charge(
        company=company_a,
        block_name="A Block",
        property_name="A Unit 2",
        period_name="Feb 2026",
        due_date=date(2026, 2, 10),
        amount=Decimal("60.00"),
    )
    charge_b1, _, _ = create_charge(
        company=company_b,
        block_name="B Block",
        property_name="B Unit 1",
        period_name="Jan 2026",
        due_date=date(2026, 1, 10),
        amount=Decimal("70.00"),
    )

    client.force_authenticate(user=user)
    response = client.get(URL)

    assert response.status_code == 200
    returned_ids = {row["id"] for row in response.data}
    assert returned_ids == {charge_a1.id, charge_a2.id, charge_b1.id}

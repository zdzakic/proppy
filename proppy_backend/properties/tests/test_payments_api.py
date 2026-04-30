"""
Minimal regression tests for GET/POST /api/properties/payments/.

These guard company scoping and the service_charge query filter without
covering every edge case.
"""

from datetime import date
from decimal import Decimal

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from properties.models import Company, Payment, UserRookeryRole
from users.models import Role
from properties.tests.test_service_charge_list import create_charge, create_company_admin

User = get_user_model()
URL = "/api/properties/payments/"


@pytest.mark.django_db
def test_payment_list_only_returns_payments_for_admin_company():
    client = APIClient()
    user, own_company = create_company_admin(email="pay_scope@admin.test", company_name="Pay Own")
    other_company = Company.objects.create(name="Pay Other")
    role = Role.objects.get_or_create(code="COMPANYADMIN", defaults={"name": "Company Admin"})[0]
    other_admin = User.objects.create_user(email="pay_scope@other.test", password="1234")
    UserRookeryRole.objects.create(user=other_admin, company=other_company, role=role)

    own_charge, _, _ = create_charge(
        company=own_company,
        block_name="B1",
        property_name="P1",
        period_name="Per1",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    other_charge, _, _ = create_charge(
        company=other_company,
        block_name="OB",
        property_name="OP",
        period_name="OPer",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )

    mine = Payment.objects.create(
        service_charge=own_charge,
        amount=Decimal("10.00"),
        date_paid=date(2026, 4, 1),
        comment="mine",
    )
    Payment.objects.create(
        service_charge=other_charge,
        amount=Decimal("20.00"),
        date_paid=date(2026, 4, 2),
        comment="theirs",
    )

    client.force_authenticate(user=user)
    response = client.get(URL)

    assert response.status_code == 200
    assert len(response.data) == 1
    row = response.data[0]
    assert row["id"] == mine.id
    assert row["amount"] == "10.00"
    assert row["date_paid"] == "2026-04-01"
    assert row["comment"] == "mine"
    assert set(row.keys()) == {"id", "amount", "date_paid", "comment"}


@pytest.mark.django_db
def test_payment_list_filters_by_service_charge_query_param():
    client = APIClient()
    user, company = create_company_admin(email="pay_filter@admin.test", company_name="Pay Filter Co")

    charge_a, _, _ = create_charge(
        company=company,
        block_name="BA",
        property_name="PA",
        period_name="P1",
        due_date=date(2026, 7, 1),
        amount=Decimal("50.00"),
    )
    charge_b, _, _ = create_charge(
        company=company,
        block_name="BB",
        property_name="PB",
        period_name="P2",
        due_date=date(2026, 7, 15),
        amount=Decimal("60.00"),
    )

    pa = Payment.objects.create(
        service_charge=charge_a,
        amount=Decimal("5.00"),
        date_paid=date(2026, 4, 10),
        comment="a",
    )
    Payment.objects.create(
        service_charge=charge_b,
        amount=Decimal("6.00"),
        date_paid=date(2026, 4, 11),
        comment="b",
    )

    client.force_authenticate(user=user)
    response = client.get(URL, {"service_charge": str(charge_a.id)})

    assert response.status_code == 200
    assert [row["id"] for row in response.data] == [pa.id]


@pytest.mark.django_db
def test_payment_list_requires_authentication():
    client = APIClient()
    response = client.get(URL)
    assert response.status_code in (401, 403)

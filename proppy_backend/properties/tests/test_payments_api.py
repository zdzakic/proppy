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

from properties.models import Company, Payment, PaymentTransactionType, UserRookeryRole
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
    assert set(row.keys()) == {"id", "amount", "date_paid", "comment", "transaction_type", "transaction_type_name", "property_name", "display_label"}


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


# ---------------------------------------------------------------------------
# PATCH /payments/<pk>/
# ---------------------------------------------------------------------------

@pytest.mark.django_db
def test_payment_patch_amount_returns_200():
    """
    WHAT: Admin patches amount on their own payment.
    WHY:  Happy-path — valid amount within remaining balance must succeed.
    """
    client = APIClient()
    user, company = create_company_admin(email="patch_ok@admin.test", company_name="Patch Co")
    charge, _, _ = create_charge(
        company=company,
        block_name="B1",
        property_name="P1",
        period_name="Per1",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("30.00"),
        date_paid=date(2026, 4, 1),
    )

    client.force_authenticate(user=user)
    response = client.patch(f"{URL}{payment.id}/", {"amount": "40.00"}, format="json")

    assert response.status_code == 200
    assert response.data["amount"] == "40.00"
    payment.refresh_from_db()
    assert payment.amount == Decimal("40.00")


@pytest.mark.django_db
def test_payment_patch_amount_exceeds_remaining_returns_400():
    """
    WHAT: Admin patches amount higher than what the charge still allows.
    WHY:  Overpayment guard — the serializer must exclude the current payment
          from the running total so that the check compares against actual remaining.
    """
    client = APIClient()
    user, company = create_company_admin(email="patch_over@admin.test", company_name="Over Co")
    charge, _, _ = create_charge(
        company=company,
        block_name="B2",
        property_name="P2",
        period_name="Per2",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    # 60 already paid by a separate payment; current payment is 10.
    Payment.objects.create(
        service_charge=charge,
        amount=Decimal("60.00"),
        date_paid=date(2026, 4, 1),
    )
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("10.00"),
        date_paid=date(2026, 4, 2),
    )
    # Remaining after excluding current: 100 - 60 = 40. Attempting 50 must fail.

    client.force_authenticate(user=user)
    response = client.patch(f"{URL}{payment.id}/", {"amount": "50.00"}, format="json")

    assert response.status_code == 400


@pytest.mark.django_db
def test_payment_patch_amount_zero_returns_400():
    """
    WHAT: Admin patches amount to 0.
    WHY:  Amount must be > 0; zero is rejected by validate_amount.
    """
    client = APIClient()
    user, company = create_company_admin(email="patch_zero@admin.test", company_name="Zero Co")
    charge, _, _ = create_charge(
        company=company,
        block_name="B3",
        property_name="P3",
        period_name="Per3",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("20.00"),
        date_paid=date(2026, 4, 1),
    )

    client.force_authenticate(user=user)
    response = client.patch(f"{URL}{payment.id}/", {"amount": "0.00"}, format="json")

    assert response.status_code == 400


@pytest.mark.django_db
def test_payment_patch_other_company_admin_returns_404():
    """
    WHAT: Admin from a different company tries to PATCH a payment they don't own.
    WHY:  Scoping must prevent cross-company mutations; 404 leaks no information.
    """
    client = APIClient()
    owner_user, owner_company = create_company_admin(
        email="patch_owner@admin.test", company_name="Owner Co"
    )
    other_user, _ = create_company_admin(
        email="patch_other@admin.test", company_name="Other Co"
    )
    charge, _, _ = create_charge(
        company=owner_company,
        block_name="B4",
        property_name="P4",
        period_name="Per4",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("25.00"),
        date_paid=date(2026, 4, 1),
    )

    client.force_authenticate(user=other_user)
    response = client.patch(f"{URL}{payment.id}/", {"amount": "30.00"}, format="json")

    assert response.status_code == 404


# ---------------------------------------------------------------------------
# DELETE /payments/<pk>/
# ---------------------------------------------------------------------------

@pytest.mark.django_db
def test_payment_delete_returns_200_with_message():
    """
    WHAT: Admin deletes one of their own payments.
    WHY:  DELETE must return 200 + confirmation message (not 204), matching
          the pattern used by BlockRetrieveUpdateDestroyAPIView.
    """
    client = APIClient()
    user, company = create_company_admin(email="del_ok@admin.test", company_name="Del Co")
    charge, _, _ = create_charge(
        company=company,
        block_name="B5",
        property_name="P5",
        period_name="Per5",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("15.00"),
        date_paid=date(2026, 4, 1),
    )
    payment_id = payment.id

    client.force_authenticate(user=user)
    response = client.delete(f"{URL}{payment_id}/")

    assert response.status_code == 200
    assert response.data == {"message": f"Payment {payment_id} deleted successfully"}
    assert not Payment.objects.filter(id=payment_id).exists()


# ---------------------------------------------------------------------------
# PaymentTransactionType
# ---------------------------------------------------------------------------

@pytest.mark.django_db
def test_payment_transaction_type_returned_in_list():
    """
    WHAT: Payment created with a transaction_type is returned with type id and name.
    WHY:  Guards that PaymentListSerializer exposes both FK id and human-readable name.

    NOTE: Data migration doesn't run in tests — we create the type manually.
    """
    client = APIClient()
    user, company = create_company_admin(email="txtype@admin.test", company_name="TxType Co")
    charge, _, _ = create_charge(
        company=company,
        block_name="B1",
        property_name="P1",
        period_name="Per1",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    tx_type = PaymentTransactionType.objects.create(name="Incoming", order=1)
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("50.00"),
        date_paid=date(2026, 4, 1),
        transaction_type=tx_type,
    )

    client.force_authenticate(user=user)
    response = client.get(URL)

    assert response.status_code == 200
    row = next(r for r in response.data if r["id"] == payment.id)
    assert row["transaction_type"] == tx_type.id
    assert row["transaction_type_name"] == "Incoming"


@pytest.mark.django_db
def test_payment_transaction_type_null_when_not_set():
    """
    WHAT: Payment without transaction_type returns null for both type fields.
    WHY:  Field is optional (null=True) — existing payments must not break.
    """
    client = APIClient()
    user, company = create_company_admin(email="txnull@admin.test", company_name="TxNull Co")
    charge, _, _ = create_charge(
        company=company,
        block_name="B2",
        property_name="P2",
        period_name="Per2",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("20.00"),
        date_paid=date(2026, 4, 1),
    )

    client.force_authenticate(user=user)
    response = client.get(URL)

    assert response.status_code == 200
    row = next(r for r in response.data if r["id"] == payment.id)
    assert row["transaction_type"] is None
    assert row["transaction_type_name"] is None


@pytest.mark.django_db
def test_payment_delete_other_company_admin_returns_404():
    """
    WHAT: Admin from a different company tries to DELETE a payment they don't own.
    WHY:  Same scoping rule as PATCH — queryset restricts to admin's own companies.
    """
    client = APIClient()
    owner_user, owner_company = create_company_admin(
        email="del_owner@admin.test", company_name="Del Owner Co"
    )
    other_user, _ = create_company_admin(
        email="del_other@admin.test", company_name="Del Other Co"
    )
    charge, _, _ = create_charge(
        company=owner_company,
        block_name="B6",
        property_name="P6",
        period_name="Per6",
        due_date=date(2026, 6, 1),
        amount=Decimal("100.00"),
    )
    payment = Payment.objects.create(
        service_charge=charge,
        amount=Decimal("10.00"),
        date_paid=date(2026, 4, 1),
    )

    client.force_authenticate(user=other_user)
    response = client.delete(f"{URL}{payment.id}/")

    assert response.status_code == 404
    assert Payment.objects.filter(id=payment.id).exists()

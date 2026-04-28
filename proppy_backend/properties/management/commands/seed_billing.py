from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Sum

from properties.models import (
    Company,
    Property,
    ServicePeriod,
    ServiceCharge,
    Payment,
)


class Command(BaseCommand):
    """
    Seed billing data for ALL companies and ALL properties.

    WHAT:
    - Creates one ServicePeriod per company (June 2026)
    - Creates ServiceCharge per property
    - Creates payments with mixed states:
        - paid
        - partial
        - unpaid

    WHY:
    - Needed for realistic UI testing (green / yellow / red states)

    DESIGN:
    - Idempotent → can run multiple times
    - Clears payments before re-seeding (prevents duplicates)
    - Does NOT duplicate charges
    """

    help = "Seed billing data (all companies, all properties)"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Seeding billing..."))

        companies = Company.objects.all()

        if not companies.exists():
            self.stdout.write(self.style.ERROR("No companies found"))
            return

        for company in companies:
            self.stdout.write(f"\n🏢 Company: {company.name}")

            properties = Property.objects.filter(block__company=company)

            if not properties.exists():
                self.stdout.write("  ⚠️ No properties → skipping")
                continue

            # --------------------------------------------------
            # PERIOD
            # --------------------------------------------------
            period, _ = ServicePeriod.objects.get_or_create(
                company=company,
                name="June 2026",
                defaults={
                    "due_date": "2026-06-01",
                    "is_active": True,
                    "start_date": "2026-06-01",
                    "end_date": "2026-06-30",
                },
            )

            self.stdout.write(f"  📅 Period: {period.name}")

            charges = []

            # --------------------------------------------------
            # CHARGES
            # --------------------------------------------------
            for p in properties:
                sc, _ = ServiceCharge.objects.get_or_create(
                    company=company,
                    property=p,
                    service_period=period,
                    defaults={
                        "amount": 3000,
                        "notice_sent_at": timezone.now(),
                        "description": f"Service charge {period.name}",
                    },
                )
                charges.append(sc)

            self.stdout.write(self.style.SUCCESS(f"  Charges: {len(charges)}"))

            # --------------------------------------------------
            # PAYMENTS (mix scenarios)
            # --------------------------------------------------
            for i, sc in enumerate(charges):
                # reset payments (important for repeatable seed)
                sc.payments.all().delete()

                if i % 3 == 0:
                    # 🟢 FULL PAID
                    Payment.objects.create(
                        service_charge=sc,
                        amount=3000,
                        date_paid="2026-06-05",
                    )

                elif i % 3 == 1:
                    # 🟡 PARTIAL
                    Payment.objects.create(
                        service_charge=sc,
                        amount=1500,
                        date_paid="2026-06-06",
                    )

                else:
                    # 🔴 UNPAID
                    pass

            self.stdout.write(self.style.SUCCESS("  Payments seeded"))

            # --------------------------------------------------
            # CHECK
            # --------------------------------------------------
            self.stdout.write("  === CHECK ===")

            for sc in charges:
                paid = sc.payments.aggregate(total=Sum("amount"))["total"] or 0
                remaining = sc.amount - paid

                if paid == 0:
                    status = "UNPAID"
                elif paid >= sc.amount:
                    status = "PAID"
                else:
                    status = "PARTIAL"

                self.stdout.write(
                    f"  {sc.property.name} | Paid: {paid} | Remaining: {remaining} | {status}"
                )

        self.stdout.write(self.style.SUCCESS("\nSeeding complete 🚀"))
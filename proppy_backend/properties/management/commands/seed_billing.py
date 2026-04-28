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
    help = "Seed billing data (ServicePeriod, ServiceCharge, Payment)"

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING("Seeding billing data..."))

        # 1) Company
        company = Company.objects.filter(name="DEMO").first()

        if not company:
            self.stdout.write(self.style.ERROR("Company DEMO not found"))
            return

        # 2) Properties
        properties = Property.objects.filter(block__company=company)

        if not properties.exists():
            self.stdout.write(self.style.ERROR("No properties found"))
            return

        self.stdout.write(f"Company: {company.name} | Properties: {properties.count()}")

        # 3) FIX: uzmi prvi period ako postoji (bez crash-a)
        period = ServicePeriod.objects.filter(
            company=company,
            name="June 2026"
        ).first()

        # ako ne postoji → kreiraj
        if not period:
            period = ServicePeriod.objects.create(
                company=company,
                name="June 2026",
                due_date="2026-06-01",
                is_active=True,
                start_date="2026-06-01",
                end_date="2026-06-30",
            )
            self.stdout.write(self.style.SUCCESS("Created new ServicePeriod"))
        else:
            self.stdout.write(self.style.SUCCESS("Using existing ServicePeriod"))

        charges = []

        # 4) Charges
        for p in properties:
            sc, _ = ServiceCharge.objects.get_or_create(
                company=company,
                property=p,
                service_period=period,
                defaults={
                    "amount": 3000,
                    "notice_sent_at": timezone.now(),
                    "description": "Service charge June 2026",
                },
            )
            charges.append(sc)

        self.stdout.write(self.style.SUCCESS(f"Charges ready: {len(charges)}"))

        # 5) Payments (različiti scenariji)
        for i, sc in enumerate(charges):
            if i % 3 == 0:
                Payment.objects.get_or_create(
                    service_charge=sc,
                    amount=3000,
                    date_paid="2026-06-05",
                )
            elif i % 3 == 1:
                Payment.objects.get_or_create(
                    service_charge=sc,
                    amount=1500,
                    date_paid="2026-06-06",
                )
            # ostali unpaid

        self.stdout.write(self.style.SUCCESS("Payments seeded"))

        # 6) CHECK
        self.stdout.write("\n=== CHECK ===")

        for sc in charges:
            paid = sc.payments.aggregate(total=Sum("amount"))["total"] or 0
            remaining = sc.amount - paid

            self.stdout.write(
                f"{sc.property.name} | Charge: {sc.amount} | Paid: {paid} | Remaining: {remaining}"
            )

        self.stdout.write(self.style.SUCCESS("\nSeeding complete 🚀"))
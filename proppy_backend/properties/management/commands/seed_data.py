from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
import random

from properties.models import Company, Block, Property, UserRookeryRole
from users.models import Role

User = get_user_model()


class Command(BaseCommand):
    """
    Seed / Clean database for development.

    USAGE:
    - python manage.py seed_data --deleteall
    - python manage.py seed_data --create
    - python manage.py seed_data --deleteall --create

    WHY:
    - fast dev reset
    - predictable test data
    """

    help = "Seed or clean database"

    def add_arguments(self, parser):
        parser.add_argument(
            "--deleteall",
            action="store_true",
            help="Delete all data"
        )
        parser.add_argument(
            "--create",
            action="store_true",
            help="Create seed data"
        )

    def handle(self, *args, **options):
        deleteall = options["deleteall"]
        create = options["create"]

        if not deleteall and not create:
            self.stdout.write(
                self.style.ERROR("Use --deleteall or --create")
            )
            return

        with transaction.atomic():

            # =========================
            # DELETE
            # =========================
            if deleteall:
                self.stdout.write(self.style.WARNING("Deleting all data..."))

                Property.objects.all().delete()
                Block.objects.all().delete()
                UserRookeryRole.objects.all().delete()
                Company.objects.all().delete()

                # brišemo samo seed korisnike
                User.objects.filter(email__startswith="seed_").delete()

                self.stdout.write(self.style.SUCCESS("All data deleted."))

            # =========================
            # CREATE
            # =========================
            if create:
                self.stdout.write(self.style.SUCCESS("Creating seed data..."))

                role, _ = Role.objects.get_or_create(
                    code="COMPANYADMIN",
                    defaults={"name": "Company Admin"}
                )

                for i in range(1, 3):  # 2 firme
                    company = Company.objects.create(
                        name=f"Company {i}"
                    )

                    user = User.objects.create_user(
                        email=f"seed_admin_{i}@test.com",
                        password="1234"
                    )

                    UserRookeryRole.objects.create(
                        user=user,
                        company=company,
                        role=role
                    )

                    # 3-4 blocka
                    for j in range(random.randint(3, 4)):
                        Block.objects.create(
                            name=f"Block {chr(65 + j)}",
                            company=company
                        )

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Company {company.id} | Admin: {user.email}"
                        )
                    )

                self.stdout.write(self.style.SUCCESS("Seed data created."))
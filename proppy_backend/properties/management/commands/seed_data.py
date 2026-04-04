from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
import random

from properties.models import Company, Block, Property, PropertyOwner, UserRookeryRole
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

                PropertyOwner.objects.all().delete()
                Property.objects.all().delete()
                Block.objects.all().delete()
                UserRookeryRole.objects.all().delete()
                Company.objects.all().delete()

                # brišemo samo seed korisnike
                User.objects.filter(email__startswith="admin_").delete()
                User.objects.filter(email__startswith="owner_").delete()

                self.stdout.write(self.style.SUCCESS("All data deleted."))

            # =========================
            # CREATE
            # =========================
            if create:
                self.stdout.write(self.style.SUCCESS("Creating seed data..."))

                # Role
                admin_role, _ = Role.objects.get_or_create(
                    code="COMPANYADMIN",
                    defaults={"name": "Company Admin"}
                )
                owner_role, _ = Role.objects.get_or_create(
                    code="OWNER",
                    defaults={"name": "Owner"}
                )

                # Podaci za firme
                companies_data = [
                    {
                        "name": "Sunce Grupa",
                        "admin_email": "admin_1@test.com",
                        "blocks": ["Zgrada A", "Zgrada B"],
                    },
                    {
                        "name": "Moja Nekretnina d.o.o.",
                        "admin_email": "admin_2@test.com",
                        "blocks": ["Blok 1", "Blok 2"],
                    },
                ]

                for company_info in companies_data:
                    # Kreiraj firmu
                    company = Company.objects.create(
                        name=company_info["name"]
                    )

                    # Kreiraj admina
                    admin_user = User.objects.create_user(
                        email=company_info["admin_email"],
                        password="1234"
                    )

                    UserRookeryRole.objects.create(
                        user=admin_user,
                        company=company,
                        role=admin_role
                    )

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Company: {company.name} | Admin: {admin_user.email}"
                        )
                    )

                    # Kreiraj 2 bloka
                    for block_name in company_info["blocks"]:
                        block = Block.objects.create(
                            name=block_name,
                            company=company
                        )

                        self.stdout.write(f"  └─ Block: {block.name}")

                        # Kreiraj 2 nekretnine po bloku
                        for apt_num in range(1, 3):
                            property_name = f"Stan {apt_num}"
                            prop = Property.objects.create(
                                name=property_name,
                                block=block
                            )

                            # Kreiraj vlasnika za nekretninu
                            owner_email = f"owner_{company.id}_{block.id}_{prop.id}@test.com"
                            owner_user = User.objects.create_user(
                                email=owner_email,
                                password="1234"
                            )

                            owner = PropertyOwner.objects.create(
                                property=prop,
                                user=owner_user,
                                display_name=f"Vlasnik {apt_num}",
                            )

                            UserRookeryRole.objects.create(
                                user=owner_user,
                                company=company,
                                role=owner_role,
                                property_owner=owner
                            )

                            self.stdout.write(f"      └─ {prop.name} | Owner: {owner_email}")

                self.stdout.write(self.style.SUCCESS("Seed data created."))

# from django.core.management.base import BaseCommand
# from django.contrib.auth import get_user_model
# from django.db import transaction
# import random

# from properties.models import Company, Block, Property, UserRookeryRole
# from users.models import Role

# User = get_user_model()


# class Command(BaseCommand):
#     """
#     Seed / Clean database for development.

#     USAGE:
#     - python manage.py seed_data --deleteall
#     - python manage.py seed_data --create
#     - python manage.py seed_data --deleteall --create

#     WHY:
#     - fast dev reset
#     - predictable test data
#     """

#     help = "Seed or clean database"

#     def add_arguments(self, parser):
#         parser.add_argument(
#             "--deleteall",
#             action="store_true",
#             help="Delete all data"
#         )
#         parser.add_argument(
#             "--create",
#             action="store_true",
#             help="Create seed data"
#         )

#     def handle(self, *args, **options):
#         deleteall = options["deleteall"]
#         create = options["create"]

#         if not deleteall and not create:
#             self.stdout.write(
#                 self.style.ERROR("Use --deleteall or --create")
#             )
#             return

#         with transaction.atomic():

#             # =========================
#             # DELETE
#             # =========================
#             if deleteall:
#                 self.stdout.write(self.style.WARNING("Deleting all data..."))

#                 Property.objects.all().delete()
#                 Block.objects.all().delete()
#                 UserRookeryRole.objects.all().delete()
#                 Company.objects.all().delete()

#                 # brišemo samo seed korisnike
#                 User.objects.filter(email__startswith="seed_").delete()

#                 self.stdout.write(self.style.SUCCESS("All data deleted."))

#             # =========================
#             # CREATE
#             # =========================
#             if create:
#                 self.stdout.write(self.style.SUCCESS("Creating seed data..."))

#                 role, _ = Role.objects.get_or_create(
#                     code="COMPANYADMIN",
#                     defaults={"name": "Company Admin"}
#                 )

#                 for i in range(1, 3):  # 2 firme
#                     company = Company.objects.create(
#                         name=f"Company {i}"
#                     )

#                     user = User.objects.create_user(
#                         email=f"admin_{i}@test.com",
#                         password="1234"
#                     )

#                     UserRookeryRole.objects.create(
#                         user=user,
#                         company=company,
#                         role=role
#                     )

#                     # 3-4 blocka
#                     for j in range(random.randint(3, 4)):
#                         Block.objects.create(
#                             name=f"Block {chr(65 + j)}",
#                             company=company
#                         )

#                     self.stdout.write(
#                         self.style.SUCCESS(
#                             f"Company {company.id} | Admin: {user.email}"
#                         )
#                     )

#                 self.stdout.write(self.style.SUCCESS("Seed data created."))
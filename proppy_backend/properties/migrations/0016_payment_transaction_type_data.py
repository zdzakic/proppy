from django.db import migrations

from properties.constants import PAYMENT_TRANSACTION_TYPE_NAMES


def insert_transaction_types(apps, schema_editor):
    PaymentTransactionType = apps.get_model("properties", "PaymentTransactionType")
    for name, order in PAYMENT_TRANSACTION_TYPE_NAMES:
        PaymentTransactionType.objects.get_or_create(name=name, defaults={"order": order})


def remove_transaction_types(apps, schema_editor):
    PaymentTransactionType = apps.get_model("properties", "PaymentTransactionType")
    PaymentTransactionType.objects.filter(name__in=[name for name, _ in TYPES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("properties", "0015_payment_transaction_type"),
    ]

    operations = [
        migrations.RunPython(insert_transaction_types, reverse_code=remove_transaction_types),
    ]

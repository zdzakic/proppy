from django.db import migrations


def seed_roles(apps, schema_editor):
    Role = apps.get_model("users", "Role")

    roles = [
        ("COMPANYADMIN", "Company Admin"),
        ("OWNER", "Owner"),
        ("TENANT", "Tenant"),
        ("ADMIN", "System Admin"),
    ]

    for code, name in roles:
        Role.objects.get_or_create(code=code, defaults={"name": name})


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0002_role"),
    ]

    operations = [
        migrations.RunPython(seed_roles, migrations.RunPython.noop),
    ]
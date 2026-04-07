import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("properties", "0005_userservice_unique_user_service"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="userrookeryrole",
            name="unique_user_company_role",
        ),
        migrations.AlterField(
            model_name="userrookeryrole",
            name="property_owner",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="properties.propertyowner",
            ),
        ),
        migrations.AddConstraint(
            model_name="userrookeryrole",
            constraint=models.UniqueConstraint(
                fields=("user", "company", "role"),
                condition=models.Q(property_owner__isnull=True),
                name="unique_user_company_role_no_property_owner",
            ),
        ),
        migrations.AddConstraint(
            model_name="userrookeryrole",
            constraint=models.UniqueConstraint(
                fields=("property_owner",),
                condition=models.Q(property_owner__isnull=False),
                name="unique_userrookeryrole_per_property_owner",
            ),
        ),
    ]

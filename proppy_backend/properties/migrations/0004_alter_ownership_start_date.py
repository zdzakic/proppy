# Generated by Django 5.2.3 on 2025-06-19 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0003_ownership_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ownership',
            name='start_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]

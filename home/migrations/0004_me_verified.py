# Generated by Django 2.2.11 on 2021-08-15 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0003_auto_20210813_1655'),
    ]

    operations = [
        migrations.AddField(
            model_name='me',
            name='verified',
            field=models.BooleanField(default=False),
        ),
    ]
# Generated by Django 2.2.11 on 2021-09-09 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0015_auto_20210906_1957'),
    ]

    operations = [
        migrations.AddField(
            model_name='me',
            name='ontime',
            field=models.DateTimeField(null=True),
        ),
    ]

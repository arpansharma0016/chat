# Generated by Django 2.2.11 on 2021-08-17 09:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0005_auto_20210817_0902'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='replier',
            field=models.IntegerField(null=True),
        ),
    ]
# Generated by Django 2.2.11 on 2021-09-03 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0011_chat_answer'),
    ]

    operations = [
        migrations.AddField(
            model_name='me',
            name='current_chat',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
# Generated by Django 2.2.11 on 2021-09-06 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0014_remove_chat_seen'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='deleted1',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='chat',
            name='deleted2',
            field=models.BooleanField(default=False),
        ),
    ]

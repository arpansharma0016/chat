# Generated by Django 2.2.11 on 2021-08-25 17:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_message_rtype'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='vc',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='chat',
            name='vc_starter',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
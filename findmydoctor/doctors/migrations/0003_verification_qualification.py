# Generated by Django 5.1.2 on 2024-10-27 15:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0002_remove_verification_qualification'),
    ]

    operations = [
        migrations.AddField(
            model_name='verification',
            name='qualification',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
# Generated by Django 5.1.2 on 2024-10-24 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0002_doctor_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctor',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='doctor_profiles/'),
        ),
    ]

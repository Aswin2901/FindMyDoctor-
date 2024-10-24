from django.db import models
from django.utils import timezone

class Doctor(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    date_of_birth = models.DateField()
    state = models.CharField(max_length=100)
    address = models.TextField()
    password = models.CharField(max_length=128)
    profile_picture = models.ImageField(upload_to='doctor_profiles/', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)  
    

    def __str__(self):
        return self.full_name

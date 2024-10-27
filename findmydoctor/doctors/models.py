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
    is_verified = models.BooleanField(default=False) 
    form_submitted = models.BooleanField(default=False)  

    def __str__(self):
        return self.full_name


class Verification(models.Model):
    doctor = models.OneToOneField(Doctor, on_delete=models.CASCADE)  # Assuming a User model for doctors
    qualification = models.CharField(max_length=255 , null=True)
    specialty = models.CharField(max_length=255)
    experience = models.IntegerField()
    hospital = models.CharField(max_length=255)
    clinic = models.CharField(max_length=255, null=True)
    license = models.CharField(max_length=255)
    issuing_authority = models.CharField(max_length=255)
    expiry_date = models.DateField()
    medical_registration = models.CharField(max_length=255)
    id_proof = models.FileField(upload_to='documents/')
    medical_license = models.FileField(upload_to='documents/')
    degree_certificate = models.FileField(upload_to='documents/')

    def __str__(self):
        return f"{self.doctor.email}'s Verification"
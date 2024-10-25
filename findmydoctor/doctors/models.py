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
    doctor = models.OneToOneField(Doctor, on_delete=models.CASCADE, related_name='verification')
    id_proof = models.FileField(upload_to='verification/id_proofs/', null=True, blank=True)
    medical_license = models.FileField(upload_to='verification/medical_licenses/', null=True, blank=True)
    degree_certificate = models.FileField(upload_to='verification/degree_certificates/', null=True, blank=True)
    license_number = models.CharField(max_length=50, null=True, blank=True)
    issuing_authority = models.CharField(max_length=100, null=True, blank=True)
    license_expiry_date = models.DateField(null=True, blank=True)
    medical_registration = models.CharField(max_length=100, null=True, blank=True)
    verification_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Verification for {self.doctor.full_name}"
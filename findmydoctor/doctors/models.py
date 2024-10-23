from django.db import models

class Doctor(models.Model):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    date_of_birth = models.DateField()
    state = models.CharField(max_length=100)
    address = models.TextField()
    password = models.CharField(max_length=128)  # Manually handle password hashing if needed

    def __str__(self):
        return self.full_name

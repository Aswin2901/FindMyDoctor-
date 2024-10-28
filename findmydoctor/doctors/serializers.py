from rest_framework import serializers
from .models import Doctor , Verification
from django.contrib.auth.hashers import make_password , check_password
from rest_framework import serializers


class DoctorSignupSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Doctor
        fields = ['full_name', 'email', 'phone', 'gender', 'date_of_birth', 'state', 'address', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Hash the password
        validated_data.pop('confirm_password')  # Remove confirm_password before saving
        doctor = Doctor.objects.create(**validated_data)
        return doctor




class DoctorLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        print(email , password)

        try:
            # Check if the doctor exists
            doctor = Doctor.objects.get(email=email)
        except Doctor.DoesNotExist:
            raise serializers.ValidationError("Doctor with this email does not exist.")

        # Check if the password is correct
        if not check_password(password, doctor.password):
            raise serializers.ValidationError("Incorrect password.")

        # Return the validated doctor data if everything is correct
        return doctor


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['full_name', 'email', 'phone', 'gender', 'created_at']
        

class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = [
            'doctor',
            'id_proof',
            'medical_license',
            'degree_certificate',
            'license_number',
            'issuing_authority',
            'license_expiry_date',
            'medical_registration',
            'verification_date',
        ]
        extra_kwargs = {
            'doctor': {'required': True},
        }

    def create(self, validated_data):
        verification = Verification.objects.create(**validated_data)
        return verification
    
class DoctorReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = '__all__'  # Or list each field explicitly if preferred
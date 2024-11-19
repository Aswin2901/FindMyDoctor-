from rest_framework import serializers
from .models import Appointment
from django.utils import timezone

class AppointmentSerializer(serializers.ModelSerializer):
    # Define default values for fields
    status = serializers.CharField(default='confirmed', read_only=True)
    created_at = serializers.DateTimeField(default=timezone.now, read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Appointment
        fields = ['doctor', 'patient', 'date', 'time', 'status', 'reason_for_visit', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set status to "Pending" and created_at to current time if not provided
        validated_data['status'] = 'Pending'
        validated_data['created_at'] = timezone.now()
        return super().create(validated_data)

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from accounts.models import Notification
from .models import Appointment
from .serializers import AppointmentSerializer

@api_view(['POST'])
def create_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        appointment = serializer.save()
        print('appointment ' , appointment)
        
        # Create a notification for the user after the appointment is created
        Notification.objects.create(
            user=appointment.patient,
            doctor=appointment.doctor,
            type="new appointment",
            doctor_message = f'{appointment.patient.full_name} Taken a appointment on {appointment.date} at {appointment.time}.',
            message=f"Appointment created successfully on {appointment.date} at {appointment.time}. Please be ready for it."
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
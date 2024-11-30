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


@api_view(['GET'])
def appointment_history(request, doctor_id):
    try:
        appointments = Appointment.objects.filter(doctor_id=doctor_id).order_by('-date', '-time')
        serializer = AppointmentSerializer(appointments, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def cancel_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        if appointment.status == 'canceled':
            return Response({'message': 'Appointment is already canceled.'}, status=status.HTTP_400_BAD_REQUEST)
        
        appointment.status = 'canceled'
        appointment.save()

        # Create a notification for the patient about the cancellation
        Notification.objects.create(
            user=appointment.patient,
            doctor=appointment.doctor,
            type="appointment cancellation",
            doctor_message=f"Appointment with {appointment.patient.full_name} on {appointment.date} at {appointment.time} was canceled.",
            message=f"Your appointment with Dr. {appointment.doctor.full_name} on {appointment.date} at {appointment.time} has been canceled."
        )

        return Response({'message': 'Appointment canceled successfully.'}, status=status.HTTP_200_OK)
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from accounts.models import Notification , User
from doctors.models import Doctor

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


@api_view(['GET'])
def patients_of_doctor(request, doctor_id):
    try:
        # Ensure the doctor exists
        doctor = Doctor.objects.get(id=doctor_id)

        # Get distinct patients who have appointments with the doctor
        patient_ids = Appointment.objects.filter(doctor=doctor).values_list('patient', flat=True).distinct()
        patients = User.objects.filter(id__in=patient_ids)

        # Serialize the patients' data
        patient_data = [{'id': patient.id, 'full_name': patient.full_name, 'email': patient.email} for patient in patients]
        
        return Response(patient_data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def doctors_of_patient(request, user_id):
    try:
        # Ensure the patient exists
        patient = User.objects.get(id=user_id)

        # Get distinct doctors who have appointments with the patient
        doctor_ids = Appointment.objects.filter(patient=patient).values_list('doctor', flat=True).distinct()
        doctors = Doctor.objects.filter(id__in=doctor_ids)

        # Serialize the doctors' data
        doctor_data = [{'id': doctor.id, 'full_name': doctor.full_name, 'email': doctor.email} for doctor in doctors]

        return Response(doctor_data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'Patient not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from datetime import datetime
from .serializers import (
                          DoctorSignupSerializer ,
                          DoctorLoginSerializer ,
                          DoctorSerializer , 
                          VerificationSerializer,
                          DoctorReviewSerializer ,
                          GetDoctorSerializer,
                          AppointmentAvailabilitySerializer,
                          BreakTimeSerializer,
                          LeaveSerializer)
from .models import Doctor , Verification , AppointmentAvailability , BreakTime , Leave
from django.http import JsonResponse
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404



@api_view(['POST'])
def doctor_signup(request):
    print(request.data)
    serializer = DoctorSignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Doctor registered successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def doctor_login(request):
    print(request.data)
    serializer = DoctorLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        doctor = serializer.validated_data
        # Login success; return success response
        return Response({"message": "Login successful", "doctor_id": doctor.id}, status=status.HTTP_200_OK)
    else:
        # Print or log validation errors to debug
        print(serializer.errors)  # This will print errors in your console/log
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

@api_view(['GET'])
def recent_doctors(request):
    doctors = Doctor.objects.order_by('-created_at')[:3]
    serializer = DoctorSerializer(doctors, many=True)
    return Response(serializer.data)

def get_all_doctors(request):
    doctors = Doctor.objects.all().values('id', 'full_name', 'email', 'phone', 'gender','is_verified', 'date_of_birth', 'state', 'address', 'profile_picture')
    return JsonResponse(list(doctors), safe=False)


@api_view(['GET'])
def doctor_verification_status(request, doctor_id):
    print(doctor_id)
    try:
        verification = Doctor.objects.get(id=doctor_id)
        response_data = {
            'is_verified': verification.is_verified,
            'form_submitted': verification.form_submitted
        }
        return Response(response_data, status=status.HTTP_200_OK)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor verification status not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['POST'])
def doctor_verification(request, doctor_id):
    try:
        doctor = Doctor.objects.get(id = doctor_id)
        print("Request Data:", request.data)
        print("Request FILES:", request.FILES)

        
        
        verification_data = {
            'doctor': doctor,  
            'qualification' : request.data.get('qualification'),
            'specialty': request.data.get('specialty'),
            'experience': request.data.get('experience'),
            'hospital': request.data.get('hospital'),
            'clinic': request.data.get('clinic'),
            'license': request.data.get('license'),
            'issuing_authority': request.data.get('issuing_authority'),
            'expiry_date': request.data.get('expiry_date'),
            'medical_registration': request.data.get('medical_registration'),
            'id_proof': request.FILES['idProof'],
            'medical_license': request.FILES['medicalLicense'],
            'degree_certificate': request.FILES['degreeCertificate'],
        }
        
        verification = Verification.objects.create(**verification_data)
        doctor.form_submitted = True
        doctor.save()
        return Response({'message': 'Verification submitted successfully'}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        print(e)
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class DoctorVerificationDetailView(APIView):    
    def get(self, request, doctor_id):
        try:
            verification = Verification.objects.get(doctor__id=doctor_id)
            doctor = Doctor.objects.get(id=doctor_id)
            serializer = DoctorReviewSerializer(verification)
            response_data = {
                'doc_id': doctor.id,
                'full_name': doctor.full_name,
                'email': doctor.email,
                'phone': doctor.phone,
                **serializer.data  # Includes serialized verification fields
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Verification.DoesNotExist:
            return Response({"error": "Doctor verification details not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def VerifyDoctor(request, doctor_id):
    try:
        print(f'Received request to verify doctor with ID: {doctor_id}')
        
        doctor = Doctor.objects.get(id=doctor_id)
        print(doctor)
        doctor.is_verified = True
        doctor.save()
        
        return Response(
            {"message": "Doctor verified successfully."},
            status=status.HTTP_200_OK
        )
    
    except Doctor.DoesNotExist:
        print('Doctor not found.')
        return Response(
            {"error": "Doctor not found."},
            status=status.HTTP_404_NOT_FOUND
        )
        
@api_view(['GET'])
def get_verified_doctors(request):
    verified_doctors = Doctor.objects.filter(is_verified=True)
    serializer = GetDoctorSerializer(verified_doctors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def mark_availability(request):
    try:
        data = JSONParser().parse(request)
        user_id = data.get('userId')
        date = data.get('date')
        duration = data.get('duration')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        breaks = data.get('breaks', [])

        # Validate inputs
        if not user_id or not date or not start_time or not end_time:
            raise ValueError("Missing required fields: userId, date, start_time, or end_time.")
        if not isinstance(date, str) or not isinstance(start_time, str) or not isinstance(end_time, str):
            raise ValueError("Date, start_time, and end_time must be strings.")

        # Parse date and time fields
        parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
        parsed_start_time = datetime.strptime(start_time, "%I:%M %p").time()
        parsed_end_time = datetime.strptime(end_time, "%I:%M %p").time()
        
        
        print('duration' , duration)
        print("Parsed date:", parsed_date)
        print("Parsed start time:", parsed_start_time)
        print("Parsed end time:", parsed_end_time)
        

        # Validate break times
        parsed_breaks = []
        for break_time in breaks:
            break_start = datetime.strptime(break_time['start'], "%I:%M %p").time()
            break_end = datetime.strptime(break_time['end'], "%I:%M %p").time()
            parsed_breaks.append({'start': break_start, 'end': break_end})

        # Get doctor instance
        doctor = Doctor.objects.get(id=user_id)

        # Save availability
        availability = AppointmentAvailability.objects.create(
            doctor=doctor,
            date=parsed_date,
            duration=str(duration),
            start_time=parsed_start_time,
            end_time=parsed_end_time,
        )

        print("Parsed breaks:", parsed_breaks)
        
        # Save break times
        for break_time in parsed_breaks:
            BreakTime.objects.create(
                availability=availability,
                start_time=break_time['start'],
                end_time=break_time['end']
            )

        return JsonResponse({'message': 'Availability marked successfully!'}, status=201)

    except ValueError as ve:
        print(f"ValueError: {ve}")
        return JsonResponse({'error': str(ve)}, status=400)
    except Exception as e:
        print(f"Exception: {e}")
        return JsonResponse({'error': str(e)}, status=400)

class LeaveView(APIView):
    def post(self, request):
        doctor = get_object_or_404(Doctor, email=request.data.get('email'))
        data = {
            "doctor": doctor.id,
            "date": request.data.get("date"),
        }
        serializer = LeaveSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BreakTimeView(APIView):
    def post(self, request):
        availability = get_object_or_404(AppointmentAvailability, id=request.data.get('availability_id'))
        data = {
            "availability": availability.id,
            "start_time": request.data.get("start_time"),
            "end_time": request.data.get("end_time"),
        }
        serializer = BreakTimeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import DoctorSignupSerializer , DoctorLoginSerializer ,DoctorSerializer
from rest_framework.decorators import api_view
from .models import Doctor , Verification
from django.http import JsonResponse

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
    doctors = Doctor.objects.all().values('id', 'full_name', 'email', 'phone', 'gender', 'date_of_birth', 'state', 'address', 'profile_picture')
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
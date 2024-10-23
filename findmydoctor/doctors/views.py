from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import DoctorSignupSerializer , DoctorLoginSerializer
from rest_framework.decorators import api_view

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
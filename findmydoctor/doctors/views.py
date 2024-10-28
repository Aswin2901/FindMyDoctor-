from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import DoctorSignupSerializer , DoctorLoginSerializer ,DoctorSerializer , VerificationSerializer, DoctorReviewSerializer
from .models import Doctor , Verification
from django.http import JsonResponse
from rest_framework.views import APIView

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
    
    
@api_view(['POST'])
def doctor_verification(request, doctor_id):
    try:
        doctor = Doctor.objects.get(id = doctor_id)
        print("Request Data:", request.data)
        print("Request Files:", request.FILES)
        
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
            print(response_data)
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
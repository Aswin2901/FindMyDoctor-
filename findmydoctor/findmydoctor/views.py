from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import update_last_login
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from doctors.models import Doctor

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check if the email exists in the Doctor table first
        try:
            doctor = Doctor.objects.get(email=email)
            if check_password(password, doctor.password):  # Verify password for doctor
                # Create JWT tokens manually since Doctor is not a standard user model
                refresh = RefreshToken.for_user(doctor)  # Adjust based on your custom implementation
                response_data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'is_doctor': True,
                    'doctor_id': doctor.id,  # Include any other doctor-specific info if needed
                }
                return Response(response_data, status=status.HTTP_200_OK)
        except Doctor.DoesNotExist:
            pass  # Continue to check in the regular User model
        
        # If not a doctor, check in the default User model
        try:
            user_model = get_user_model()
            user = user_model.objects.get(email=email)
            if user.check_password(password):  # Validate password
                response = super().post(request, *args, **kwargs)
                response.data['is_superuser'] = user.is_superuser
                response.data['is_doctor'] = False
                return response
        except user_model.DoesNotExist:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        # If no match, return an error response
        return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

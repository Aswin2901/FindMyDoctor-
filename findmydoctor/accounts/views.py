from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import AuthenticationFailed
import random
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.decorators import api_view
from django.core.cache import cache
from social_django.utils import psa
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow


# Function to initiate Google OAuth login
@api_view(['GET'])
def google_login(request):
    auth_url = f'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY}&redirect_uri=http://localhost:3000/oauth/callback/&scope=email profile'
    return Response({'auth_url': auth_url})


# Function to handle Google OAuth callback and exchange code for access token
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import os
from dotenv import load_dotenv
load_dotenv()

@api_view(['GET'])
def google_callback(request):
    # Get the authorization code from the URL
    code = request.GET.get('code')
    
    if not code:
        return Response({'error': 'Authorization code not provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Initialize the OAuth 2.0 flow with the client secrets file
        flow = Flow.from_client_secrets_file(
            os.getenv('path_to_client_secret_json'),  
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
            redirect_uri='http://localhost:3000/oauth/callback/'  # Ensure it matches the Google Console redirect URI
        )
        
        # Exchange the authorization code for an access token
        flow.fetch_token(code=code)
        credentials = flow.credentials
        access_token = credentials.token
        
        # Retrieve user information from Google using the access token
        user_info_endpoint = 'https://www.googleapis.com/oauth2/v2/userinfo'
        response = requests.get(user_info_endpoint, headers={'Authorization': f'Bearer {access_token}'})
        user_info = response.json()
        
        # Example: Use the user info here (e.g., create or login user)
        # You can extract email, name, and other details from `user_info`
        print('response sent !!!!!!')
        return Response({'access_token': access_token, 'user_info': user_info, 'message': 'Google OAuth login successful'})

    except Exception as e:
        # Handle any errors during the token exchange or user info retrieval
        return Response({'error': f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)



# Generate a random OTP
def generate_otp():
    return random.randint(100000, 999999)


# Send OTP to user's email
def send_otp_email(email, otp):
    send_mail(
        'Your OTP Code',
        f'Your OTP is {otp}',
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )


# Endpoint to register a user and send OTP
@csrf_exempt
@api_view(['POST'])
def register_user(request):
    email = request.data.get('email')

    # Generate and store OTP in cache
    otp = generate_otp()
    cache.set(email, otp, timeout=300)  # OTP expires in 5 minutes

    # Send OTP to email
    send_otp_email(email, otp)

    return JsonResponse({'message': 'OTP sent to your email'}, status=status.HTTP_200_OK)


# Verify OTP and register the user if OTP is valid
@csrf_exempt
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    input_otp = request.data.get('otp')
    cached_otp = cache.get(email)

    if cached_otp and str(cached_otp) == input_otp:
        # OTP is valid, register the user
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)


# Custom JWT Token Obtain View
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
        except AuthenticationFailed as e:
            return Response({'error': str(e)}, status=400)

        return Response({
            'access': response.data['access'],
            'refresh': response.data['refresh'],
            'user': {
                'email': request.data['email'],
                'phone': request.data.get('phone'),
                'gender': request.data.get('gender'),
            }
        })

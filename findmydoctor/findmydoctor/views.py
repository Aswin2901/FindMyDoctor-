from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import update_last_login
from rest_framework.permissions import AllowAny

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        try:
            # Get the user based on the email provided
            user = self.get_user_from_request(request)
            
            if user:
                is_superuser = user.is_superuser
                response.data['is_superuser'] = is_superuser

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return response

    def get_user_from_request(self, request):
        # Get the user by email from the request data
        email = request.data.get('email')
        if email:
            from django.contrib.auth import get_user_model
            User = get_user_model()
            try:
                return User.objects.get(email=email)
            except User.DoesNotExist:
                return None
        return None

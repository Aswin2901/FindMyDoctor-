from django.urls import path
from .views import register_user ,verify_otp , CustomTokenObtainPairView , google_callback , google_login , all_users
from . import views

urlpatterns = [
    path('register/', register_user, name='register_user'),  
    path('verify-otp/', verify_otp, name='verify_otp'), 
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('oauth/login/', google_login , name='google_login'),
    path('oauth/callback/', google_callback, name='google_callback'),
    path('all/' , all_users , name='all_users'),
    path('get_profile/<int:userId>/', views.get_user_profile, name='get_user_profile'),
    path('add-to-my-doctors/', views.add_to_my_doctors, name='add-to-my-doctors'),
    path('<int:user_id>/favorites/', views.user_favorite_doctors, name='user_favorite_doctors'),
]

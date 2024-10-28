from django.urls import path
from .views import doctor_signup , doctor_login , recent_doctors , get_all_doctors , doctor_verification_status , doctor_verification , DoctorVerificationDetailView , VerifyDoctor

urlpatterns = [
    path('register/', doctor_signup, name='doctor-signup'),
    path('login/', doctor_login, name='doctor-login'),
    path('recent/', recent_doctors, name='recent_doctors'),
    path('all/', get_all_doctors, name='get_all_doctors'),
    path('verification/<int:doctor_id>/', doctor_verification_status, name='doctor_verification_status'),
    path('verify/<int:doctor_id>/', doctor_verification, name='doctor-verification'),
    path('review/<int:doctor_id>/', DoctorVerificationDetailView.as_view(), name='doctor-verification-detail'),
    path('makeverify/<int:doctor_id>/', VerifyDoctor, name='verify-doctor'),
]

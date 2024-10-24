from django.urls import path
from .views import doctor_signup , doctor_login , recent_doctors , get_all_doctors

urlpatterns = [
    path('register/', doctor_signup, name='doctor-signup'),
    path('login/', doctor_login, name='doctor-login'),
    path('recent/', recent_doctors, name='recent_doctors'),
    path('all/', get_all_doctors, name='get_all_doctors'),
]

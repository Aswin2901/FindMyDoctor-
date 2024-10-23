from django.urls import path
from .views import doctor_signup , doctor_login 

urlpatterns = [
    path('register/', doctor_signup, name='doctor-signup'),
    path('login/', doctor_login, name='doctor-login'),
]

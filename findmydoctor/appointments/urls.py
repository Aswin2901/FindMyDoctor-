from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_appointment, name='create_appointment'),
    path('history/<int:doctor_id>/', views.appointment_history, name='appointment_history'),
    path('cancel/<int:appointment_id>/', views.cancel_appointment, name='cancel_appointment'),
]
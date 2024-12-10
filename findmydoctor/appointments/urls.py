from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_appointment, name='create_appointment'),
    path('history/<int:doctor_id>/', views.appointment_history, name='appointment_history'),
    path('cancel/<int:appointment_id>/', views.cancel_appointment, name='cancel_appointment'),
    path('doctors/<int:doctor_id>/patients/', views.patients_of_doctor, name='patients_of_doctor'),
    path('patients/<int:user_id>/doctors/' , views.doctors_of_patient , name='doctors_of_patient'),
    path('notifications/<int:notification_id>/mark-as-read/', views.mark_notification_as_read, name='mark-as-read'),
]
from django.db import models
from accounts.models import User
from doctors.models import Doctor
from appointments.models import Appointment
from django.utils.timezone import now

class ChatMessage(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver}"

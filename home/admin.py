from django.contrib import admin
from .models import Chat, Message, Confirm, Password, Me

admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(Me)
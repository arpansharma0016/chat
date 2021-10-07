from django.db import models

class Confirm(models.Model):
    username = models.TextField()
    name = models.TextField()
    email = models.TextField()
    password = models.TextField()
    otp = models.TextField()
    attempts = models.IntegerField(default=0)

class Password(models.Model):
    email = models.TextField()
    otp = models.TextField()
    confirmed = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)

import os
def image_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.user_id}.{ext}"
    folder = os.path.join('users/', str(instance.user_id))
    return os.path.join(folder, filename)

class Me(models.Model):
    user_id = models.IntegerField()
    image = models.ImageField(null=True, blank=True, upload_to=image_name)
    first_name = models.TextField()
    email = models.TextField()
    bio = models.TextField()
    location = models.TextField()
    online = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    current_chat = models.IntegerField(blank=True, null=True)
    ontime = models.DateTimeField(null=True)


class Chat(models.Model):
    user1 = models.IntegerField()
    user2 = models.IntegerField()
    blocker = models.IntegerField(blank=True, null=True)
    approved = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    typing1 = models.BooleanField(default=False)
    typing2 = models.BooleanField(default=False)
    deleted1 = models.BooleanField(default=False)
    deleted2 = models.BooleanField(default=False)
    vc_starter = models.IntegerField(blank=True, null=True)
    vc = models.BooleanField(default=False)
    offer = models.TextField(blank=True, null=True)
    answer = models.TextField(blank=True, null=True)

import os
def chat_image_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"{instance.chat_id}.{ext}"
    folder = os.path.join('chat/', str(instance.chat_id))
    return os.path.join(folder, filename)

class Message(models.Model):
    chat_id = models.IntegerField()
    message = models.TextField()
    sender = models.IntegerField()
    receiver = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
    status = models.TextField()
    deleted = models.BooleanField(default=False)
    mtype = models.TextField()
    image = models.ImageField(null=True, blank=True, upload_to=chat_image_name)
    reply = models.BooleanField(default=False)
    replied = models.IntegerField(null=True)
    reply_id = models.IntegerField(null=True)
    reply_message = models.TextField(null=True)
    rtype = models.TextField(null=True)


    def __str__(self):
        return f"{str(self.message)}, {str(self.sender)} -> {str(self.receiver)}, {str(self.created)}"

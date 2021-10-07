from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from home.models import Chat, Message, Confirm, Password, Me
import datetime
import razorpay
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
import random
import math
from django.contrib.auth.hashers import make_password
import os
from django.db.models import Q
import json
from django.core import serializers
import time

def index(request):
    if request.user.is_authenticated:
        mee = Me.objects.all()
        return render(request, 'discover.html', {'mee':mee})

    else:
        return redirect('/')


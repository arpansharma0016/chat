from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse, StreamingHttpResponse
from django.contrib.auth.models import User, auth
from django.contrib import messages
from .models import Chat, Message, Confirm, Password, Me
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


def register(request):
    
    if request.method == 'POST':
        first_name = request.POST['first_name']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        email = request.POST['email']

        username = email
        
        
        if password1 == password2:
            if User.objects.filter(username=username).exists():
                messages.info(request, 'Username Taken')
                return redirect("register")
            
            elif User.objects.filter(email=email).exists():
                messages.info(request, 'Email Taken')
                return redirect("register")
            
            
            else:
                for i in username:
                    if i.isupper():
                        messages.info(request, 'Email must be lowercase')
                        return redirect("register")

                    if i == " ":
                        messages.info(request, 'Email must not contain any Spaces')
                        return redirect("register")
                      
                if Confirm.objects.filter(email=email).exists():
                    confirm_user = Confirm.objects.get(email=email)
                    confirm_user.delete()
                    digits = "0123456789"
                    otp = ""
                    for i in range(6):
                        otp += digits[math.floor(random.random()*10)]
                    new_otp = otp
                    print(new_otp)
                    confirm_user = Confirm.objects.create(username=username, name=first_name, email=email, password=password1, otp=new_otp)
                    confirm_user.save()
                    subject = 'Thank You for registering to Affiliator.in!'
                    message = 'Hi ' + confirm_user.name + '!\n \nWe have recieved an Account Creation request from you.\n\nYour Email Confirmation Code is '+new_otp+'.\n\nAt Affiliator.in, you can easily add Affiliate Products right from your Dedicated Dashboard. Some key features are\n1) No Coding Required\n2) 100% Mobile Responsive\n3) Unlimitted Affiliate Products\n4) Unlimitted Bandwidth\n5) Add Unlimitted Product Categories\n6) Edit any Product Detail\nand many more...\n\nOur Dedicated Management Team is always at your service in case of any Discrepency\nAll the Best\nTeam Affiliator.in.'
                    from_email = settings.EMAIL_HOST_USER
                    to_list = [confirm_user.email]
                    send_mail(subject, message, from_email, to_list, fail_silently=True)
                    messages.info(request, "An Account Confirmation email has been sent to "+confirm_user.email+". Please Enter the code here.")
                    return redirect("confirm_email", email)
                else:
                    digits = "0123456789"
                    otp = ""
                    for i in range(6):
                        otp += digits[math.floor(random.random()*10)]
                    new_otp = otp
                    confirm_user = Confirm.objects.create(username=username, name=first_name, email=email, password=password1, otp=new_otp)
                    confirm_user.save()
                    subject = 'Thank You for registering to Affiliator.in!'
                    message = 'Hi ' + confirm_user.name + '!\n \nWe have recieved an Account Creation request from you.\n\nYour Email Confirmation Code is '+new_otp+'.\n\nAt Affiliator.in, you can easily add Affiliate Products right from your Dedicated Dashboard. Some key features are\n1) No Coding Required\n2) 100% Mobile Responsive\n3) Unlimitted Affiliate Products\n4) Unlimitted Bandwidth\n5) Add Unlimitted Product Categories\n6) Edit any Product Detail\nand many more...\n\nOur Dedicated Management Team is always at your service in case of any Discrepency\nAll the Best\nTeam Affiliator.in.'
                    from_email = settings.EMAIL_HOST_USER
                    to_list = [confirm_user.email]
                    send_mail(subject, message, from_email, to_list, fail_silently=True)
                    messages.info(request, "An Account confirmation email has been sent to "+confirm_user.email)
                    return redirect("confirm_email", email)
    
                
        
        else:
            messages.info(request, 'Password doesnt match')
            return redirect("register")
        
    else:
        return render(request, 'register.html')

def confirm_email(request, uname):
    
    if not Confirm.objects.filter(email=uname).exists():
        messages.info(request, "Please register first")
        return redirect("register")
    else:
        confirm_email = Confirm.objects.get(email=uname)
        old_otp = confirm_email.otp
        print(old_otp)
        
        if request.method == 'POST':
            otp = request.POST['otp']
            if otp == old_otp:
                user = User.objects.create_user(username=confirm_email.username, password=confirm_email.password, first_name=confirm_email.name, email=confirm_email.email)
                user.save()
                me = Me.objects.create(user_id=user.id, first_name=user.first_name, email=user.email)
                me.save()
                confirm_email.delete()
                messages.info(request, "Email confirmed successfully!")
                messages.info(request, "Login to continue.")
                return redirect("login")
            else:
                if confirm_email.attempts < 4:
                    confirm_email.attempts +=1
                    confirm_email.save()
                    messages.info(request, "Incorrect Otp, Try Again.")
                    messages.info(request, str((5-confirm_email.attempts))+ " attempts left.")
                    return redirect("confirm_email", uname)
                else:
                    confirm_email.attempts = 0
                    confirm_email.save()
                    messages.info(request, "Maximum Attempts held for this confirmation code. We've sent a new Confirmation code to "+confirm_email.email+". Please enter the new Code.")
                    return redirect("resend_code", confirm_email.email)

        

        return render(request, "confirm_email_otp.html", {'confirm_email':confirm_email})


def resend_code(request, uname):
    if Confirm.objects.filter(email=uname).exists():
        confirm_user = Confirm.objects.get(email=uname)
        digits = "0123456789"
        otp = ""
        for i in range(6):
            otp += digits[math.floor(random.random()*10)]
        new_otp = otp
        confirm_user.otp = new_otp
        confirm_user.save()
        subject = 'Your new Password Confirmation Code is '+new_otp+'.'
        message = 'Hi ' + confirm_user.name + '!\n \nWe have recieved an Account Creation request from you.\n\nYour New Email Confirmation Code is '+new_otp+'.\n\nAt Affiliator.in, you can easily add Affiliate Products right from your Dedicated Dashboard. Some key features are\n1) No Coding Required\n2) 100% Mobile Responsive\n3) Unlimitted Affiliate Products\n4) Unlimitted Bandwidth\n5) Add Unlimitted Product Categories\n6) Edit any Product Detail\nand many more...\n\nOur Dedicated Management Team is always at your service in case of any Discrepency\nAll the Best\nTeam Affiliator.in.'
        from_email = settings.EMAIL_HOST_USER
        to_list = [confirm_user.email]
        send_mail(subject, message, from_email, to_list, fail_silently=True)
        messages.info(request, "Account confirmation email has been sent to "+confirm_user.email)
        return redirect("confirm_email", uname)
    else:
        messages.info(request, "Please register first!")
        return redirect("register")
    


def login(request):
    if request.user.is_authenticated:
        return redirect("/")
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        for i in email:
            if i.isupper():
                messages.info(request, 'Email must be lowercase')
                return redirect("login")

        if User.objects.filter(email=email).exists():
            arpan = User.objects.get(email=email)
            
        else:
            messages.info(request, 'Invalid Credentials')
            return redirect('login')
        
        user = auth.authenticate(username=arpan.username, password=password)
        
        if user is not None:
            auth.login(request, user)
            confirm_user = User.objects.get(email=email)
            subject = 'New login activity on your Affiliator.in account!'
            '''message = 'Hi ' + confirm_user.first_name + '!\n \nHope you are having a great time with Affiliator.in Affiliate Management Program.\n\nWe have detected a new login activity to your Affiliator.in Account with following details:-\nDate :- '+datetime.datetime.now().strftime("%d")+' '+datetime.datetime.now().strftime("%B")+' '+datetime.datetime.now().strftime("%Y")+'\nTime :- '+datetime.datetime.now().strftime("%H:%M:%S")+'\nDevice Name :- '+request.user_agent.device.family+'\nOperating System :- '+request.user_agent.os.family+' '+request.user_agent.os.version_string+'\nBrowser :- '+request.user_agent.browser.family+' '+request.user_agent.browser.version_string+'\n\nHopefully it was you who logged in your Affiliator.in Affiliate Managemment Account.\n\nIf it was not you, please contact our Management Team to secure your account from fraud.\n\nThank You\nTeam Affiliator.in' 
            '''
            message = 'hi' + confirm_user.first_name
            from_email = settings.EMAIL_HOST_USER
            to_list = [confirm_user.email]
            send_mail(subject, message, from_email, to_list, fail_silently=True)
            return redirect("index")
        
        else:
            messages.info(request, 'Invalid Credentials')
            return redirect('login')
        
    else:
        return render(request, 'login.html')

def logout(request):
    auth.logout(request)
    
    return redirect('/')

def forgot_password(request):
    if request.method == "POST":
        uname = request.POST['email']
        if uname:
            if User.objects.filter(email=uname).exists():
                
                if Password.objects.filter(email=uname).exists():
                    messages.info(request, "We have already sent the confirmation code to the email address associated with "+uname)
                    return redirect("enter_otp", uname)
                else:
                    curr_user = User.objects.get(email=uname)
                    digits = "0123456789"
                    otp = ""
                    for i in range(6):
                        otp += digits[math.floor(random.random()*10)]
                    new_otp = otp
                    print(new_otp)
                    pass_user = Password.objects.create(email=uname, otp=new_otp)
                    pass_user.save()
                    subject = 'Password Reset Request on Affiliator.in!'
                    message = 'Hi ' + curr_user.first_name + '!\n \nWe have recieved a password reset request on your User Account.\n\nYour Password reset code is ' + pass_user.otp +'\nIf it was not you, then please ignore.\n\nOur dedicated customer support team is always at your service.\nWishing you a happy online journey.\n\nThank You.\nTeam Affiliator.in'
                    from_email = settings.EMAIL_HOST_USER
                    to_list = [curr_user.email]
                    send_mail(subject, message, from_email, to_list, fail_silently=True)
                    messages.info(request, "Enter the OTP sent to registered email address asssociated with "+uname)
                    return redirect("enter_otp", uname)
            else:
                messages.info(request, "No user with Username " + uname)
                messages.info(request, "Please enter your registered Username")
                return redirect("forgot_password")
        else:
            messages.info(request, "Enter the username")
            return redirect("forgot_password")
    return render(request, "enter_email.html")

def enter_otp(request, uname):
    if Password.objects.filter(email=uname).exists():
        pass_user = Password.objects.get(email=uname)
        curr_user = User.objects.get(email=uname)
        if request.method == "POST":
            curr_otp = request.POST['otp']
            if pass_user.otp == curr_otp:
                pass_user.confirmed = True
                pass_user.save()
                messages.info(request, "Email address confirmed")
                return redirect("new_password", uname)
            else:
                if pass_user.attempts < 4:
                    pass_user.attempts += 1
                    pass_user.save()
                    messages.info(request, "Incorrect otp, try again!" +str(5-pass_user.attempts)+" attempts left.")
                    return redirect("enter_otp", uname)
                else:
                    pass_user.attempts = 0
                    pass_user.save()
                    messages.info(request, "Maximum attempts held for this confirmation code. Sending another code to email associated with "+pass_user.email)
                    return redirect("resend_pass_code", uname)
        return render(request, "confirm_email_password.html", {'pass_user':pass_user})
    else:
        messages.info(request,"Enter the Registered username for which you want to change the Account Password.")
        return redirect("forgot_password")

def new_password(request, uname):
    if Password.objects.get(email=uname):
        pass_user = Password.objects.get(email=uname)
        curr_user = User.objects.get(email=uname)
        if request.method == "POST":
            if pass_user.confirmed:
                password1 = request.POST['password1']
                password2 = request.POST['password2']
                if password1:
                    if password1 == password2:
                        password = make_password(password1, hasher='default')
                        curr_user.password = password
                        pass_user.delete()
                        curr_user.save()
                        messages.info(request, "Password changed successfully.")
                        return redirect("login")
                    else:
                        messages.info(request, "Passwords Don't Match. Please re-enter the Passwords.")
                        return redirect("new_password")
                else:
                    messages.info(request, "Password Fields cannot be blank.")
                    return redirect("new_password")
            else:
                messages.info(request, "Please enter your username registered with Affiliator.in")
                return redirect("forgot_password")
        return render(request, "new_password.html")
    else:
        messages.info(request, "Please enter your username registered with Affiliator.in")
        return redirect("forgot_password")

def resend_pass_code(request, uname):
    if Password.objects.filter(email=uname).exists():
        curr_user = User.objects.get(email=uname)
        pass_user = Password.objects.get(email=uname)
        digits = "0123456789"
        otp = ""
        for i in range(6):
            otp += digits[math.floor(random.random()*10)]
        new_otp = otp
        pass_user.otp = new_otp
        print(new_otp)
        pass_user.save()
        subject = 'Password Reset Request on Affiliator.in!'
        message = 'Hi ' + curr_user.first_name + '!\n \nWe have recieved a password reset request on your User Account.\n\nYour Password reset code is ' + pass_user.otp +'\nIf it was not you, then please ignore.\n\nOur dedicated customer support team is always at your service.\n Wishing you a happy online journey.\n\nThank You.\nTeam Affiliator.in'
        from_email = settings.EMAIL_HOST_USER
        to_list = [curr_user.email]
        send_mail(subject, message, from_email, to_list, fail_silently=True)
        messages.info(request, "Password reset code has been sent to email address associated with "+uname)
        return redirect("enter_otp", uname)
    else:
        messages.info(request, "Please enter the username first")
        return redirect("forgot_password")


def index(request):
    if request.user.is_authenticated:
        # chats = Chat.objects.filter(Q(user1=request.user.id) | Q(user2=request.user.id))

        use = Me.objects.get(user_id=request.user.id)
        user = User.objects.get(id=request.user.id)
        use.current_chat = 0
        use.ontime = datetime.datetime.now()
        use.save()

        if request.method == "POST":
            first_name = request.POST['first_name']
            first_name = first_name.replace("<", "&lt;").replace(">", "&gt;").replace('\"', '&quot;').replace("\'", '&apos;').replace("&", '&amp;')
            if not first_name.strip():
                return redirect("/")
            location = request.POST['location']
            location = location.replace("<", "&lt;").replace(">", "&gt;").replace('\"', '&quot;').replace("\'", '&apos;').replace("&", '&amp;')
            bio = request.POST['bio']
            bio = bio.replace("<", "&lt;").replace(">", "&gt;").replace('\"', '&quot;').replace("\'", '&apos;').replace("&", '&amp;')

            use.first_name = first_name
            user.first_name = first_name
            use.location = location
            use.bio = bio

            exts = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG']

            if request.FILES.get('image'):
                image = request.FILES['image']
                if not image.name.split('.')[-1] in exts:
                    messages.info(request, f'We do not support ".{image.name.split(".")[-1]}" file extension!')
                    return redirect('/')
                use.image = image

            use.save()
            user.save()
            messages.info(request, 'Profile updated successfully!')
            return redirect('/')

        context = {
            # 'chats':chats,
            'use':use,
            'usr':request.user.id,
        }
        return render(request, "chat.html", context)

    else:
        return redirect("login")

messagesnumber = 0

def get_messages(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        chh = ch.first()
        if ch.exists():
            if chh.user1 == request.user.id:
                chat_user = chh.user2
                chh.typing1 = False
                chh.save()
            elif chh.user2 == request.user.id:
                chat_user = chh.user1
                chh.typing2 = False
                chh.save()
            else:
                return JsonResponse({'status':'fail'})
            
            global messagesnumber
            messagesnumber = 1
            chat = list(ch)
            chat = serializers.serialize('json', chat)
            mee = Me.objects.get(user_id=request.user.id)
            mee.current_chat = chat_id
            # print('changed chat id')
            mee.save()
            me = list(Me.objects.filter(user_id=chat_user))
            me = serializers.serialize('json', me)
            return JsonResponse({'status':'success', 'chat_user':chat_user, 'chat':chat, 'image':me})
        else:
            return JsonResponse({'status':'fail'})

    else:
        return JsonResponse({'status':'fail'})


@csrf_exempt
def send_message(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            updatedData=json.loads(request.body.decode('UTF-8'))
            chat_id = int(updatedData['chat_id'])
            ch = Chat.objects.filter(id=chat_id)

            if ch.exists():
                ch = ch.first()
                if ch.user1 == request.user.id:
                    rec = ch.user2
                    ch.typing1 = False
                elif ch.user2 == request.user.id:
                    rec = ch.user1
                    ch.typing2 = False
            else:
                return JsonResponse({'status':'fail'})
            
            if ch.approved:
                message = updatedData['message'].strip()
                mtype = "message"
                message = message.replace("<", "&lt;").replace(">", "&gt;")
                if not message:
                    return JsonResponse({'status':'fail'})
                sender = int(updatedData['sender'])
                if sender != request.user.id:
                    return JsonResponse({'status':'fail'})
                receiver = int(updatedData['receiver'])
                if receiver != rec:
                    return JsonResponse({'status':'fail'})
                status = "sent"
                mess = Message.objects.create(chat_id=chat_id, message=message, sender=sender, receiver=receiver, status=status, mtype=mtype)
                repll = ''
                is_reply = False
                repliedd = 0
                rtype = ""
                if not updatedData['reply_message_id'] == '' and not updatedData['reply_mess'] == '':
                    mess.reply = True
                    mess.replied = updatedData['reply_repliedd']
                    mess.reply_id = int(updatedData['reply_message_id'])
                    mess.reply_message = updatedData['reply_mess']
                    repll = updatedData['reply_mess']
                    is_reply = True
                    repliedd = updatedData['reply_repliedd']
                    mess.rtype = updatedData['rtype']
                    rtype = updatedData['rtype']
                mess.save()
                ch.save()
                return JsonResponse({'status':'success', 'mtype':mtype, 'message':mess.message, 'created':mess.created, 'repll':repll, 'is_reply':is_reply, 'repliedd':repliedd, 'rtype':rtype})
            else:
                return JsonResponse({'status':'fail'})

        else:
            return JsonResponse({'status':'fail'})

    else:
        return JsonResponse({'status':'fail'})


@csrf_exempt
def send_image(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            chat_id = int(request.POST.get('chat_id'))
            ch = Chat.objects.filter(id=chat_id)

            if ch.exists():
                ch = ch.first()
                if ch.user1 == request.user.id:
                    rec = ch.user2
                elif ch.user2 == request.user.id:
                    rec = ch.user1
            else:
                return JsonResponse({'status':'fail'})

            if ch.approved:
                image = request.FILES.get('image')
                exts = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF']
                if request.FILES.get('image'):
                    if not image.name.split('.')[-1] in exts:
                        return JsonResponse({'status':'fail'})
                else:
                    return JsonResponse({'status':'fail'})
                mtype = "image"
                sender = int(request.POST.get('sender'))
                if sender != request.user.id:
                    return JsonResponse({'status':'fail'})
                receiver = int(request.POST.get('receiver'))
                if receiver != rec:
                    return JsonResponse({'status':'fail'})
                status = "sent"
                mess = Message.objects.create(chat_id=chat_id, image=image, sender=sender, receiver=receiver, status=status, mtype=mtype)
                repll = ''
                is_reply = False
                repliedd = 0
                rtype = ""
                if not request.POST.get('reply_message_id') == '' and not request.POST.get('reply_mess') == '':
                    mess.reply = True
                    mess.replied = request.POST.get('reply_repliedd')
                    mess.reply_id = int(request.POST.get('reply_message_id'))
                    mess.reply_message = request.POST.get('reply_mess')
                    repll = request.POST.get('reply_mess')
                    is_reply = True
                    repliedd = request.POST.get('reply_repliedd')
                    mess.rtype = request.POST.get('rtype')
                    rtype = request.POST.get('rtype')
                mess.save()
                return JsonResponse({'status':'success', 'mtype':mtype, 'image':str(mess.image), 'created':mess.created, 'repll':repll, 'is_reply':is_reply, 'repliedd':repliedd, 'rtype':rtype})
            else:
                return JsonResponse({'status':'fail'})
        else:
            return JsonResponse({'status':'fail'})

    else:
        return JsonResponse({'status':'fail'})


def is_online(request):
    if request.user.is_authenticated:
        mee = Me.objects.get(user_id=request.user.id)
        if not mee.online:
            return JsonResponse({'status':'ok'})
        else:
            mee.ontime = datetime.datetime.now()
            mee.save()
            # print('success', request.user.id)
            return JsonResponse({'status':'success'})
    
    else:
        return JsonResponse({'status':'fail'})


def message_event_stream(request, user_id):
    initial_data1 = ""
    initial_data2 = ""
    while True:
        mee = list()
        ch = list()
        chha = Chat.objects.filter(Q(user1=user_id) | Q(user2=user_id)).order_by("-created")
        for chh in chha:
            mm = Message.objects.filter(chat_id=chh.id).last()
            if mm:
                mee.append(mm)
            else:
                mee.append(chh)
        mee.sort(key=lambda x: x.created, reverse=True)
        for m in mee:
            if m._meta.model.__name__ == "Chat":
                ch.append(m)
            else:
                ch.append(Chat.objects.get(id=m.chat_id))
        data1 = list()
        data2 = list()
        data3 = list()
        mem = Me.objects.get(user_id=request.user.id)
        for chat in ch:
            data3.append(chat)
            if chat.user1 == user_id:
                data1.append(Me.objects.get(user_id=chat.user2))
                if not mem.online:
                    if chat.typing1:
                        chat.typing1 = False
                        chat.save()
            elif chat.user2 == user_id:
                data1.append(Me.objects.get(user_id=chat.user1))
                if not mem.online:
                    if chat.typing2:
                        chat.typing2 = False
                        chat.save()

            mess = Message.objects.filter(chat_id=chat.id)
            if mess.exists():
                data2.append(mess.last())

        dat1 = serializers.serialize('json', data1)
        dat2 = serializers.serialize('json', data2)
        dat3 = serializers.serialize('json', data3)
        
        # print('overall', request.user.id, datetime.datetime.now())
        if mem.ontime + datetime.timedelta(seconds=65) <= datetime.datetime.now():
            mem.online = False
            mem.save()
            # print('error', request.user.id)

        if not mem.online:
            dd = {'model':'error'}
            dd = json.dumps(dd)
            yield f"\ndata: {dd}\n\n"
            break

        if not initial_data1 == dat1 or not initial_data2 == dat2 or not initial_data3 == dat3:
            yield f"\ndata: {dat1}\n\ndata: {dat2}\n\ndata: {dat3}\n\n"
            global messagesnumber
            messagesnumber = 1
            initial_data1 = dat1
            initial_data2 = dat2
            initial_data3 = dat3

        time.sleep(1)

def check_new_message(request):
    if request.user.is_authenticated:
        response = StreamingHttpResponse(message_event_stream(request, request.user.id))
        response['Content-Type'] = 'text/event-stream'
        return response

    else:
        return JsonResponse({"status":"fail"})


def event_stream(request, chat_id):
    initial_data = ""
    initial_data2 = ""
    initial_data3 = ""
    while True:
        data = list(Message.objects.filter(chat_id=chat_id).order_by('-id')[:50][::-1])
        data2 = list(Me.objects.filter(user_id=request.user.id))
        data3 = list(Chat.objects.filter(id=chat_id))
        ch = data3[0]
        data = serializers.serialize('json', data)
        data2 = serializers.serialize('json', data2)
        data3 = serializers.serialize('json', data3)
        mee = Me.objects.get(user_id=request.user.id)
        # print('chat', ch.id)
        if not mee.online:
            dd = {'model':'error'}
            dd = json.dumps(dd)
            yield f"\ndata: {dd}\n\n"
            break

        if mee.current_chat == 0 or not mee.current_chat == chat_id:
            # print(mee.current_chat, chat_id)
            dd = {'model':'error'}
            dd = json.dumps(dd)
            yield f"\ndata: {dd}\n\n"
            break 

        if not initial_data == data or not initial_data2 == data2 or not initial_data3 == data3:
            appr = ""
            typing = ""
            global messagesnumber
            messagesnumber = 1
            if not ch.approved:
                appr = "no"
            else:
                appr = 'yes'
            if ch.user1 == request.user.id:
                if ch.typing2:
                    typing = "yes"
            elif ch.user2 == request.user.id:
                if ch.typing1:
                    typing = "yes"
            m = Message.objects.filter(chat_id=chat_id).order_by('-id')[:2][::-1]
            if len(m) > 0:
                if len(m) > 1:
                    m = m[1]
                else:
                    m = m[0]
                if m.receiver == request.user.id:
                    mee = Me.objects.get(user_id=m.receiver)
                    if mee.online:
                        if m.status == "seen":
                            data4 = {'model':'custom', 'seen': 'ok', 'appr':appr, 'typing':typing}
                        else:
                            m.status = "seen"
                            m.save()
                        data4 = {'model':'custom', 'seen': 'ok', 'appr':appr, 'typing':typing}
                elif m.sender == request.user.id:
                    if m.status == "seen":
                        data4 = {'model':'custom', 'seen': 'seen', 'appr':appr, 'typing':typing}
                    else:
                        data4 = {'model':'custom', 'seen':'no', 'appr':appr, 'typing':typing}
            else:
                data4 = {'model':'custom', 'seen':'non', 'appr':appr, 'typing':typing}

            data4 = json.dumps(data4)

            yield f"\ndata: {data4}\n\ndata: {data}\n\n"
            initial_data = data
            initial_data2 = data2
            initial_data3 = data3

        time.sleep(1)

def current_chat_set(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        chh = ch.first()
        if ch.exists():
            if chh.user1 == request.user.id or chh.user2 == request.user.id:
                if chh.user1 == request.user.id and chh.typing1:
                    chh.typing1 = False
                    chh.save()
                elif chh.user2 == request.user.id and chh.typing2:
                    chh.typing2 = False
                    chh.save()
                mee = Me.objects.get(user_id=request.user.id)
                if not mee.current_chat == 0:
                    mee.current_chat = 0
                    mee.save()
                return JsonResponse({'status':'success'})
                
            else:
                return JsonResponse({"status":"fail"})
        else:
            return JsonResponse({"status":"fail"})

    else:
        return JsonResponse({"status":"fail"})


def check_reply(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        if ch.exists():
            if ch.first().user1 == request.user.id or ch.first().user2 == request.user.id:
                response = StreamingHttpResponse(event_stream(request, chat_id))
                response['Content-Type'] = 'text/event-stream'
                return response
            else:
                return JsonResponse({"status":"fail"})
        else:
            return JsonResponse({"status":"fail"})

    else:
        return JsonResponse({"status":"fail"})


def seen_messages(request, chat_id):
    appr = ""
    typing = ""
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        if ch.exists():
            if ch.first().user1 == request.user.id or ch.first().user2 == request.user.id:
                global messagesnumber
                messagesnumber = 1
                if not ch.first().approved:
                    appr = "no"
                else:
                    appr = 'yes'
                if ch.first().user1 == request.user.id:
                    if ch.first().typing2:
                        typing = "yes"
                elif ch.first().user2 == request.user.id:
                    if ch.first().typing1:
                        typing = "yes"
                m = Message.objects.filter(chat_id=chat_id)
                if m.exists():
                    m = m.last()
                    if m.receiver == request.user.id:
                        mee = Me.objects.get(user_id=m.receiver)
                        if mee.online:
                            if m.status == "seen":
                                return JsonResponse({'status':'done', 'appr':appr, 'typing':typing})
                            m.status = "seen"
                            m.save()
                            return JsonResponse({'status':'done', 'appr':appr, 'typing':typing})
                        else:
                            return JsonResponse({'status':'done', 'appr':appr, 'typing':typing})
                    elif m.sender == request.user.id:
                        if m.status == "seen":
                            return JsonResponse({'status':'success', 'appr':appr, 'typing':typing})
                        return JsonResponse({'status':'no', 'appr':appr, 'typing':typing})
                else:
                    return JsonResponse({'status':'ok', 'appr':appr, 'typing':typing})
            else:
                return JsonResponse({'status':'fail', 'appr':appr, 'typing':typing})
        else:
            return JsonResponse({'status':'fail', 'appr':appr, 'typing':typing})

    else:
        return JsonResponse({'status':'fail', 'appr':appr, 'typing':typing})



def load_more_messages(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        if ch.exists():
            if ch.first().user1 == request.user.id or ch.first().user2 == request.user.id:
                global messagesnumber
                num = messagesnumber
                mess = list(Message.objects.filter(chat_id=chat_id))[-((num+1) * 50): -(num*50)]
                if len(mess) < 50:
                    more = False
                else:
                    more = True
                messagesnumber += 1
                mes = serializers.serialize('json', mess)
                return JsonResponse({'status':'success', 'messages':mes, 'more':more})

            else:
                return JsonResponse({'status':'fail'})

    else:
        return JsonResponse({'status':'fail'})


def search_users(request, name):
    if request.user.is_authenticated:
        usr = Me.objects.filter(Q(first_name__icontains=name) | Q(email__icontains=name))
        users = serializers.serialize('json', usr)
        return JsonResponse({'status':'success', 'users':users})

    else:
        return JsonResponse({'status':'fail'})

def open_user(request, id):
    if request.user.is_authenticated:
        usr = Me.objects.filter(user_id=id)
        added = False
        uu = False
        cha = Chat.objects.filter(Q(user1=request.user.id) | Q(user2=request.user.id)).filter(Q(user1=id) | Q(user2=id))
        if cha.exists():
            added = True
        if request.user.id == id:
            added = True
            uu = True
        user = serializers.serialize('json', usr)
        return JsonResponse({'status':'success', 'user':user, 'added':added, 'uu':uu})

    else:
        return JsonResponse({'status':'fail'})


def add_user(request, id):
    if request.user.is_authenticated:
        usr = Me.objects.filter(user_id=id)
        if usr.exists():
            cha = Chat.objects.filter(Q(user1=request.user.id) | Q(user2=request.user.id)).filter(Q(user1=id) | Q(user2=id))
            if cha.exists():
                return JsonResponse({'status':'fail', 'message':'User is already added!'})
            else:
                chat = Chat.objects.create(user1=request.user.id, user2=id, blocker=id)
                chat.save()
                return JsonResponse({'status':'success'})
        else:
            return JsonResponse({'status':'fail', 'message':'This user does not exist!'})

    else:
        return JsonResponse({'status':'fail'})


def approve_chat(request, chat_id):
    if request.user.is_authenticated:
        chat = Chat.objects.filter(id=chat_id)
        if chat.exists():
            ch = chat.first()
            if ch.blocker == request.user.id:
                ch.approved = True
                ch.blocker = None
                ch.save()
                return JsonResponse({'status':'success'})
            
            else:
                return JsonResponse({'status':'fail'})
            
        else:
            return JsonResponse({'status':'fail', 'message':'This user does not exist!'})

    else:
        return JsonResponse({'status':'fail'})


def disapprove_chat(request, chat_id):
    if request.user.is_authenticated:
        chat = Chat.objects.filter(id=chat_id)
        if chat.exists():
            ch = chat.first()
            if ch.approved:
                ch.approved = False
                ch.blocker = request.user.id
                ch.save()
                return JsonResponse({'status':'success'})
            
            else:
                return JsonResponse({'status':'fail'})
            
        else:
            return JsonResponse({'status':'fail', 'message':'This user does not exist!'})

    else:
        return JsonResponse({'status':'fail'})


def user_came_online(request):
    if request.user.is_authenticated:
        uss = Me.objects.filter(user_id=request.user.id)
        if uss.exists():
            uss = uss.first()
            uss.online = True
            uss.ontime = datetime.datetime.now()
            uss.save()
            return JsonResponse({'status':'success'})
        else:
            return JsonResponse({'status':'fail', 'message':'This user does not exist!'})

    else:
        return JsonResponse({'status':'fail'})


def user_went_offline(request):
    if request.user.is_authenticated:
        uss = Me.objects.filter(user_id=request.user.id)
        if uss.exists():
            uss = uss.first()
            uss.online = False
            uss.save()
            return JsonResponse({'status':'success'})
        else:
            return JsonResponse({'status':'fail', 'message':'This user does not exist!'})

    else:
        return JsonResponse({'status':'fail'})



def delete_message(request, id):
    if request.user.is_authenticated:
        mess = Message.objects.filter(id=id)
        if mess.exists():
            mes = mess.last()
            if mes.sender == request.user.id:
                mes.deleted = True
                mes.save()
                return JsonResponse({'status':'success'})
            else:
                return JsonResponse({'status':'fail'})
        else:
            return JsonResponse({'status':'fail'})

    else:
        return JsonResponse({'status':'fail'})

def user_typing(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        if ch.exists():
            chat = ch.first()
            if chat.user1 == request.user.id:
                if not chat.typing1:
                    chat.typing1 = True
                    chat.save()
                return JsonResponse({'status':'success'})
            elif chat.user2 == request.user.id:
                if not chat.typing2:
                    chat.typing2 = True
                    chat.save()
                return JsonResponse({'status':'success'})
            else:
                return JsonResponse({'status':'fail'})
        else:
            return JsonResponse({'status':'fail'})

    else:
        return JsonResponse({'status':'fail'})


def user_not_typing(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        if ch.exists():
            chat = ch.first()
            if chat.user1 == request.user.id:
                if chat.typing1:
                    chat.typing1 = False
                    chat.save()
                return JsonResponse({'status':'success'})
            elif chat.user2 == request.user.id:
                if chat.typing2:
                    chat.typing2 = False
                    chat.save()
                return JsonResponse({'status':'success'})
            else:
                return JsonResponse({'status':'fail'})
        else:
            return JsonResponse({'status':'fail'})

    else:
        return JsonResponse({'status':'fail'})


def search_user_chats(request, name):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(Q(user1=request.user.id) | Q(user2=request.user.id))
        if ch:
            li = list()
            for chat in ch:
                if chat.user1 == request.user.id:
                    me = Me.objects.filter(user_id=chat.user2)
                    if me.exists():
                        li.append([me.first(), chat.id])
                elif chat.user2 == request.user.id:
                    me = Me.objects.filter(user_id=chat.user1)
                    if me.exists():
                        li.append([me.first(), chat.id])

            lis = list()
            liss = list()
            for l in li:
                if name.lower() in l[0].first_name.lower():
                    lis.append(l[0])
                    liss.append(l[1])
            lii = serializers.serialize('json', lis)
            liis = json.dumps(liss)
            return JsonResponse({'status':'success', 'chats':lii, 'ids':liis})
        else:
            return JsonResponse({'status':'none'})

    else:
        return JsonResponse({'status':'fail'})


def vc(request, chat_id):
    if request.user.is_authenticated:
        chat = Chat.objects.filter(id=chat_id)
        if chat.exists():
            chat = chat.first()
            if request.user.id == chat.user1 or request.user.id == chat.user2:
                me = Me.objects.get(user_id=request.user.id)
                if request.user.id == chat.user1:
                    you = Me.objects.get(user_id=chat.user2)
                elif request.user.id == chat.user2:
                    you = Me.objects.get(user_id=chat.user1)
                else:
                    return HttpResponse("Something went wrong!")
                context = {
                    'me':me,
                    'you':you,
                }
                return render(request, 'vc.html', context)

            else:
                return HttpResponse("Something went wrong!")
        else:
            return HttpResponse("Something went wrong!")
    else:
        return HttpResponse("You are not logged in!")



@csrf_exempt
def start_vc(request, chat_id):
    if request.user.is_authenticated:
        if request.method == "POST":
            updatedData=json.loads(request.body.decode('UTF-8'))
            ch = Chat.objects.filter(id=chat_id)

            if ch.exists():
                chat = ch.first()
                if not chat.vc:
                    chat.vc = True
                    chat.vc_starter = request.user.id
                    chat.offer = updatedData
                    chat.save()
                    return JsonResponse({'status':'success', 'offer':updatedData})

                else:
                    return JsonResponse({'status':'done'})

            else:
                return JsonResponse({'status':'none'})

        else:
            return JsonResponse({'status':'none'})

    else:
        return JsonResponse({'status':'fail'})


@csrf_exempt
def accept_vc(request, chat_id):
    if request.user.is_authenticated:
        if request.method == "POST":
            updatedData=json.loads(request.body.decode('UTF-8'))
            ch = Chat.objects.filter(id=chat_id)
            if ch.exists():
                chat = ch.first()
                if chat.vc:
                    chat.answer = updatedData
                    chat.save()
                    return JsonResponse({'status':'success', 'answer':updatedData})

                else:
                    return JsonResponse({'status':'done'})

            else:
                return JsonResponse({'status':'none'})

        else:
            return JsonResponse({'status':'none'})

    else:
        return JsonResponse({'status':'fail'})


def end_vc(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        if ch.exists():
            chat = ch.first()
            if chat.vc:
                chat.vc = False
                chat.vc_starter = None
                chat.offer = None
                chat.answer = None
                chat.save()
                return JsonResponse({'status':'success', 'ended':True})

            else:
                return JsonResponse({'status':'done'})

        else:
            return JsonResponse({'status':'none'})

    else:
        return JsonResponse({'status':'fail'})



def vc_event_stream(request, chat_id):
    initial_data = ""
    while True:
        chat = Chat.objects.get(id=chat_id)
        data = serializers.serialize('json', chat)

        if not initial_data == data:
            yield f"\ndata: {data}\n\n"
            initial_data = data

        time.sleep(1)

def make_vc(request, chat_id):
    if request.user.is_authenticated:
        ch = Chat.objects.filter(id=chat_id)
        if ch.exists():
            response = StreamingHttpResponse(vc_event_stream(request, chat_id))
            response['Content-Type'] = 'text/event-stream'
            return response

        else:
            return JsonResponse({"status":"fail"})
    else:
        return JsonResponse({"status":"fail"})
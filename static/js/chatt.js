usr = parseInt(document.currentScript.getAttribute('user'))
var current_chat = 0
var unseenusers = []
var unseenindex
var o = 0
var evs
var eevvss
$chat = $(".chat");
var ee, chaa, ussrr, naa
var reloadchat
var currentes
var typing_message
var onn
var errshow = true
var errcount = 0

loadchat = function(e, name, chat_id){
    $chat.fadeIn();
    $chat.addClass("chat--show");
    document.getElementById('searchchatsinput').value = ''
    document.getElementById('addsearchuserchatshere').innerHTML = ''
    rm_reply()
    document.getElementById('addmessagehere').innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
            </div>
        </div>
        `
        document.getElementById('writeuserdatahere').innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="spinner-border text-primary" role="status">
                </div>
            </div>
            `
    id = parseInt(chat_id)
    url = `/get_messages-${id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            var img = JSON.parse(response.image)
            var chatt = JSON.parse(response.chat)[0].fields
            if (chatt.approved){
                var image
                if (img[0].fields.image){
                    image = `<img src="/media/${img[0].fields.image}" alt="${img[0].fields.first_name}" loading="lazy">`
                } else {
                    image = `<img src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" alt="${img[0].fields.first_name}" loading="lazy">`
                }
                // document.getElementById('videocalliconcontainer').innerHTML = `
                // <li onclick="videocallmodal(event, ${id}, ${usr})">
                //     <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
                //         <path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
                //     </svg>
                // </li>
                // `
    
                document.getElementById('chatuserimage').innerHTML = `
                ${image}
                `
                var onl = ""
                if (img[0].fields.online){
                    onl = "online"
                }
                var verified = ""
                if (img[0].fields.verified){
                    verified = `<i style="color:#0d6efd" class="bi bi-patch-check-fill"></i>`
                }
                document.getElementById('chatusername').innerHTML = `
                <span class="chat-member__name">${name}&nbsp;${verified}</span>
                <span class="chat-member__status" id="openusertoponline--${img[0].fields.user_id}">${onl}</span>
                `
                document.getElementById('chatinputbox').innerHTML = `
                <div class="custom-form__send-wrapper">
                  <input type="text" class="form-control custom-form" id="message" onkeyup="typing(event, '${id}');" onkeypress="enterkey(event);" placeholder="Type a message …" autocomplete="off">
                  <input type="hidden" id="currentchatuser">
                  <input type="hidden" id="currentchatid">
                  <div class="custom-form__send-img">
                  <label for="chatimageinput">
                    <svg xmlns="http://www.w3.org/2000/svg" class="svg-icon svg-icon--send-img" viewBox="0 0 45.7 45.7">
                      <path d="M6.6,45.7A6.7,6.7,0,0,1,0,39.1V6.6A6.7,6.7,0,0,1,6.6,0H39.1a6.7,6.7,0,0,1,6.6,6.6V39.1h0a6.7,6.7,0,0,1-6.6,6.6ZM39,4H6.6A2.6,2.6,0,0,0,4,6.6V39.1a2.6,2.6,0,0,0,2.6,2.6H39.1a2.6,2.6,0,0,0,2.6-2.6V6.6A2.7,2.7,0,0,0,39,4Zm4.7,35.1Zm-4.6-.4H6.6a2.1,2.1,0,0,1-1.8-1.1,2,2,0,0,1,.3-2.1l8.1-10.4a1.8,1.8,0,0,1,1.5-.8,2.4,2.4,0,0,1,1.6.7l4.2,5.1,6.6-8.5a1.8,1.8,0,0,1,1.6-.8,1.8,1.8,0,0,1,1.5.8L40.7,35.5a2,2,0,0,1,.1,2.1A1.8,1.8,0,0,1,39.1,38.7Zm-17.2-4H35.1l-6.5-8.6-6.5,8.4C22,34.6,22,34.7,21.9,34.7Zm-11.2,0H19l-4.2-5.1Z" fill="#f68b3c" />
                    </svg>
                    </label>
                  </div>
                  <input id="chatimageinput" type="file" style="display:none;" accept="image/png, image/jpeg, image/jpg, image/gif">
                  <button class="custom-form__send-submit" onclick="submitbutton(event)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="svg-icon svg-icon--send" viewBox="0 0 45.6 45.6">
                      <g>
                        <path d="M20.7,26.7a1.4,1.4,0,0,1-1.2-.6,1.6,1.6,0,0,1,0-2.4L42.6.5a1.8,1.8,0,0,1,2.5,0,1.8,1.8,0,0,1,0,2.5L21.9,26.1A1.6,1.6,0,0,1,20.7,26.7Z" fill="#d87232" />
                        <path d="M29.1,45.6a1.8,1.8,0,0,1-1.6-1L19.4,26.2,1,18.1a1.9,1.9,0,0,1-1-1.7,1.8,1.8,0,0,1,1.2-1.6L43.3.1a1.7,1.7,0,0,1,1.8.4,1.7,1.7,0,0,1,.4,1.8L30.8,44.4a1.8,1.8,0,0,1-1.6,1.2ZM6.5,16.7l14.9,6.6a2,2,0,0,1,.9.9l6.6,14.9L41,4.6Z" fill="#d87232" />
                      </g>
                    </svg>
                  </button>
                </div>
                `
                document.getElementById('currentchatuser').value = JSON.parse(response.chat_user)
                document.getElementById('currentchatid').value = chat_id
                current_chat = id
                updateScroll()
                var bb = ""
                if (img[0].fields.bio){
                    bb = `<p><strong>Bio: </strong>${img[0].fields.bio}</p>`
                }
                document.getElementById('writeuserdatahere').innerHTML = `
                <div class="user-profile__avatar">
                    ${image}
                </div>
                <div class="user-profile__details mt-1">
                    <span class="user-profile__name">${name}&nbsp;${verified}</span>
                    <span class="user-profile__phone">${img[0].fields.email}</span>
                    <span class="user-profile__location">${img[0].fields.location}</span>
                    <span class="user-profile__name"><button class="btn btn-primary" onclick="disapprovechat(event, '${name}', ${JSON.parse(response.chat)[0].pk})">Disapprove?</button></span>
                </div>
                <div class="user-profile__description">
                    ${bb}
                </div>
                `
                unseenindex = unseenusers.indexOf(response.chat_user)
                if (unseenindex > -1){
                    unseenusers.splice(unseenindex, 1)
                    if (unseenusers.length > 0){
                        document.getElementById('unseenchatsdiv').setAttribute('style', '')
                        document.getElementById('openunseenchatnumber').setAttribute('style', '')
                        document.getElementById('openunseenchatnumber').innerHTML = `
                        <div class="chat__notification d-flex d-md-none chat__notification--new">
                                  <span>${unseenusers.length}</span>
                                </div>
                        `
                        document.getElementById('unseenchatsnumber').innerText = unseenusers.length
                    } else {
                        unseenusers = []
                        document.getElementById('unseenchatsdiv').setAttribute('style', 'display:none;')
                        document.getElementById('openunseenchatnumber').setAttribute('style', 'display:none;')
                    }
                }
                document.getElementById('chatimageinput').addEventListener('change', function(){
                      sendimage(e)
                })

                ee = e
                chaa = chat_id
                ussrr = parseInt(response.chat_user)
                naa = name
                check_reply(e, chat_id, response.chat_user, name)
            } else {
                if (chatt.blocker !== usr){
                    document.getElementById('addmessagehere').innerHTML = `
                    <section class="page_404">
                      <div class="container">
                        <div class="row">	
                        <div class="col-sm-12 ">
                        <div class="col-sm-10 col-sm-offset-1  text-center">
                        <div class="four_zero_four_bg">
                        </div>
                        
                        <div class="contant_box_404">
                        <h3 class="h2" style="color: #a3a3a3;">
                        This chat is not approved by the user yet!
                        </h3>
                        
                        <p style="color: #a3a3a3;">the page you are looking for is not avaible!</p>
                      </div>
                        </div>
                        </div>
                        </div>
                      </div>
                    </section>
                    `
                    // document.getElementById('videocalliconcontainer').innerHTML = ``
                    
                } else {
                    document.getElementById('addmessagehere').innerHTML = `
                    <section class="page_404">
                      <div class="container">
                        <div class="row">	
                        <div class="col-sm-12 ">
                        <div class="col-sm-10 col-sm-offset-1  text-center">
                        <div class="four_zero_four_bg">
                        </div>
                        
                        <div class="contant_box_404">
                        <h3 class="h2" style="color: #a3a3a3;">
                        Do you wish to approve this chat?
                        </h3><br>
                        <a href="" class="btn btn-primary" id="approvechatbutton">Approve</a>
                      </div>
                        </div>
                        </div>
                        </div>
                      </div>
                    </section>
                    `
                    // document.getElementById('videocalliconcontainer').innerHTML = ``
                    document.getElementById('approvechatbutton').setAttribute('onclick', `approvethischat(event, "${name}", ${JSON.parse(response.chat)[0].pk})`)
                }
                document.getElementById('chatinputbox').innerHTML = ``
                // document.getElementById('videocalliconcontainer').innerHTML = ''
                var image
                if (img[0].fields.image){
                    image = `<img src="/media/${img[0].fields.image}" alt="${img[0].fields.first_name}" loading="lazy">`
                } else {
                    image = `<img src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" alt="${img[0].fields.first_name}" loading="lazy">`
                }
    
                document.getElementById('chatuserimage').innerHTML = `
                ${image}
                `
                var bb = ""
                if (img[0].fields.bio){
                    bb = `<p><strong>Bio: </strong>${img[0].fields.bio}</p>`
                }
                var verified = ""
                if (img[0].fields.verified){
                    verified = `<i style="color:#0d6efd" class="bi bi-patch-check-fill"></i>`
                }
                document.getElementById('writeuserdatahere').innerHTML = `
                <div class="user-profile__avatar">
                    ${image}
                </div>
                <div class="user-profile__details mt-1">
                    <span class="user-profile__name">${name}&nbsp;${verified}</span>
                    <span class="user-profile__phone">${img[0].fields.email}</span>
                    <span class="user-profile__location">${img[0].fields.location}</span>
                </div>
                <div class="user-profile__description">
                    ${bb}
                </div>
                `
                document.getElementById('chatusername').innerHTML = `
                <span class="chat-member__name">${name}</span>`
            }
        }
    })
}


function approvethischat(e, name, chat_id){
    e.preventDefault()
    url = `/approve_chat-${chat_id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            reloadchat = "yes"
            loadchat(e, name, chat_id)
        }
    })
}

function disapprovechat(e, name, chat_id){
    e.preventDefault()
    url = `/disapprove_chat-${chat_id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            loadchat(e, name, chat_id)
        }
    })
}

// function enlargeimage(el){
//     document.getElementById('img01').setAttribute('src', el.src)
//     $('#enlargeimagemodal').modal('toggle')
// }


submitbutton = function(e){
    e.preventDefault()
    if (document.getElementById('message').value.trim() != ''){
        if (document.getElementById('seennotifier')){
            document.getElementById('seennotifier').remove()
        }
        var repl = ""
        var peer
        if (document.getElementById('replymessagemessage').value.trim() != ''){
            if (parseInt(document.getElementById('replymessagerepliedd').value) == usr){
                peer = "me"
            } else {
                peer = "you"
            }
            if (document.getElementById('replymessagetype').value.trim() == 'message'){
                repl = `
                <div class="chat__bubble chat__bubble--${peer}" style="opacity:1">
                    ${document.getElementById('replymessagemessage').value}
                </div>
                `
            } else if (document.getElementById('replymessagetype').value.trim() == 'image'){
                replyy = `
                <div class="chat__bubble chat__bubble--${peer}" style="opacity:1; background-color:transparent;">
                    <img src="/media/${document.getElementById('replymessagemessage').value}" height="120px" width="100px" style="object-fit: cover; border-radius: 10px;">
                </div>
                `
            }
        }
        document.getElementById('addmessagehere').innerHTML += `
            <li class=" mb-0" id="removethismessageli">
                <div class="chat__bubble chat__bubble--me">
                ${repl}
                    ${document.getElementById('message').value}
                            <button class="chat__bubble chat__bubble--me" style="border-width:0px;color:black;padding:0px;float:right"><i class="bi bi-reply"></i></button>
                </div>
            </li>
            <div id="messagesenderarrow" style="width:100%; max-width:100%; text-align:right;"><i class="bi bi-arrow-right-circle"></i></div>
        `
        updateScroll();
        url = `/send_message/`
        var message = document.getElementById('message').value;
        var sender = usr
        var receiver = document.getElementById('currentchatuser').value;
        var chat_id = document.getElementById('currentchatid').value;
        var reply_message_id = document.getElementById('replymessageid').value
        var reply_mess = document.getElementById('replymessagemessage').value
        var reply_repliedd = parseInt(document.getElementById('replymessagerepliedd').value)
        var rtype = document.getElementById('replymessagetype').value
        data = {chat_id:chat_id, message:message, sender:sender, receiver:receiver, reply_mess:reply_mess, reply_message_id:reply_message_id, reply_repliedd:reply_repliedd, rtype:rtype}
        document.getElementById('message').focus()
        remove_reply(e)
        document.getElementById('message').value = ""
        $.ajax({
            'type':'POST',
            'url':url,
            'data':JSON.stringify(data),
            'success':function(response){
                if (response.status == "success"){
                    if (document.getElementById('removethismessageli') != 'undefined'){
                        document.getElementById('removethismessageli').remove()
                        document.getElementById('messagesenderarrow').remove()
                    }
                    replyy = ""
                    var person
                    if (response.is_reply){
                        if (response.repliedd == usr){
                            person = "me"
                        } else {
                            person = "you"
                        }
                        if (response.rtype == 'message'){
                            replyy = `
                            <div class="chat__bubble chat__bubble--${person}" style="opacity:1">
                                ${response.repll}
                            </div>
                            `
                        } else if (response.rtype == 'image'){
                            replyy = `
                            <div class="chat__bubble chat__bubble--${person}" style="opacity:1; background-color:transparent;">
                                <img src="/media/${response.repll}" height="120px" width="100px" style="object-fit: cover; border-radius: 10px;">
                            </div>
                            `
                        }
                    }
                    document.getElementById('addmessagehere').innerHTML += `
                        <li class=" mb-0">
                            <div class="chat__bubble chat__bubble--me">
                            ${replyy}
                                ${response.message}
                                        <button class="chat__bubble chat__bubble--me" style="border-width:0px;color:black;padding:0px;float:right"><i class="bi bi-reply"></i></button>
                            </div>
                        </li>
                    `
                    updateScroll();
                    typing(e, chat_id)
                    remove_reply(e)
                } else {
                    setTimeout(showerror(e), 3000)
                }
            },
            'error':function(error){
                setTimeout(showerror(e), 3000)
            },
            'dataType' : 'json',
            'contentType': 'application/json; charset=UTF-8',
        })
    }
}



sendimage = function(e){
    if (document.getElementById('seennotifier')){
        document.getElementById('seennotifier').remove()
    }
    url = `/send_image/`
    if (document.getElementById('chatimageinput').value != "null"){
        document.getElementById('addmessagehere').innerHTML += `
        <li class=" mb-0" id="loaderspinner">
            <div class="chat__bubble chat__bubble--me" style="background-color: transparent;">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border text-primary spinner-border-sm" role="status">
                    </div>
                </div>
            </div>
        </div>    
        `
        var image = $('#chatimageinput')[0].files[0]
        var sender = usr
        var receiver = document.getElementById('currentchatuser').value;
        var chat_id = document.getElementById('currentchatid').value;
        var reply_message_id = document.getElementById('replymessageid').value
        var reply_mess = document.getElementById('replymessagemessage').value
        var reply_repliedd = parseInt(document.getElementById('replymessagerepliedd').value)
        var rtype = document.getElementById('replymessagetype').value
        data = {chat_id:chat_id, image:image, sender:sender, receiver:receiver}
        dataa = new FormData();
        dataa.append("chat_id",chat_id)
        dataa.append("sender",sender)
        dataa.append("receiver",receiver)
        dataa.append("image",image)
        dataa.append("reply_message_id",reply_message_id)
        dataa.append("reply_mess",reply_mess)
        dataa.append("reply_repliedd",reply_repliedd)
        dataa.append("rtype",rtype)

        $.ajax({
            'type':'POST',
            'url':url,
            'mimeType':"multipart/form-data",
            'contentType': false,
            'processData':false,
            'data':dataa,
            'success':function(response){
                document.getElementById('chatimageinput').value = ""
                updateScroll();
                remove_reply(e)
                typing(e)
            },
            'error':function(error){
                setTimeout(showerror(e), 3000)
            },
        })
    }
}


function updateScroll(){
    var element = document.getElementById("messagediv");
    element.scrollTop = element.scrollHeight;
}


function enterkey(e){
    var key=e.keyCode || e.which;
    if (key==13){
       submitbutton(e);
    }
}

var usertyping = false
function typingg(id){
    url = `/user_typing-${id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            usertyping = true
        }
    })
}

function nottypingg(id){
    url = `/user_not_typing-${id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            usertyping = false
        }
    })
}

function typing(e, id){
    id = parseInt(id)
    if (document.getElementById('message').value){
        if (!usertyping){
            typingg(id)
        }
    } else {
        if (usertyping){
            nottypingg(id)
        }
    }
}

function loadmorechat(e, id){
    e.preventDefault()
    document.getElementById('loadmorebutton').innerHTML = `
    <div class="d-flex justify-content-center">
        <div class="spinner-border text-primary spinner-border-sm" role="status">
        </div>
    </div>
    `
    var chat_id = parseInt(id)
    url = `/load_more_messages-${chat_id}`
    $.get(url, function(response){
        if (response.status == "success"){
            document.getElementById("loadmorecontainer").remove()
            mes = JSON.parse(response.messages)
            var mess = ""
            var cre = ""
            for(var i = 0; i< mes.length; i++){
                if (mes[i].fields.created.replace("T", " ").slice(0,10) != cre){
                    mess += `<div class="chat__time">${get_date(mes[i].fields.created.replace("T", " ").slice(0,10))}</div>`
                    cre = mes[i].fields.created.replace("T", " ").slice(0,10)
                }
                if( mes[i].fields.receiver == usr){
                    var fun = ""
                    var messa = ""
                    if (mes[i].fields.deleted){
                        messa = `
                        <li class=" mb-0">
                            <div class="chat__bubble chat__bubble--you">
                                <i style="color:#e0e0e0">this message was deleted!</i><br>
                                </div>
                        </li>
                        `
                    } else {
                        replyy = ''
                        if (mes[i].fields.reply_message){
                            var personn = ""
                            
                            if (mes[i].fields.replied == usr){
                                personn = "me"
                                perr = usr
                            } else {
                                personn = "you"
                                perr = mes[i].fields.sender
                            }
                            if (mes[i].fields.rtype == "message"){
                                replyy = `
                                <div class="chat__bubble chat__bubble--${personn}" style="opacity:1">
                                    ${mes[i].fields.reply_message}
                                </div>
                                `
                            } else if (mes[i].fields.rtype == "image"){
                                replyy = `
                                <div class="chat__bubble chat__bubble--${personn}" style="opacity:1; background-color:transparent;">
                                    <img src="/media/${mes[i].fields.reply_message}" height="120px" width="100px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${mes[i].fields.reply_message}')">
                                </div>
                                `
                            }
                        }
                        var perr = mes[i].fields.sender
                        var mmm = mes[i].fields.message
                        mmm = mmm.replace(/"/g, '&quot;').replace(/'/g, '__this_is_single_qoute__').replace(/\\/g, '\\\\')
                        fun = `onclick="reply_message(event, ${mes[i].pk}, '${mmm}', '${get_time(mes[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'message')"`
                        if (mes[i].fields.mtype == "message") {
                            messa = `
                            <li class=" mb-0">
                                <div class="chat__bubble chat__bubble--you">
                                ${replyy}
                                    ${mes[i].fields.message}
                                    <button ${fun} class="chat__bubble chat__bubble--you" style="border-width:0px;color:white;padding:0px;float:right;margin-right:0px; margin-left:30px"><i class="bi bi-reply"></i></button>
                                </div>
                            </li>
                            `
                        } else if (mes[i].fields.image){
                            var perr = mes[i].fields.sender
                            var mmm = mes[i].fields.image
                            fun = `onclick="reply_message(event, ${mes[i].pk}, '${mmm}', '${get_time(mes[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'image')"`
                            messa = `
                            <li class=" mb-0">
                                <div class="chat__bubble chat__bubble--you" style="background-color: transparent;">
                                ${replyy}
                                <img src="/media/${mes[i].fields.image}" height="220px" width="200px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${mes[i].fields.image}')">
                                <div style="width:100%; max-width:100%; text-align:right; color:black;"><a ${fun}><i class="bi bi-reply"></i></a></div>
                                </div>
                            </li>
                            `
                        }
                    } 


                    mess += messa
                } else {
                    var fun = ""
                    var messa = ""
                    if (mes[i].fields.deleted){
                        messa = `
                        <li class=" mb-0">
                            <div class="chat__bubble chat__bubble--me">
                                <i style="color:#a8a8a8">this message was deleted!</i><br>
                                </div>
                        </li>
                        `
                    } else {
                        var mmm = mes[i].fields.message
                        replyy = ''
                        if (mes[i].fields.reply_message){
                            var personn = ""
                            if (mes[i].fields.replied == usr){
                                personn = "me"
                            } else {
                                personn = "you"
                            }
                            if (mes[i].fields.rtype == "message"){
                                replyy = `
                                <div class="chat__bubble chat__bubble--${personn}" style="opacity:1">
                                    ${mes[i].fields.reply_message}
                                </div>
                                `
                            } else if (mes[i].fields.rtype == "image"){
                                replyy = `
                                <div class="chat__bubble chat__bubble--${personn}" style="opacity:1; background-color:transparent;">
                                    <img src="/media/${mes[i].fields.reply_message}" height="120px" width="100px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${mes[i].fields.reply_message}')">
                                </div>
                                `
                            }
                        }
                        var perr = mes[i].fields.sender
                        if (mes[i].fields.mtype == "message") {
                            mmm = mmm.replace(/"/g, '&quot;').replace(/'/g, '__this_is_single_qoute__').replace(/\\/g, '\\\\')
                            fun = `onclick="showdeletemodal(event, ${mes[i].pk}, '${mmm}', '${get_time(mes[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'message')"`
                            messa = `
                            <li class=" mb-0">
                                <div class="chat__bubble chat__bubble--me">
                                ${replyy}
                                    ${mes[i].fields.message}
                                    <button ${fun} class="chat__bubble chat__bubble--me" style="border-width:0px;color:black;padding:0px;float:right"><i class="bi bi-reply"></i></button>
                                </div>
                            </li>
                            `
                        } else if (mes[i].fields.image){
                            mmm = mes[i].fields.image
                            fun = `onclick="showdeletemodal(event, ${mes[i].pk}, '${mmm}', '${get_time(mes[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'image')"`
                            messa = `
                            <li class=" mb-0">
                                <div class="chat__bubble chat__bubble--me" style="background-color: transparent;">
                                ${replyy}
                                <img src="/media/${mes[i].fields.image}" height="220px" width="200px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${mes[i].fields.image}')">
                                <div style="width:100%; max-width:100%; text-align:right; color:black;"><a ${fun}><i class="bi bi-reply"></i></a></div>
                                </div>
                            </li>
                            `
                        }
                    }
                    mess += messa
                }
            }
            var loadbutton = ""
            if (response.more){
                loadbutton = `
                    <li class=" mb-3" style="width:100%; max-width:100%; text-align:center; justify-content:center; align-items:center;" id="loadmorecontainer">
                        <button onclick="loadmorechat(event, ${chat_id})" class="chat__bubble " style="border:solid; border-width:1px; border-color:#3996fb;" id="loadmorebutton">Load more...</button>
                    </li>
                `
            }
            var aaa = loadbutton + mess
            var bbb = document.getElementById('addmessagehere').innerHTML
            document.getElementById('addmessagehere').innerHTML = aaa
            updateScroll()
            document.getElementById('addmessagehere').innerHTML += bbb
            // document.getElementById('addmessagehere').innerHTML = loadbutton + mess + document.getElementById('addmessagehere').innerHTML
        }
    })
}

check_reply = function(e, chat_id, chat_user, name){
    if (typeof currentes !== 'undefined'){
        currentes.close()
    }
    var es = new EventSource(`/check_reply-${chat_id}/`)
    es.onopen = function(e){
        currentes = es
        removeerroralert(e)
    }
    
    var seenn = ""
    var appr = ""
    var typinn = ""
    es.onmessage = function(e){
        var messages = JSON.parse(e.data)
        if (messages.model == "error"){
            if (typeof currentes !== 'undefined'){
                currentes.close()
            }
        } else if (messages.model == "custom"){
            seenn = messages.seen
            appr = messages.appr
            typinn = messages.typing
        } else {
            if (appr == "no"){
                reloadchat = "yes"
                loadchat(e, name, chat_id)
            } else {
                if (reloadchat == "yes"){
                    reloadchat = "no"
                    loadchat(e, name, chat_id)
                }
                var res = seenn
                var seen = ""
                if (res == 'seen'){
                    seen = `<div id="seennotifier" style="width:100%; max-width:100%; text-align:right;"><i style="color:#8a8a8a">seen</i></div>`
                }
                document.getElementById('addmessagehere').innerHTML = ""
                if (messages.length >= 50){
                    document.getElementById('addmessagehere').innerHTML += `
                        <li class=" mb-3" style="width:100%; max-width:100%; text-align:center; justify-content:center; align-items:center;" id="loadmorecontainer">
                            <button onclick="loadmorechat(event, ${chat_id})" class="chat__bubble " style="border:solid; border-width:1px; border-color:#3996fb;" id="loadmorebutton">Load more...</button>
                        </li>
                    `
                }
                
                var cre = ""
                for(var i = 0; i < messages.length; i++){
                    if (messages[i].fields.created.replace("T", " ").slice(0,10) != cre){
                        document.getElementById('addmessagehere').innerHTML += `<div class="chat__time">${get_date(messages[i].fields.created.replace("T", " ").slice(0,10))}</div>`
                        cre = messages[i].fields.created.replace("T", " ").slice(0,10)
                    }
                    if( messages[i].fields.receiver == usr){
                        var mess = ""
                        var fun = ""
                        if (messages[i].fields.deleted){
                            mess = `
                            <li class=" mb-0">
                                <div class="chat__bubble chat__bubble--you">
                                    <i style="color:#e0e0e0">this message was deleted!</i><br>
                                </div>
                            </li>
                            `
                        } else {
                            replyy = ''
                            if (messages[i].fields.reply_message){
                                var personn = ""
                                
                                if (messages[i].fields.replied == usr){
                                    personn = "me"
                                    perr = usr
                                } else {
                                    personn = "you"
                                    perr = messages[i].fields.sender
                                }
                                if (messages[i].fields.rtype == "message"){
                                    replyy = `
                                    <div class="chat__bubble chat__bubble--${personn}" style="opacity:1">
                                        ${messages[i].fields.reply_message}
                                    </div>
                                    `
                                } else if (messages[i].fields.rtype == "image"){
                                    replyy = `
                                    <div class="chat__bubble chat__bubble--${personn}" style="opacity:1;background-color:transparent;">
                                        <img src="/media/${messages[i].fields.reply_message}" height="120px" width="100px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${messages[i].fields.reply_message}')">
                                    </div>
                                    `
                                }
                            }
                            var perr = messages[i].fields.sender
                            var mmm = messages[i].fields.message
                            mmm = mmm.replace(/"/g, '&quot;').replace(/'/g, '__this_is_single_qoute__').replace(/\\/g, '\\\\')
                            fun = `onclick="reply_message(event, ${messages[i].pk}, '${mmm}', '${get_time(messages[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'message')"`
                            if (messages[i].fields.mtype == "message") {
                                mess = `
                                <li class=" mb-0">
                                    <div class="chat__bubble chat__bubble--you">
                                    ${replyy}
                                        ${messages[i].fields.message}
                                        <button ${fun} class="chat__bubble chat__bubble--you" style="border-width:0px;color:white;padding:0px;float:right;margin-right:0px; margin-left:30px"><i class="bi bi-reply"></i></button>
                                    </div>
                                </li>
                                `
                            } else if (messages[i].fields.image){
                                var perr = messages[i].fields.sender
                                var mmm = messages[i].fields.image
                                fun = `onclick="reply_message(event, ${messages[i].pk}, '${mmm}', '${get_time(messages[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'image')"`
                                mess = `
                                <li class=" mb-0">
                                    <div class="chat__bubble chat__bubble--you" style="background-color:transparent;">
                                    ${replyy}
                                    <img src="/media/${messages[i].fields.image}" height="220px" width="200px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${messages[i].fields.image}')">
                                    <div style="width:100%; max-width:100%; text-align:right; color:black"><a ${fun}><i class="bi bi-reply"></i></a></div>
                                    </div>
                                </li>
                                `
                            }
                        } 
                        document.getElementById('addmessagehere').innerHTML += mess 
    
                    } else {
                        var fun = ""
                        var mess = ""
                        if (messages[i].fields.deleted){
                            mess = `
                            <li class=" mb-0">
                                <div class="chat__bubble chat__bubble--me">
                                    <i style="color:#a8a8a8">this message was deleted!</i><br>
                                    </div>
                            </li>
                            `
                        } else {
                            var mmm = messages[i].fields.message
                            mmm = mmm.replace(/"/g, '&quot;').replace(/'/g, '__this_is_single_qoute__').replace(/\\/g, '\\\\')
                            replyy = ''
                            if (messages[i].fields.reply_message){
                                var personn = ""
                                if (messages[i].fields.replied == usr){
                                    personn = "me"
                                } else {
                                    personn = "you"
                                }
                                if (messages[i].fields.rtype == "message"){
                                    replyy = `
                                    <div class="chat__bubble chat__bubble--${personn}" style="opacity:1">
                                        ${messages[i].fields.reply_message}
                                    </div>
                                    `
                                } else if (messages[i].fields.rtype == "image"){
                                    replyy = `
                                    <div class="chat__bubble chat__bubble--${personn}" style="opacity:1;background-color:transparent;">
                                        <img src="/media/${messages[i].fields.reply_message}" height="120px" width="100px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${messages[i].fields.reply_message}')">
                                    </div>
                                    `
                                }
                            }
                            var perr = messages[i].fields.sender
                            fun = `onclick="showdeletemodal(event, ${messages[i].pk}, '${mmm}', '${get_time(messages[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'message')"`
                            if (messages[i].fields.mtype == "message") {
                                mess = `
                                <li class="mb-0">
                                    <div class="chat__bubble chat__bubble--me">
                                    ${replyy}
                                    ${messages[i].fields.message}
                                    <button ${fun} class="chat__bubble chat__bubble--me" style="border-width:0px;color:black;padding:0px;float:right"><i class="bi bi-reply"></i></button>
                                    </div>
                                </li>
                                `
                            } else if (messages[i].fields.image){
                                mmm = messages[i].fields.image
                                fun = `onclick="showdeletemodal(event, ${messages[i].pk}, '${mmm}', '${get_time(messages[i].fields.created.replace("T", " ").slice(10,16))}', '${perr}', 'image')"`
                                mess = `
                                <li class=" mb-0">
                                    <div class="chat__bubble chat__bubble--me" style="background-color: transparent;">
                                    ${replyy}
                                    <img src="/media/${messages[i].fields.image}" height="220px" width="200px" style="object-fit: cover; border-radius: 10px;" onclick="openviewimagemodal('/media/${messages[i].fields.image}')">
                                    <div style="width:100%; max-width:100%; text-align:right; color:black;"><a ${fun}><i class="bi bi-reply"></i></a></div>
                                    </div>
                                </li>
                                `
                            }
                        }
                        document.getElementById('addmessagehere').innerHTML += mess
                    }
                }
                document.getElementById('addmessagehere').innerHTML += seen
                if (document.getElementById('useristyping')){
                    document.getElementById('useristyping').remove()
                }
                if (typinn == "yes"){
                    document.getElementById('addmessagehere').innerHTML += `
                    <li class=" mb-0" id="useristyping">
                        <div class="chat__bubble chat__bubble--you">
                            <div class="typing">
                                <div class="dot"></div>
                                <div class="dot"></div>
                                <div class="dot"></div>
                            </div>
                        </div>
                    </li>
                    `
                }
                updateScroll()
            }
        }
        updateScroll()
        if (document.getElementById(`userchatli--${chat_user}`)){
            document.getElementById(`userchatli--${chat_user}`).classList.remove("messaging-member--new")
        }
    }

    es.onerror = function(e){
        setTimeout(showerror(e), 3000)
    }
}

$(".chat__previous").click(function () {
    $chat.removeClass("chat--show");
    url = `/current_chat_set-${current_chat}/`
    $.get(url, function(response){
        var qwas = response
    })
    if (typeof currentes !== 'undefined'){
        currentes.close()
        current_chat = 0
        document.getElementById('currentchatuser').value = 0
        rm_reply()
    }
  });


function openviewimagemodal(el){
    document.getElementById('img01').setAttribute('src', el)
    $('#viewimagemodal').modal('toggle')
}


check_new_message = function(){
    if (typeof eevvss !== 'undefined'){
        eevvss.close()
    }
    evs = new EventSource(`/check_new_message/`)
    document.getElementById('adduserchatshere').innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
            </div>
        </div>
        `
        
        document.getElementById('unseenchatsnumber').innerHTML = `
        <div class="spinner-grow text-primary" role="status">
        </div>
    `

    evs.onopen = function(e){
        eevvss = evs
        errshow = true
        errcount = 0
        removeerroralert(e)
    }

    var empty = ''
    evs.onmessage = function(e){
        if (empty == ''){
            document.getElementById('adduserchatshere').innerHTML = ''
            unseenusers = []
            if (e.data == "[]"){
                document.getElementById('adduserchatshere').innerHTML = `
                <section class="page_404">
                                <div class="container">
                                  <div class="row">	
                                  <div class="col-sm-12 ">
                                  <div class="col-sm-10 col-sm-offset-1  text-center"><br><br>
                                  
                                  <div class="contant_box_404">
                                  <h3 class="h2" style="color: #a3a3a3;">
                                  No Chats!
                                  </h3>
                                  
                                  <p style="color: #a3a3a3;">Let's find a user to chat.</p>
                                </div>
                                <a href="" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Search Users</a>
                                  </div>
                                  </div>
                                  </div>
                                </div>
                              </section>
                `
                document.getElementById('searchuserstoggler').setAttribute('style', 'display:none;')
            }
        }
        var data = JSON.parse(e.data)
        for(var i=0; i<data.length; i++){
            if (data[i].model == "error"){
                if (typeof eevvss !== 'undefined'){
                    eevvss.close()
                }
            }
            else if (data[i].model == "home.me"){
                unseenusers.push(data[i].fields.user_id)
                var image
                if (data[i].fields.image){
                    image = `<img src="/media/${data[i].fields.image}" alt="${data[i].fields.first_name}" loading="lazy">`
                } else {
                    image = `<img src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" alt="${data[i].fields.first_name}" loading="lazy">`
                }
                var verified = ""
                if (data[i].fields.verified){
                    verified = `<i style="color:#0d6efd" class="bi bi-patch-check-fill"></i>`
                }
                document.getElementById('adduserchatshere').innerHTML += `
                <li class="messaging-member messaging-member--new" id="userchatli--${data[i].fields.user_id}" onclick="loadchat(event, '${data[i].fields.first_name}', '{{{__your_chat_id_here__}}}')">
                    <div class="messaging-member__wrapper">
                        <div class="messaging-member__avatar">
                            ${image} 
                        </div>
            
                        <span class="messaging-member__name" id="member__name--${data[i].fields.user_id}">${data[i].fields.first_name}&nbsp;${verified}</span>
                        <span class="messaging-member__message" id="member__message--${data[i].fields.user_id}"></span>
                    </div>
                </li>
                `
                var online = ""
                if (data[i].fields.online){
                    online = "online"
                }
                if (document.getElementById('openusertoponline--'+data[i].fields.user_id)){
                    document.getElementById('openusertoponline--'+data[i].fields.user_id).innerText = online
                }
                empty = '1'
            } else if (data[i].model == "home.message"){
                if (data[i].fields.sender == usr){
                    if (data[i].fields.deleted){
                        messa = `<i class="bi bi-trash-fill"></i> this message was deleted!`
                    } else {
                        if (data[i].fields.message){
                            messa = `${data[i].fields.message}`
                        } else if (data[i].fields.image){
                            
                            messa = `<i class="bi bi-image"></i> image`
                        }
                    }
                    document.getElementById('member__message--'+data[i].fields.receiver).innerHTML = `You: ${messa}`
                    if (document.getElementById(`userchatli--${data[i].fields.receiver}`)){
                        document.getElementById(`userchatli--${data[i].fields.receiver}`).classList.remove("messaging-member--new")
                        unseenindex = unseenusers.indexOf(data[i].fields.receiver)
                        if (unseenindex > -1){
                            unseenusers.splice(unseenindex, 1)
                        }
                    }
                } else {
                    var messa = data[i].fields.message
                    if (data[i].fields.deleted){
                        messa = `<i class="bi bi-trash-fill"></i> this message was deleted!`
                    } else {
                        if (data[i].fields.message){
                            messa = `${data[i].fields.message}`
                        } else if (data[i].fields.image){
                            
                            messa = `<i class="bi bi-image"></i> image`
                        }
                    }
                    document.getElementById('member__message--'+data[i].fields.sender).innerHTML = `${messa} &nbsp;<i id="unseenmessagedot--${data[i].fields.sender}" style="color:#0d6efd; float:right" class="bi bi-circle-fill"></i>`
                    if (data[i].fields.status == "seen"){
                        if (document.getElementById(`userchatli--${data[i].fields.sender}`)){
                            document.getElementById(`userchatli--${data[i].fields.sender}`).classList.remove("messaging-member--new")
                            document.getElementById('unseenmessagedot--'+data[i].fields.sender).remove()
                            unseenindex = unseenusers.indexOf(data[i].fields.sender)
                            if (unseenindex > -1){
                                unseenusers.splice(unseenindex, 1)
                            }
                        }
                    }
                }
                empty = '1'
            }
            else if (data[i].model == "home.chat"){
                document.getElementById('searchuserstoggler').setAttribute('style', '')
                var userchatli = ""
                var attr = ""
                var attr1 = ""
                if (data[i].fields.user1 == usr){
                    userchatli = document.getElementById('userchatli--'+data[i].fields.user2)
                    if (!data[i].fields.approved){
                        document.getElementById('member__message--'+data[i].fields.user2).innerHTML = ''
                    }
                    if (data[i].fields.approved){
                        if (data[i].fields.typing2){
                            document.getElementById('member__message--'+data[i].fields.user2).innerHTML = `<strong style="color:#3996fb"><i>typing...</i></strong>`
                        }
                    }
                    if (userchatli){
                        attr = userchatli.getAttribute("onclick")
                        attr1 = attr.replace("{{{__your_chat_id_here__}}}", data[i].pk)
                        userchatli.setAttribute("onclick", attr1)
                    }
                } else if (data[i].fields.user2 == usr){
                    userchatli = document.getElementById('userchatli--'+data[i].fields.user1)
                    if (!data[i].fields.approved){
                        document.getElementById('member__message--'+data[i].fields.user1).innerHTML = ''
                    }
                    if (data[i].fields.approved){
                        if (data[i].fields.typing1){
                            document.getElementById('member__message--'+data[i].fields.user1).innerHTML = `<strong style="color:#3996fb"><i>typing...</i></strong>`
                        }
                    }
                    if (userchatli){
                        attr = userchatli.getAttribute("onclick")
                        attr1 = attr.replace("{{{__your_chat_id_here__}}}", data[i].pk)
                        userchatli.setAttribute("onclick", attr1)
                    }
                }
                empty = ''
            }
        }
        if (empty == ''){
            if (unseenusers.length <= 0){
                unseenusers = []
                document.getElementById('unseenchatsdiv').setAttribute('style', 'display:none;')
                document.getElementById('openunseenchatnumber').setAttribute('style', 'display:none;')
            } else {
                document.getElementById('unseenchatsdiv').setAttribute('style', '')
                document.getElementById('openunseenchatnumber').setAttribute('style', '')
                document.getElementById('openunseenchatnumber').innerHTML = `
                <div class="chat__notification d-flex d-md-none chat__notification--new">
                          <span>${unseenusers.length}</span>
                        </div>
                `
                document.getElementById('unseenchatsnumber').innerText = unseenusers.length
            }
        }
    }

    evs.onerror = function(e){
        setTimeout(showerror(e), 3000)
    }
}


get_date = function(date_var){
    const months = [
        "January", "February", 
        "March", "April", "May", 
        "June", "July", "August",
        "September", "October", 
        "November", "December"
    ];
    var day = date_var.slice(8,10)
    var month = date_var.slice(5,7)
    var year = date_var.slice(0,4)
    mon = months[month-1]
    return `${day} ${mon} ${year}`
}

get_time = function(time_var){
    time_var = time_var.trim()
    var hour = parseInt(time_var.slice(0,2))
    var sec = time_var.slice(3,6)
    var ampm = hour < 12 ? 'AM' : 'PM';
    var ho = hour % 12 || 12
    return (`${ho}:${sec} ${ampm}`)
}

add_user = function(e, id){
    e.preventDefault()
    document.getElementById('adduserbutton').innerHTML = `
    <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
            </div>
        </div>
    `
    url = `/add_user-${id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            document.getElementById('adduserbutton').innerHTML = `
            <span class="user-profile__name"><button class="btn btn-outline-primary" style="border-radius:8px" disabled>Added!</button></span>
            `
        }
    })
    $("#openusermodal").modal('hide')
    $('#exampleModal').modal('hide')
}

open_user = function(e, id){
    e.preventDefault()
    $("#openusermodal").modal('toggle')
    document.getElementById('modaluserhere').innerHTML = `
    <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
            </div>
        </div>
    `
    url = `/open_user-${id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            var added;
            if (response.uu){
                added = ""
            } else {
                if (response.added){
                    added = `<span class="user-profile__name"><button class="btn btn-outline-primary" style="border-radius:8px" disabled>Added!</button></span>`
                } else {
                    added = `<span class="user-profile__name" id="adduserbutton"><button class="btn btn-primary" style="border-radius:8px" onclick="add_user(event, ${id})">Add</button></span>`
                }
            }
            user = JSON.parse(response.user)[0].fields
            var bio = ""
            if (user.bio){
                bio = `<p><strong>Bio: </strong>${user.bio}</p>`
            }
            var image
            if (user.image){
                image = `<img src="/media/${user.image}" alt="${user.first_name}" loading="lazy">`
            } else {
                image = `<img src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" alt="${user.first_name}" loading="lazy">`
            }
            var verified = ""
            if (user.verified){
                verified = `<i style="color:#0d6efd" class="bi bi-patch-check-fill"></i>`
            }
            document.getElementById('modaluserhere').innerHTML = `
            <div class="user-profile__avatar">
              ${image}
            </div>
            <div class="user-profile__details mt-1">
              <span class="user-profile__name">${user.first_name}&nbsp;${verified}</span>
              <span class="user-profile__phone">${user.email}</span>
              <span class="user-profile__location">${user.location}</span><br>
              ${added}
            </div>
            <div class="user-profile__description">
              ${bio}
            </div>           
            `
        }
    })
}


document.getElementById('searchusersinput').onkeyup =  function(e){
    var sea = e.target.value.trim()
    document.getElementById('searchuserscontainer').innerHTML = `
    <div class="d-flex justify-content-center">
    <div class="spinner-border text-primary" role="status">
    </div>
</div>
        `
    if (sea.length > 0){
        var searchurl = `/search_users-${sea}/`
        $.get(searchurl, function(response){
            if (response.status == "success"){
                document.getElementById('searchuserscontainer').innerHTML = ''
                var users = JSON.parse(response.users)
                if (users.length > 0){
                    for (var i=0; i<users.length; i++){
                        var image
                        if (users[i].fields.image){
                            image = `<img src="/media/${users[i].fields.image}" style="object-fit: cover;" alt="${users[i].fields.first_name}" loading="lazy">`
                        } else {
                            image = `<img src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" alt="${users[i].fields.first_name}" loading="lazy">`
                        }
                        var verified = ""
                        if (users[i].fields.verified){
                            verified = `<i style="color:#0d6efd" class="bi bi-patch-check-fill"></i>`
                        }
                        document.getElementById('searchuserscontainer').innerHTML += `
                        <li class="messaging-member" onclick="open_user(event, ${users[i].fields.user_id})">
                            <div class="messaging-member__wrapper">
                            <div class="messaging-member__avatar">
                                ${image}
                            </div>
                
                            <span class="messaging-member__name">${users[i].fields.first_name}&nbsp;${verified}</span>
                            <span class="messaging-member__message">${users[i].fields.bio}</span>
                            </div>
                        </li>`
                    }
                } else {
                    document.getElementById('searchuserscontainer').innerHTML = `
                    <section class="page_404">
                                <div class="row">	
                                <div class="col-sm-12 ">
                                <div class="col-sm-10 col-sm-offset-1  text-center"><br><br><br><br>
                                
                                <div class="contant_box_404">
                                <h3 class="h2" style="color: #a3a3a3;">
                                No user found!
                                </h3>
                                
                                <p style="color: #a3a3a3;">the page you are looking for not avaible!</p>
                              </div>
                                </div>
                                </div>
                              </div>
                            </section>
                    `
                }
            }
        }) 
    } else {
        document.getElementById('searchuserscontainer').innerHTML = `
        <section class="page_404">
        <div class="row">	
        <div class="col-sm-12 ">
        <div class="col-sm-10 col-sm-offset-1  text-center"><br><br><br><br>
        
        <div class="contant_box_404">
        <h3 class="h2" style="color: #a3a3a3;">
        Type in to search a user.
        </h3>
        
        <p style="color: #a3a3a3;">the page you are looking for not avaible!</p>
      </div>
        </div>
        </div>
      </div>
    </section>
        `
    }
}

document.getElementById('imagepreviewinput').addEventListener('change', function(){
    var img = document.getElementById('imagepreviewinput').files[0]
      var url = URL.createObjectURL(img)
    document.getElementById('imagepreview').innerHTML = `<img src="${url}">`
})

function showerror(e){
    e.preventDefault()
    document.getElementById('error_notify').innerHTML = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert" style="cursor: pointer;" id="anerroralert" onclick="closeerroralert(event)">
        <strong class="pt-7">Something went wrong! Try refreshing the page.</strong>
    </div>
    `
}

function removeerroralert(e){
    e.preventDefault()
    if (document.getElementById('error_notify').innerHTML != ''){
        document.getElementById('error_notify').innerHTML = ''
    }
}


closealert = function(e){
    e.preventDefault()
    $('#analert').alert('close')
}

closeerroralert = function(e){
    e.preventDefault()
    $('#anerroralert').alert('close')
    document.getElementById('error_notify').innerHTML = ''
}

function is_online(){
    urr = `/is_online/`
    $.get(urr, function(response){
        var xcvb
    })
}

function cameonline(){
    urr = `/user_came_online/`
    $.get(urr, function(response){
        if (response.status == "success"){
            o = 1
        }
    })
    
    if (typeof eevvss == 'undefined'){
        check_new_message()
    }
    if (typeof currentes == 'undefined'){
        if (typeof chaa !== 'undefined'){
            check_reply(ee, chaa, ussrr, naa)
        }
    }
    onn = setInterval(is_online, 60000)
}

function wentoffline(){
    urrr = `/user_went_offline/`
    $.get(urrr, function(response){
        o = 0
    })
    if (typeof eevvss !== 'undefined'){
        eevvss.close()
        eevvss = undefined
    }
    if (typeof currentes !== 'undefined'){
        currentes.close()
        currentes = undefined
    }
    clearInterval(onn)
}

cameonline()
// check_new_message()


// Set the name of the hidden property and the change event for visibility
var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
  hidden = "hidden";
  visibilityChange = "visibilitychange";
} else if (typeof document.msHidden !== "undefined") {
  hidden = "msHidden";
  visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
  if (document[hidden]) {
    wentoffline()
    if (current_chat !== 0){
        nottypingg(current_chat)
    }

  } else {
    cameonline()
    if (current_chat !== 0){
        nottypingg(current_chat)
    }
  }
}

// Warn if the browser doesn't support addEventListener or the Page Visibility API
if (typeof document.addEventListener === "undefined" || hidden === undefined) {
    window.addEventListener('beforeunload', function (e) {
        wentoffline()
        if (current_chat !== 0){
            nottypingg(current_chat)
        }
    });
    
    window.onfocus = function() {
        cameonline()
        if (current_chat !== 0){
            nottypingg(current_chat)
        }
    };
    
    window.onblur = function() {
        wentoffline()
        if (current_chat !== 0){
            nottypingg(current_chat)
        }
    };
  
} else {
  // Handle page visibility change
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}


// function hasNetwork(online) {
//     const element = document.querySelector(".status");
//     // Update the DOM to reflect the current status
//     if (online) {
//         cameonline()
//         if (current_chat !== 0){
//             nottypingg(current_chat)
//         }
//     } else {
//         wentoffline()
//         if (current_chat !== 0){
//             nottypingg(current_chat)
//         }
//     }
//   }


// window.addEventListener("load", () => {
//   hasNetwork(navigator.onLine);

//   window.addEventListener("online", () => {
//     hasNetwork(true);
//   });

//   window.addEventListener("offline", () => {
//     hasNetwork(false);
//   });
// });


showdeletemodal = function(e, id, message, time, who, mtype){
    e.preventDefault()
    $('#deletemessagemodal').modal('toggle')
    document.getElementById('deletemessagetext').innerHTML = "Delete this message?"
    document.getElementById('replymessagetext').innerHTML = "Reply to this message"
    var repliedd = ""
    if (parseInt(who) == usr){
        repliedd = "me"
    } else {
        repliedd = "you"
    }
    if (mtype == "message"){
        document.getElementById('messagetext').innerHTML = `
        <ul class="chat__list-messages" style="text-align:center">
            <li class=" mb-0" style="cursor:pointer;">
                <div class="chat__bubble chat__bubble--${repliedd}">
                    ${message.replace(/__this_is_single_qoute__/g, '\'')}
                    <div style="width:100%; max-width:100%; text-align:right;"><i style="font-size:0.6rem">${time}</i></div>
                </div>
            </li>
        </ul>
        `
        message = message.replace(/\\/g, '\\\\')
    } else if (mtype == "image"){
        document.getElementById('messagetext').innerHTML = `
        <ul class="chat__list-messages" style="text-align:center">
            <li class=" mb-0" style="cursor:pointer;">
                <div class="chat__bubble chat__bubble--${repliedd}" style="background-color:transparent;">
                <img src="/media/${message}" height="120px" width="100px" style="object-fit: cover; border-radius: 6px;">
                <div style="width:100%; max-width:100%; text-align:right; color:black"><i style="font-size:0.6rem">${time}</i></div>
                </div>
            </li>
        </ul>
        `
    }
    document.getElementById('deletemessagebutton').setAttribute('onclick', `delete_message(event, ${id})`)
    document.getElementById('replymessagebutton').setAttribute('onclick', `reply_message(event, ${id}, '${message}', '${time}', '${who}', '${mtype}')`)
}


// showreplymodal = function(e, id, message, time, who, mtype){
//     e.preventDefault()
//     $('#replymessagemodal').modal('toggle')
//     document.getElementById('replymodallmessagetext').innerHTML = "Reply to this message"
//     var repliedd = ""
//     if (parseInt(who) == usr){
//         repliedd = "me"
//     } else {
//         repliedd = "you"
//     }
//     if (mtype == "message"){
//         document.getElementById('replymodalmessagetext').innerHTML = `
//         <ul class="chat__list-messages" style="text-align:center">
//             <li class=" mb-0" style="cursor:pointer;">
//                 <div class="chat__bubble chat__bubble--${repliedd}">
//                     ${message.replace(/__this_is_single_qoute__/g, '\'')}
//                     <div style="width:100%; max-width:100%; text-align:right;"><i style="font-size:0.6rem">${time}</i></div>
//                 </div>
//             </li>
//         </ul>
//         `
//         message = message.replace(/\\/g, '\\\\')
//     } else if (mtype == "image"){
//         document.getElementById('replymodalmessagetext').innerHTML = `
//         <ul class="chat__list-messages" style="text-align:center">
//             <li class=" mb-0" style="cursor:pointer;">
//                 <div class="chat__bubble chat__bubble--${repliedd}" style="background-color:transparent;">
//                 <img src="/media/${message}" height="120px" width="100px" style="object-fit: cover; border-radius: 6px;">
//                 <div style="width:100%; max-width:100%; text-align:right; color:black"><i style="font-size:0.6rem">${time}</i></div>
//                 </div>
//             </li>
//         </ul>
//         `
//     }
//     document.getElementById('replymodalmessagebutton').setAttribute('onclick', `reply_message(event, ${id}, '${message}', '${time}', '${who}', '${mtype}')`)
// }


delete_message = function(e, id){
    url = `/delete_message-${id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            $('#deletemessagemodal').modal('toggle')
        }
    })
}

concatinate_string = function(stri){
    if (stri.length >= 200){
        return stri.substring(0, 200) + "..."
    } else {
        return stri
    }
}


function reply_message(e, id, message, time, who, mtype){
    e.preventDefault()
    document.getElementById('replymessageid').value = id
    document.getElementById('replymessagemessage').value = message.replace(/__this_is_single_qoute__/g, '\'')
    document.getElementById('replymessagerepliedd').value = who
    document.getElementById('replymessagetype').value = mtype
    var repliedd = ""
    if (parseInt(who) == usr){
        repliedd = "me"
    } else {
        repliedd = "you"
    }
    if (mtype == "message"){
        document.getElementById('replymessagebox').innerHTML = `
        <ul class="chat__list-messages" style="margin-bottom:0px; width: 100%; max-width: 100%; text-align: right;">
            <li class=" mb-0" style="cursor:pointer;">
                <div class="chat__bubble chat__bubble--${repliedd}" style="width:100%;max-width:100%;text-align:left;">
                <div style="float:right"><i class="bi bi-x-lg"></i></div>
                    ${concatinate_string(message.replace(/__this_is_single_qoute__/g, '\''))}
                    <div style="width:100%; max-width:100%; text-align:right;"><i style="font-size:0.6rem">${time}</i></div>
                </div>
            </li> 
        </ul>  
        `
    } else if (mtype == "image"){
        document.getElementById('replymessagebox').innerHTML = `
        <ul class="chat__list-messages" style="margin-bottom:0px; width: 100%; max-width: 100%; text-align: right;">
            <li class=" mb-0" style="cursor:pointer;">
                <div class="chat__bubble chat__bubble--${repliedd}" style="width:100%;max-width:100%;text-align:left;" style="background-color:transparent;">
                <div style="float:right"><i class="bi bi-x-lg"></i></div>
                <img src="/media/${message}" height="120px" width="100px" style="object-fit: cover; border-radius: 6px;">
                <div style="width:100%; max-width:100%; text-align:right; color:black"><i style="font-size:0.6rem">${time}</i></div>
                </div>
            </li> 
        </ul>  
        `
    }
    $('#deletemessagemodal').modal('hide')
    $('#replymessagemodal').modal('hide')
    document.getElementById('message').focus()
}

function remove_reply(e){
    e.preventDefault()
    document.getElementById('replymessagebox').innerHTML = ''
    document.getElementById('replymessageid').value = ''
    document.getElementById('replymessagemessage').value = ''
    document.getElementById('replymessagerepliedd').value = ''
    document.getElementById('replymessagetype').value = ''
}

function rm_reply(){
    document.getElementById('replymessagebox').innerHTML = ''
    document.getElementById('replymessageid').value = ''
    document.getElementById('replymessagemessage').value = ''
    document.getElementById('replymessagerepliedd').value = ''
    document.getElementById('replymessagetype').value = ''
}


// touchedfun = function(event, id, message, time, who, mtype) {
//     var currentTime = new Date().getTime();
//     var tapLength = currentTime - lastTap;
//     clearTimeout(timeout);
//     if (tapLength < 500 && tapLength > 0) {
//         showdeletemodal(event, id, message, time, who, mtype)
//         event.preventDefault();
//     } else {
//         timeout = setTimeout(function() {
//             clearTimeout(timeout);
//         }, 500);
//     }
//     lastTap = currentTime;
// }

// replytouchedfun = function(event, id, message, time, who, mtype) {
//     var currentTime = new Date().getTime();
//     var tapLength = currentTime - lastTap;
//     clearTimeout(timeout);
//     if (tapLength < 500 && tapLength > 0) {
//         showreplymodal(event, id, message, time, who, mtype)
//         event.preventDefault();
//     } else {
//         timeout = setTimeout(function() {
//             clearTimeout(timeout);
//         }, 500);
//     }
//     lastTap = currentTime;
// }


document.getElementById('searchchatsinput').onkeyup = function(e){
    var search = document.getElementById('searchchatsinput').value
    document.getElementById('addsearchuserchatshere').innerHTML = ``
    search = search.trim()
    if (search.length > 0){
        url = `/search_user_chats-${search}/`
        $.get(url, function(response){
            ct = JSON.parse(response.chats)
            ids = JSON.parse(response.ids)
            document.getElementById('addsearchuserchatshere').innerHTML = '<br>'
            for (var i=0; i<ct.length; i++){
                chat = ct[i].fields
                var image
                if (chat.image){
                    image = `<img src="/media/${chat.image}" alt="${chat.first_name}" loading="lazy">`
                } else {
                    image = `<img src="https://cdn0.iconfinder.com/data/icons/set-ui-app-android/32/8-512.png" alt="${chat.first_name}" loading="lazy">`
                }
                var verified = ""
                if (chat.verified){
                    verified = `<i style="color:#0d6efd" class="bi bi-patch-check-fill"></i>`
                }
                document.getElementById('addsearchuserchatshere').innerHTML += `
                <li class="messaging-member messaging-member--new" onclick="loadchat(event, '${chat.first_name}', '${ids[i]}')">
                    <div class="messaging-member__wrapper">
                    <div class="messaging-member__avatar">
                        ${image}
                    </div>
        
                    <span class="messaging-member__name">${chat.first_name}&nbsp;${verified}</span>
                    </div>
                </li>
                `
            }
        })
    } else {
        document.getElementById('addsearchuserchatshere').innerHTML = ''
    }
}



// var stream;
// var localVideo = document.getElementById('local-video')
// var remoteVideo = document.getElementById('remote-video')
// var yourConn

// function videocall(){
//     navigator.webkitGetUserMedia({ video: true, audio: true }, function (myStream) { 
//         stream = myStream; 
           
//         //displaying local video stream on the page 
//         localVideo.srcObject = stream;
        
           
//         //using Google public stun server 
//         var configuration = { 
//            "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
//         }; 
           
//         yourConn = new webkitRTCPeerConnection(configuration); 
//         // setup stream listening 
//         yourConn.addStream(stream); 
            
//         //when a remote user adds stream to the peer connection, we display it 
//         yourConn.onaddstream = function (e) { 
//            remoteVideo.srcObject = e.stream; 
//         };
           
//         // Setup ice handling 
//         yourConn.onicecandidate = function (event) { 
//            if (event.candidate) { 
              
//            } 
//         }
//     }, function (error) { 
//         console.log(error); 
//      })
// }


// function videocallmodal(e, id, urid){
//     videocall()
//     $('#videocallmodal').modal('toggle')
    
//     // create an offer 
//     yourConn.createOffer(function (offer) { 
//         url = `/start_vc-${id}/`
//         $.ajax({
//             'type':'POST',
//             'url':url,
//             'data':JSON.stringify(offer),
//             'success':function(response){
//                 console.log(response.offer)
//             },
//             'error':function(error){
//                 console.log(error)
//             }})
        
//         yourConn.setLocalDescription(offer); 

//     }, function (error) { 
//         alert("Error when creating an offer"); 
//     });
    
// }

// function incomming_vc(e, offer){
//     $('#acceptvideocallmodal').modal('toggle')
//     document.getElementById('acceptvcbutton').setAttribute('onclick', `answer_vc(${e}, ${offer})`)
// }
      

// function answer_vc(e, offer){
//     videocall()
//     yourConn.setRemoteDescription(new RTCSessionDescription(offer));
	
//    //create an answer to an offer 
//    yourConn.createAnswer(function (answer) { 
//       yourConn.setLocalDescription(answer); 
		
//       url = `/accept_vc-${id}/`
//       $.ajax({
//           'type':'POST',
//           'url':url,
//           'data':JSON.stringify(offer),
//           'success':function(response){
//               console.log(response.answer)
//           },
//           'error':function(error){
//               console.log(error)
//           }})
		
//    }, function (error) { 
//       alert("Error when creating an answer"); 
//    }); 

// }


// function handleAnswer(answer){
//     yourConn.setRemoteDescription(new RTCSessionDescription(answer));
// }

// //when we got an ice candidate from a remote user 
// function handleCandidate(candidate) { 
//     yourConn.addIceCandidate(new RTCIceCandidate(candidate)); 
//  };
    
//  //hang up 
// function cutcall(){
//     handleLeave()
// }
   
//  function handleLeave() { 
//     remoteVideo.src = null; 
     
//     yourConn.close(); 
//     yourConn.onicecandidate = null; 
//     yourConn.onaddstream = null; 
//  };
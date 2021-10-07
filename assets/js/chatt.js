usr = parseInt(document.currentScript.getAttribute('user'))

loadchat = function(e, chat_id, name){
    document.getElementById('addmessagehere').innerHTML = ""
    id = parseInt(chat_id)
    url = `/get_messages-${id}/`
    $.get(url, function(response){
        if (response.status == "success"){
            document.getElementById('chatuserimage').innerHTML = `
            <img src="https://randomuser.me/api/portraits/thumb/men/74.jpg" alt="${name}" loading="lazy">
            <div class="user-status user-status--large"></div>
            `
            document.getElementById('chatusername').innerHTML = `
            <span class="chat-member__name">${name}</span>
            <span class="chat-member__status">Online</span>
            `
            document.getElementById('chatinputbox').innerHTML = `
            <div class="custom-form__send-wrapper">
              <input type="text" class="form-control custom-form" id="message" onkeypress="enterkey(event);" onclick="updateScroll()" placeholder="Type a message …" autocomplete="off">
              <input type="hidden" id="currentchatuser">
              <input type="hidden" id="currentchatid">
              <div class="custom-form__send-img">
                <svg xmlns="http://www.w3.org/2000/svg" class="svg-icon svg-icon--send-img" viewBox="0 0 45.7 45.7">
                  <path d="M6.6,45.7A6.7,6.7,0,0,1,0,39.1V6.6A6.7,6.7,0,0,1,6.6,0H39.1a6.7,6.7,0,0,1,6.6,6.6V39.1h0a6.7,6.7,0,0,1-6.6,6.6ZM39,4H6.6A2.6,2.6,0,0,0,4,6.6V39.1a2.6,2.6,0,0,0,2.6,2.6H39.1a2.6,2.6,0,0,0,2.6-2.6V6.6A2.7,2.7,0,0,0,39,4Zm4.7,35.1Zm-4.6-.4H6.6a2.1,2.1,0,0,1-1.8-1.1,2,2,0,0,1,.3-2.1l8.1-10.4a1.8,1.8,0,0,1,1.5-.8,2.4,2.4,0,0,1,1.6.7l4.2,5.1,6.6-8.5a1.8,1.8,0,0,1,1.6-.8,1.8,1.8,0,0,1,1.5.8L40.7,35.5a2,2,0,0,1,.1,2.1A1.8,1.8,0,0,1,39.1,38.7Zm-17.2-4H35.1l-6.5-8.6-6.5,8.4C22,34.6,22,34.7,21.9,34.7Zm-11.2,0H19l-4.2-5.1Z" fill="#f68b3c" />
                </svg>
              </div>
              <div class="custom-form__send-emoji">
                <svg xmlns="http://www.w3.org/2000/svg" class="svg-icon svg-icon--send-emoji" viewBox="0 0 46.2 46.2">
                  <path d="M23.1,0A23.1,23.1,0,1,0,46.2,23.1,23.1,23.1,0,0,0,23.1,0Zm0,41.6A18.5,18.5,0,1,1,41.6,23.1,18.5,18.5,0,0,1,23.1,41.6Zm8.1-20.8a3.5,3.5,0,0,0,3.5-3.5,3.5,3.5,0,0,0-7,0,3.5,3.5,0,0,0,3.5,3.5ZM15,20.8a3.5,3.5,0,0,0,3.5-3.5A3.5,3.5,0,0,0,15,13.9a3.4,3.4,0,0,0-3.4,3.4A3.5,3.5,0,0,0,15,20.8Zm8.1,15a12.6,12.6,0,0,0,10.5-5.5,1.7,1.7,0,0,0-1.3-2.6H14a1.7,1.7,0,0,0-1.4,2.6A12.9,12.9,0,0,0,23.1,35.8Z" fill="#f68b3c" />
                </svg>
              </div>
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
            
            updateScroll()
            check_reply(chat_id)
        }
    })
}


submitbutton = function(e){
    e.preventDefault()
    url = `/send_message/`
    var message = document.getElementById('message').value;
    var sender = usr
    var receiver = document.getElementById('currentchatuser').value;
    var chat_id = document.getElementById('currentchatid').value;
    data = {chat_id:chat_id, message:message, sender:sender, receiver:receiver}
    document.getElementById('message').focus()
    $.ajax({
        'type':'POST',
        'url':url,
        'data':JSON.stringify(data),
        'success':function(response){
            if (response.status == "success"){
                document.getElementById('addmessagehere').innerHTML += `
                    <li class=" mb-0">
                        <div class="chat__bubble chat__bubble--me">
                            ${response.message}<br>
                            <div style="width:100%; max-width:100%; text-align:right;"><i style="font-size:0.6rem">${get_time(response.created.replace("T", " ").slice(10,16))}</i>&nbsp;<i style="font-size:0.6rem" class="bi bi-clock"></i></div>
                        </div>
                    </li>
                `
                document.getElementById('message').value = ""
                updateScroll();
            } else {
                console.log(response)
            }
        },
        'error':function(error){
            console.log(error)
        },
        'dataType' : 'json',
        'contentType': 'application/json; charset=UTF-8',
    })
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

function loadmorechat(e, id){
    e.preventDefault()
    document.getElementById('loadmorebutton').innerText = "Loading..."
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
                    mess += `
                        <li class=" mb-0">
                            <div class="chat__bubble chat__bubble--you">
                                ${mes[i].fields.message}
                                <div style="width:100%; max-width:100%; text-align:left;"><i style="font-size:0.6rem">${get_time(mes[i].fields.created.replace("T", " ").slice(10,16))}</i></div>
                            </div>
                        </li>
                    `
                } else {
                    mess += `
                        <li class=" mb-0">
                            <div class="chat__bubble chat__bubble--me">
                                ${mes[i].fields.message}
                                <div style="width:100%; max-width:100%; text-align:right;"><i style="font-size:0.6rem">${get_time(mes[i].fields.created.replace("T", " ").slice(10,16))}</i>&nbsp;<i style="font-size:0.8rem" class="bi bi-check2-all"></i></div>
                            </div>
                        </li>
                    `
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
            document.getElementById('addmessagehere').innerHTML = loadbutton + mess + document.getElementById('addmessagehere').innerHTML
        }
    })
}


check_reply = function(chat_id){
    var es = new EventSource(`/check_reply-${chat_id}/`)
    es.onopen = function(){
        console.log("connection opened")
    }

    es.onmessage = function(e){
        var messages = JSON.parse(e.data)
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
                document.getElementById('addmessagehere').innerHTML += `
                    <li class=" mb-0">
                        <div class="chat__bubble chat__bubble--you">
                            ${messages[i].fields.message}<br>
                            <div style="width:100%; max-width:100%; text-align:right;"><i style="font-size:0.6rem">${get_time(messages[i].fields.created.replace("T", " ").slice(10,16))}</i></div>
                        </div>
                    </li>
                `
            } else {
                document.getElementById('addmessagehere').innerHTML += `
                    <li class=" mb-0">
                        <div class="chat__bubble chat__bubble--me">
                            ${messages[i].fields.message}<br>
                            <div style="width:100%; max-width:100%; text-align:right;"><i style="font-size:0.6rem">${get_time(messages[i].fields.created.replace("T", " ").slice(10,16))}</i>&nbsp;<i style="font-size:0.8rem; color:blue;" class="bi bi-check2-all"></i></div>
                        </div>
                    </li>
                `
            }
        }
        updateScroll()
    }

    es.onerror = function(e){
        console.log(e)
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

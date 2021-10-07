$(document).ready(function(){
    $('button.mode-switch').click(function(){
      $('body').toggleClass('dark');
      $('#mute').toggleClass('colorchange');
      $('#off-camera').toggleClass('colorchange');
    });
    
    $(".btn-close-right").click(function () {
      $(".right-side").removeClass("show");
      $(".expand-btn").addClass("show");
    });
    
    $(".expand-btn").click(function () {
      $(".right-side").addClass("show");
      $(this).removeClass("show");
    });
  });




  function hasUserMedia() { 
    //check if the browser supports the WebRTC 
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || 
       navigator.mozGetUserMedia); 
 } 
 
 if (hasUserMedia()) { 
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
       || navigator.mozGetUserMedia; 
         
    //enabling video and audio channels 
    navigator.getUserMedia({ video: true, audio: true }, function (stream) { 
       var video = document.getElementById('my-video'); 
         
       //inserting our stream to the video tag     
       video.srcObject = stream; 
       var videoOn = true
       var audioOn = true


       document.getElementById('mute').addEventListener("click", function(){
            stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            if (audioOn){
                document.getElementById('mute').innerHTML = `<i class="bi bi-mic-mute"></i>`
                audioOn = !audioOn
            } else {
                document.getElementById('mute').innerHTML = `<i class="bi bi-mic"></i>`
                audioOn = !audioOn
            }
        });
        
        document.getElementById('off-camera').addEventListener("click", function(){ 
            if (videoOn){
                document.getElementById('off-camera').innerHTML = `<i class="bi bi-camera-video-off"></i>`
                videoOn = !videoOn
            } else {
                document.getElementById('off-camera').innerHTML = `<i class="bi bi-camera-video"></i>`
                videoOn = !videoOn
            }
            stream.getVideoTracks().forEach(track => track.enabled = !track.enabled); 
        });


    }, function (err) {}); 
 } else { 
    alert("WebRTC is not supported"); 
 }


 
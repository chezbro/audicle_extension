var audio_context;
var recorder;
var BUFF_SIZE = 512;
var microphone_data = {};

try {

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audio_context = new AudioContext();
  console.log("cool audio context established");

} catch (e) {
  alert('Web Audio API is not supported by this browser and/or its current config\n');
}

function process_microphone_buffer(event) {

    var microphone_buffer = event.inputBuffer.getChannelData(0);

    console.log('microphone_buffer.length ', microphone_buffer.length);
}


function on_error(e) {
    console.log(e);
}

function start_microphone() {

    microphone_data.microphone_stream = audio_context.createMediaStreamSource(microphone_data.media_stream);

    microphone_data.script_processor_node = audio_context.createScriptProcessor(BUFF_SIZE, 1, 1);

    microphone_data.script_processor_node.onaudioprocess = process_microphone_buffer;

    microphone_data.microphone_stream.connect(microphone_data.script_processor_node);
    microphone_data.microphone_stream.connect(audio_context.destination);

    recorder = new Recorder(microphone_data.microphone_stream);

    console.log('OK microphone stream connected');
}

function record_microphone() {

    if (! navigator.getUserMedia) {

        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }

    navigator.getUserMedia(

        {audio: true},

        function(stream) {
            microphone_data.media_stream = stream;
            start_microphone();
            recorder && recorder.record();
        },

        on_error
    );
}

function stop_microphone() {

    microphone_data.microphone_stream.disconnect();
    microphone_data.script_processor_node.disconnect();
    recorder && recorder.stop();
    microphone_data.media_stream.stop();
    microphone_data.script_processor_node.onaudioprocess = null;
    createDownloadLink();
    recorder.clear();
    console.log('... microphone now stopped')    ;
}

function createDownloadLink() {
  recorder && recorder.exportWAV(function(blob) {
    /*var url = URL.createObjectURL(blob);
    var li = document.createElement('li');
    var au = document.createElement('audio');
    var hf = document.createElement('a');

    au.controls = true;
    au.src = url;
    hf.href = url;
    hf.download = new Date().toISOString() + '.wav';
    hf.innerHTML = hf.download;
    li.appendChild(au);
    li.appendChild(hf);
    recordingslist.appendChild(li);*/
  });
}

function post_to_audicle() {
  var audio_data = $('.audio_file').attr('src')
  alert(audio_data)
  var fd = new FormData();
  fd.append('fname', "Trial Audio Data");
  fd.append('data', audio_data);
  $.ajax({
    type: 'POST',
    url: "http://localhost:3000/clips",
    // url: 'https://peaceful-fjord-8585.herokuapp.com/clips',
    data: fd,
    datatype:'json',
    crossDomain: true,
    processData: false,
    contentType: false,
    success: function(ts) {
      alert("Audio Recording Saved");
    },
    error: function(ts){
      alert("Error post " + ts.responseText);
    }
  }).done(function(data) {
    //console.log(data);
    alert("It Worked")
    log.innerHTML += "\n" + data;
  });
}

$(function() {
  $('#start_button').click(function(){
    record_microphone(this);
  });
  $('#stop_button').click(function(){
    stop_microphone(this);
  });
  $('#post_clip').click(function(){
    post_to_audicle();
  });
});

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
    var start_button = $('#start_button')
    var stop_button = $('#stop_button')
    start_button.hide();
    stop_button.hide();
    if ($("#record_header").length > 0){
        document.getElementById("record_header").innerHTML = '<button class="btn btn-white flip"><a href="mic.html" target="_blank">Turn On Audio Permissions</a></button>'
    }
    if ($("#get_permissions").length > 0){
        document.getElementById("permissions_screenshot").setAttribute("src","https://s3-us-west-2.amazonaws.com/new-audicle/no_audio_permissions.png")
    }
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

function get_audio_permission() {

    if (! navigator.getUserMedia) {

        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    }

    navigator.getUserMedia(

        {audio: true},

        function(stream) {
            microphone_data.media_stream = stream;
        },

        on_error
    );
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

$(function() {
  $('#start_button').click(function(){
    record_microphone(this);
  });
  $('#stop_button').click(function(){
    stop_microphone(this);
  });
  $('#get_permissions').click(function(){
    get_audio_permission(this);
  });
});

function __log(e, data) {
  log.innerHTML += "\n" + e + " " + (data || '');
}

var audio_context;
var recorder;
var mediaStream;

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  mediaStream = stream
  __log('Media stream created.' );
__log("input sample rate " +input.context.sampleRate);

  input.connect(audio_context.destination);
  __log('Input connected to audio context destination.');

  recorder = new Recorder(input);
  __log('Recorder initialised.');
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = ( navigator.getUserMedia ||
                     navigator.webkitGetUserMedia ||
                     navigator.mozGetUserMedia ||
                     navigator.msGetUserMedia);
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext;
    __log('Audio context set up.');
    __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
  }
  // catch (e) {
  //   alert('No web audio support in this browser!');
  }

  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    __log('No live audio input: ' + e);
  });
};

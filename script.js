window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var analyser = context.createAnalyser();
var buffer, source, destination;

var loadSoundFile = function(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    context.decodeAudioData(this.response,
    function(decodedArrayBuffer) {
      buffer = decodedArrayBuffer;
      play();
    }, function(e) {
      console.log('Error decoding file', e);
    });
  };
  xhr.send();
}

var play = function() {
  source = context.createBufferSource();
  source.buffer = buffer;
  destination = context.destination;
  source.connect(destination);
  source.start(0);
}

var stop = function(){
  source.stop(0);
}

loadSoundFile('selfie.mp3');

// analyser.fftSize = 2048;
//
// fFrequencyData = new Float32Array(analyser.frequencyBinCount);
// bFrequencyData = new Uint8Array(analyser.frequencyBinCount);
// bTimeData = new Uint8Array(analyser.frequencyBinCount);
//
// var render = function() {
//   analyser.getFloatFrequencyData(fFrequencyData);
//   analyser.getByteFrequencyData(bFrequencyData);
//   analyser.getByteTimeDomainData(bTimeData);
//   console.log(fFrequencyData);
//   console.log(bFrequencyData);
//   console.log(bTimeData);
// }

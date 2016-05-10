window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var analyser = context.createAnalyser();
var checkboxMatrixSize = {
  cols: 0,
  rows: 0
}
var buffer, source, destination;

var loadSoundFile = function(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    context.decodeAudioData(this.response,
    function(decodedArrayBuffer) {
      buffer = decodedArrayBuffer;
      window.buttonPlayClick();
    }, function(e) {
      console.log('Error decoding file', e);
    });
  };
  xhr.send();
}

window.buttonPlayClick = function() {
  source = context.createBufferSource();
  source.buffer = buffer;
  destination = context.destination;
  source.connect(analyser);
  analyser.connect(destination);
  source.start(0);
  window.render();
}

window.buttonStopClick = function(){
  source.stop(0);
}

window.renderCheckboxes = function() {
  var bodyHeight = document.body.offsetHeight;
  var bodyWidth = document.body.offsetWidth;

  checkboxMatrixSize.cols = (bodyWidth / 12).toFixed();
  checkboxMatrixSize.rows = (bodyHeight / 12).toFixed();

  var matrix = document.createElement('div');
  for(var i = 0; i < checkboxMatrixSize.cols; i++) {
    var col = document.createElement('div');
    for(var j = 0; j < checkboxMatrixSize.rows; j++) {
      var checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('id', 'c-' + i + '-' + j);
      col.appendChild(checkbox);
    }
    matrix.appendChild(col);
  }

  document.getElementById('main').appendChild(matrix);
}

window.renderCheckboxes();
loadSoundFile('selfie.mp3');

analyser.fftSize = 256;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

window.render = function() {
  requestAnimationFrame(window.render)

  var inputList = document.getElementsByTagName('input');
  for(var k = 0; k < inputList.length; k++) {
    inputList[k].checked = false;
  }

  analyser.getByteFrequencyData(dataArray);

  for(var i = 0; i < checkboxMatrixSize.cols; i ++) {

    var barValue = parseInt(((dataArray[i] / 255) * checkboxMatrixSize.rows).toFixed());
    var barDiff = checkboxMatrixSize.rows - barValue;

    for(var j = 0; j < checkboxMatrixSize.rows; j++) {
      if (j > barDiff ) {
        document.getElementById('c-' + i + '-' + j).checked = true;
      }
    }
  }
}

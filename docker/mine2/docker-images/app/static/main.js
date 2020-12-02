var audiostarted = false;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
unlockAudioContext(audioContext);
if (confirm("allow audio plz")){
    console.log("shit pressed");
    audiostarted = true;
    audioContext.resume();
}
else {
    alert("meanie");
}
function unlockAudioContext(audioContext) {
    if (AudioContext.state !== 'suspended') return;
    const b = document.body;
    const events = ['touchstart','touchend', 'mousedown','keydown'];
    events.forEach(e => b.addEventListener(e, unlock, false));
    function unlock() { audioContext.resume().then(clean); }
    function clean() { events.forEach(e => b.removeEventListener(e, unlock)); }
}

console.log(window.location.orgin);

var socket = io(window.location.orgin);
socket.on('connect', () => {
    socket.send('Hello');
});

console.log("start dem audio");

var BUFF_SIZE = 16384;

var audioInput = null,
    microphone_stream = null,
    gain_node = null,
    script_processor_node = null,
    script_processor_fft_node = null,
    analyserNode = null;

if (!navigator.mediaDevices.getUserMedia)
    navigator.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;

if (navigator.mediaDevices.getUserMedia && audiostarted){

    navigator.mediaDevices.getUserMedia({audio:true})
	.then(
	    function(stream) {
		console.log("trying to start microphone");
		start_microphone(stream);
	    })
	.catch(function(e) {
	    alert('FUCK FUCK FUCK FUCK FUCK');
	});
} else { alert('getUserMedia not working'); }

// ---

function send_data(final_array) {
    console.log(final_array);
    socket.emit('sound', final_array);
}


function show_some_data(given_typed_array, num_row_to_display, label) {

    var size_buffer = given_typed_array.length;
    var index = 0;
    var max_index = num_row_to_display;

    send_data(given_typed_array);
    //console.log("__________ " + label);
    //for (; index < max_index && index < size_buffer; index += 1) {
    //  console.log(given_typed_array[index]);
}

function process_microphone_buffer(event) { // invoked by event loop

    var i, N, inp, microphone_output_buffer;

    microphone_output_buffer = event.inputBuffer.getChannelData(0);
    console.log(microphone_output_buffer);

    show_some_data(microphone_output_buffer, 5, "from getChannelData");
}

function start_microphone(stream){
    gain_node = audioContext.createGain();
    gain_node.connect( audioContext.destination );

    microphone_stream = audioContext.createMediaStreamSource(stream);
    microphone_stream.connect(gain_node);

    script_processor_node = audioContext.createScriptProcessor(BUFF_SIZE, 1, 1);
    script_processor_node.onaudioprocess = process_microphone_buffer;

    microphone_stream.connect(script_processor_node);

    document.getElementById('volume').addEventListener('change', function() {

	var curr_volume = this.value;
	gain_node.gain.value = curr_volume;

	console.log("curr_volume ", curr_volume);
    });

    script_processor_fft_node = audioContext.createScriptProcessor(2048, 1, 1);
    script_processor_fft_node.connect(gain_node);

    var analyserNode = audioContext.createAnalyser();
    analyserNode.smoothingTimeConstant = 0;
    analyserNode.fftSize = 2048;

    microphone_stream.connect(analyserNode);

    analyserNode.connect(script_processor_fft_node);

    script_processor_fft_node.onaudioprocess = function() {


	var array = new Float32Array(analyserNode.fftSize);
	analyserNode.getFloatTimeDomainData(array);


	if (microphone_stream.playbackState == microphone_stream.PLAYING_STATE) {

	    show_some_data(array, 5, "from fft");
	}
    };
}

socket.on('data', (data) => {
    document.getElementById("data").innerHTML = data;
    console.log("logging");
});

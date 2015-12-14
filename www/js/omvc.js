var throttle = 0;
var debug_msg = "";

// look up the elements we want to affect
var throttleElement = document.getElementById("throttle");
var debugMsgElement = document.getElementById("debug_msg");

// Create text nodes to save some time for the browser.
var throttleNode = document.createTextNode("");
var debugMsgNode = document.createTextNode("");

// Add those text nodes where they need to go
throttleElement.appendChild(throttleNode);
debugMsgElement.appendChild(debugMsgNode);

var socket = null;
jQuery.getScript("http://192.168.42.1:9001/socket.io/socket.io.js", function() {
	socket = io.connect('http://192.168.42.1:9001');
	// サーバから受け取るイベント
	socket.on('connect', function() {
		setInterval(function() {
			var _starttime = new Date();
			// console.log('ping!!');
			socket.emit('ping', _starttime);
		}, 500);
	});
	socket.on('pong', function() {
		// console.log('pong!!');
	});
	socket.on('msg', function(msg) {
		console.log('msg:' + msg);
		debug_msg = msg;
	});
	socket.on("disconnect", function(client) {
	});
});

var myAttitude_init = null;
var vehicleAttitude_init = null;

var myAttitude = {
	Roll : 0,
	Pitch : 0,
	Yaw : 0
};

var vehicleAttitude = {
	Roll : 0,
	Pitch : 0,
	Yaw : 0
};

var OMVR = new OMVR();

function omvc_init() {
	var canvas = document.getElementById('vr_canvas');
	OMVR.init(canvas);
	OMVR.add_fisheyeCamera('img/default_image_0.jpeg', 'http://192.168.42.1:9000/?action=snapshot', true, false, function() {
		if (socket) {
			socket.emit('getAttitude', function(obj) {
				// console.log(obj);
				vehicleAttitude = obj;
				if (vehicleAttitude_init == null) {
					vehicleAttitude_init = obj;
				} else {
					vehicleAttitude.Yaw -= vehicleAttitude_init.Yaw;
				}
				OMVR.set_vehicleAttitude(vehicleAttitude);
				debug_msg = myAttitude.Roll.toFixed(0) + "," + myAttitude.Pitch.toFixed(0) + "," + myAttitude.Yaw.toFixed(0);
				debug_msg += "\n" + vehicleAttitude.Roll.toFixed(0) + "," + vehicleAttitude.Pitch.toFixed(0) + "," + vehicleAttitude.Yaw.toFixed(0);
			});
		}
	}, {
		Roll : 0,
		Pitch : 0,
		Yaw : 0
	});
	OMVR.add_fisheyeCamera('img/default_image_1.jpeg', 'http://192.168.42.17:9000/?action=snapshot', false, true, function() {
	}, {
		Roll : 180,
		Pitch : 0,
		Yaw : 0
	});

	animate();
}

function animate() {
	OMVR.set_myAttitude(myAttitude);
	OMVR.animate();
	{// status
		throttleNode.nodeValue = (throttle * 100).toFixed(0) + "%";
		debugMsgNode.nodeValue = debug_msg;
	}
	handleGamepad();
	requestAnimationFrame(animate);
}
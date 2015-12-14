var socket = null;
var omvc = OMVC();
function OMVC() {
	var throttle = 0;
	var debug_msg = "";

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

	var overlayElement = document.getElementById("overlay");
	overlayElement.hidden = true;
	
	var throttleNode = document.createTextNode("");
	var debugMsgNode = document.createTextNode("");

	var myself = {
		set_infobox_enabled : function(value) {
			var overlayElement = document.getElementById("overlay");
			overlayElement.hidden = !value;
		},
		set_myAttitude : function(value) {
			myAttitude = value;
			if (myAttitude_init == null) {
				myAttitude_init = value;
			} else {
				myAttitude.Yaw -= myAttitude_init.Yaw;
			}
			myself.omvr.set_myAttitude(myAttitude);
		},
		set_vehicleAttitude : function(value) {
			vehicleAttitude = value;
			if (vehicleAttitude_init == null) {
				vehicleAttitude_init = value;
			} else {
				vehicleAttitude.Yaw -= vehicleAttitude_init.Yaw;
			}
			myself.omvr.set_vehicleAttitude(vehicleAttitude);
		},
		omvr : new OMVR(),
		init : function() {
			// look up the elements we want to affect
			var throttleElement = document.getElementById("throttle");
			var debugMsgElement = document.getElementById("debug_msg");

			// Add those text nodes where they need to go
			throttleElement.appendChild(throttleNode);
			debugMsgElement.appendChild(debugMsgNode);
			
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
			})

			var canvas = document.getElementById('vr_canvas');
			myself.omvr.init(canvas);
			myself.omvr.add_fisheyeCamera('img/default_image_0.jpeg', 'http://192.168.42.1:9000/?action=snapshot', true, false, function() {
				if (socket == null) {
					return;
				}
				socket.emit('getAttitude', function(obj) {
					// console.log(obj);
					set_vehicleAttitude(obj);
					debug_msg = myAttitude.Roll.toFixed(0) + "," + myAttitude.Pitch.toFixed(0) + "," + myAttitude.Yaw.toFixed(0);
					debug_msg += "\n" + vehicleAttitude.Roll.toFixed(0) + "," + vehicleAttitude.Pitch.toFixed(0) + "," + vehicleAttitude.Yaw.toFixed(0);
				});
			}, {
				Roll : 0,
				Pitch : 0,
				Yaw : 0
			});
			myself.omvr.add_fisheyeCamera('img/default_image_1.jpeg', 'http://192.168.42.17:9000/?action=snapshot', false, true, function() {
			}, {
				Roll : 180,
				Pitch : 0,
				Yaw : 0
			});

			myself.animate();
		},

		animate : function() {
			myself.omvr.set_myAttitude(myAttitude);
			myself.omvr.animate();
			{// status
				throttleNode.nodeValue = (throttle * 100).toFixed(0) + "%";
				debugMsgNode.nodeValue = debug_msg;
			}
			handleGamepad();
			requestAnimationFrame(myself.animate);
		},

		arm : function(value) {
			if (socket == null) {
				return;
			}
			if (value) {
				socket.emit('arm', function() {
					throttle = 0;
				});
			} else {
				socket.emit('disarm', function() {
					throttle = 0;
				});
			}
		}
	};
	return myself;
}
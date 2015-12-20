var socket = null;
var omvc = OMVC();
function OMVC() {
	var controlValue = {
		// 0% - 100%
		Throttle : 0,
		// -180 - 180
		Roll : 0,
		// -180 - 180
		Pitch : 0,
		// -180 - 180
		Yaw : 0
	};
	var actuatorValue = {
			LeftTop : 0,
			LeftBottom : 0
			RightTop : 0,
			RightBottom : 0,
		};
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

	var ViewModeEnum = {
		Dive : 0,
		Drive : 1
	};

	window.addEventListener("orientationchange", function() {
		// alert(window.orientation);
	});

	document.getElementById("overlay").style.display = "none";
	document.getElementById("infoTypeBox").style.display = "none";
	document.getElementById("debugMsgBox").style.display = "none";
	document.getElementById("actuatorMsgBox").style.display = "none";
	document.getElementById("attitudeMsgBox").style.display = "none";

	var controlMsgNode = document.createTextNode("");
	var debugMsgNode = document.createTextNode("");
	var actuatorMsgNode = document.createTextNode("");
	var attitudeMsgNode = document.createTextNode("");

	var viewMode = ViewModeEnum.Dive;

	var self = {
		omvr : new OMVR(),
		init : function() {

			self.initSocket();
			self.initOmvr();
			self.initGamepadEventLisener();
			self.initMouseEventLisener();

			self.animate();
		},

		initOmvr : function() {
			// Add those text nodes where they need to go
			document.getElementById("controlMsg").appendChild(controlMsgNode);
			document.getElementById("debugMsg").appendChild(debugMsgNode);
			document.getElementById("actuatorMsg").appendChild(actuatorMsgNode);
			document.getElementById("attitudeMsg").appendChild(attitudeMsgNode);

			var canvas = document.getElementById('vrCanvas');
			self.omvr.init(canvas);
			self.omvr.add_fisheyeCamera('img/default_image_0.jpeg', 'http://192.168.42.1:9000/?action=snapshot', true, false, function() {
				if (socket == null) {
					return;
				}
				socket.emit('getAttitude', function(obj) {
					// console.log(obj);
					self.setVehicleAttitude(obj);
				});
			}, {
				Roll : 0,
				Pitch : 0,
				Yaw : 0
			});
			self.omvr.add_fisheyeCamera('img/default_image_1.jpeg', 'http://192.168.42.17:9000/?action=snapshot', false, true, function() {
			}, {
				Roll : 180,
				Pitch : 0,
				Yaw : 0
			});
		},

		initSocket : function() {
			jQuery.getScript("http://192.168.42.1:9001/socket.io/socket.io.js", function() {
				socket = io.connect('http://192.168.42.1:9001');
				// サーバから受け取るイベント
				socket.on('connect', function() {
					setInterval(function() {
						var _starttime = new Date();
						console.log('ping!!');
						socket.emit('ping', _starttime);
					}, 500);
				});
				socket.on('pong', function(obj) {
					console.log('pong!!');
					console.log(obj);
					swConnect.setChecked(obj.FlightTelemetryStats.Status);
					swArm.setChecked(obj.FlightStatus.Armed);
					
					actuatorValue.LeftTop = ActuatorCommand.Channel0;					
					actuatorValue.LeftBottom = ActuatorCommand.Channel3;					
					actuatorValue.RightTop = ActuatorCommand.Channel1;					
					actuatorValue.RightBottom = ActuatorCommand.Channel2;
				});
				socket.on('msg', function(msg) {
					console.log('msg:' + msg);
					debug_msg = msg;
				});
				socket.on("disconnect", function(client) {
				});
			})
		},

		initGamepadEventLisener : function() {
			if (omgamepad) {
				var command_processing = false;
				var x = 0, y = 0, z = 0;
				omgamepad.gamepadCallback = function(key, value, count) {
					switch (key) {
					case "button0":
						if (count == 1) {
							controlValue.Throttle++;
							if (controlValue.Throttle > 100) {
								controlValue.Throttle = 100;
							}
						}
						break;
					case "button1":
						if (count == 1) {
							controlValue.Throttle--;
							if (controlValue.Throttle < 0) {
								controlValue.Throttle = 0;
							}
						}
						break;
					case "button2":
						if (count == 1) {
						}
						return;
						break;
					case "button3":
						if (count == 1) {
						}
						return;
						break;
					case "dpadRight":
						if (count == 1) {
							x++;
						}
						break;
					case "dpadLeft":
						if (count == 1) {
							x--;
						}
						break;
					case "dpadUp":
						if (count == 1) {
							y++;
						}
						break;
					case "dpadDown":
						if (count == 1) {
							y--;
						}
						break;
					case "rightBumper":
						if (count == 1) {
							z++;
						}
						break;
					case "leftBumper":
						if (count == 1) {
							z--;
						}
						break;
					default:
						alert(key);
						return;
					}
					if (!command_processing) {
						command_processing = true;
						if (socket == null) {
							return;
						}

						if (viewMode == ViewModeEnum.Drive) {
							var quat_correct = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.Math.degToRad(x), THREE.Math.degToRad(y), THREE.Math.degToRad(z), "ZYX"));
							var quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.Math.degToRad(vehicleAttitude.Roll), THREE.Math.degToRad(-vehicleAttitude.Pitch), THREE.Math
									.degToRad(vehicleAttitude.Yaw), "ZYX"));
							quaternion.multiply(quat_correct);
							var euler = new THREE.Euler().setFromQuaternion(quaternion, "ZYX");
							controlValue.Roll = THREE.Math.radToDeg(euler.x);
							controlValue.Pitch = THREE.Math.radToDeg(-euler.y);
							controlValue.Yaw = THREE.Math.radToDeg(euler.z);
						}

						x = y = z = 0;

						socket.emit('setControlValue', controlValue, function(obj) {
							command_processing = false;
						});
						setTimeout(function() {
							if (command_processing) {
								command_processing = false;
							}
						}, 5000);
					}
				}
			}
		},

		initMouseEventLisener : function() {
			var down = false;
			var sx = 0, sz = 0;
			window.onmousedown = function(ev) {
				down = true;
				sx = ev.clientX;
				sz = ev.clientY;
			};
			window.onmouseup = function() {
				down = false;
			};
			window.onmousemove = function(ev) {
				if (!down || ev.button != 1) {
					return;
				}
				var dx = -(ev.clientX - sx);
				var dz = -(ev.clientY - sz);
				sx -= dx;
				sz -= dz;

				var theta = dx / 10;
				var phi = -dz / 10;

				var quat_correct = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.Math.degToRad(phi), THREE.Math.degToRad(-theta), THREE.Math.degToRad(0), "ZYX"));
				var quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.Math.degToRad(myAttitude.Roll), THREE.Math.degToRad(-myAttitude.Pitch), THREE.Math.degToRad(myAttitude.Yaw),
						"ZYX"));
				quaternion.multiply(quat_correct);
				var euler = new THREE.Euler().setFromQuaternion(quaternion, "ZYX");
				myAttitude.Roll = THREE.Math.radToDeg(euler.x);
				myAttitude.Pitch = THREE.Math.radToDeg(-euler.y);
				myAttitude.Yaw = THREE.Math.radToDeg(euler.z);
			}
		},

		animate : function() {
			if (viewMode == ViewModeEnum.Dive) {
				self.omvr.setMyAttitude(myAttitude);
				self.omvr.setVehicleAttitude(vehicleAttitude);
			} else {
				self.omvr.setMyAttitude(myAttitude);
				self.omvr.setVehicleAttitude({
					Roll : 90,
					Pitch : 0,
					Yaw : 0
				});
			}

			self.omvr.animate();

			{// status
				controlMsgNode.nodeValue = controlValue.Throttle.toFixed(0) + "%" + " " + controlValue.Roll + " " + controlValue.Pitch + " " + controlValue.Yaw;
				actuatorMsgNode.nodeValue = actuatorValue.LeftTop.toFixed(0) + " " + actuatorValue.RightTop + " " + actuatorValue.RightBottom + " " + actuatorValue.LeftBottom;
				debugMsgNode.nodeValue = debug_msg;
				attitudeMsgNode.nodeValue = myAttitude.Roll.toFixed(0) + "," + myAttitude.Pitch.toFixed(0) + "," + myAttitude.Yaw.toFixed(0);
				attitudeMsgNode.nodeValue += "\n" + vehicleAttitude.Roll.toFixed(0) + "," + vehicleAttitude.Pitch.toFixed(0) + "," + vehicleAttitude.Yaw.toFixed(0);
			}

			if (omgamepad) {
				omgamepad.handleGamepad();
			}

			requestAnimationFrame(self.animate);
		},

		connectFcm : function(value) {
			if (socket == null) {
				return;
			}
			socket.emit('connectFcm', function(res) {
			});
		},

		setArm : function(value) {
			if (socket == null) {
				return;
			}
			socket.emit('setArm', value, function(res) {
				controlValue = {
					Throttle : 0,
					Roll : 0,
					Pitch : 0,
					Yaw : 0
				};
			});
		},
		setInfoboxEnabled : function(value) {
			var overlayElement = document.getElementById("overlay");
			overlayElement.style.display = value ? "block" : "none";
			var infoTypeBoxElement = document.getElementById("infoTypeBox");
			infoTypeBoxElement.style.display = value ? "block" : "none";
		},
		setInfoType : function(type) {
			switch (type) {
			case "none":
				document.getElementById("attitudeMsgBox").style.display = "none";
				document.getElementById("actuatorMsgBox").style.display = "none";
				document.getElementById("debugMsgBox").style.display = "none";
				break;
			case "attitude":
				document.getElementById("attitudeMsgBox").style.display = "block";
				document.getElementById("actuatorMsgBox").style.display = "none";
				document.getElementById("debugMsgBox").style.display = "none";
				break;
			case "actuator":
				document.getElementById("attitudeMsgBox").style.display = "none";
				document.getElementById("actuatorMsgBox").style.display = "block";
				document.getElementById("debugMsgBox").style.display = "none";
				break;
			case "debug":
				document.getElementById("attitudeMsgBox").style.display = "none";
				document.getElementById("actuatorMsgBox").style.display = "none";
				document.getElementById("debugMsgBox").style.display = "block";
				break;
			}
		},
		
		setMyAttitude : function(value) {
			myAttitude = value;
			if (myAttitude_init == null) {
				myAttitude_init = value;
			} else {
				myAttitude.Yaw -= myAttitude_init.Yaw;
			}
		},
		
		setVehicleAttitude : function(value) {
			vehicleAttitude = value;
			if (vehicleAttitude_init == null) {
				vehicleAttitude_init = value;
			} else {
				vehicleAttitude.Yaw -= vehicleAttitude_init.Yaw;
			}
		},

		setDiveMode : function() {
			viewMode = ViewModeEnum.Dive;
		},

		setDriveMode : function() {
			viewMode = ViewModeEnum.Drive;
		}
	};
	return self;
}
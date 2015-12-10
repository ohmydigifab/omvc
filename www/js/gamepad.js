Gamepad = {
	/**
	 * Represents the button 0 (the A on the XBOX controller, the O on the OUYA
	 * controller)
	 */
	BUTTON_0 : 0,
	/**
	 * Represents the button 1 (the B on the XBOX controller, the A on the OUYA
	 * controller)
	 */
	BUTTON_1 : 1,
	/**
	 * Represents the button 2 (the X on the XBOX controller, the U on the OUYA
	 * controller)
	 */
	BUTTON_2 : 2,
	/**
	 * Represents the button 3 (the Y on the XBOX controller, the Y on the OUYA
	 * controller)
	 */
	BUTTON_3 : 3,
	/**
	 * Represents the left bumper button.
	 */
	BUTTON_LEFT_BUMPER : 4,
	/**
	 * Represents the right bumper button.
	 */
	BUTTON_RIGHT_BUMPER : 5,

	/**
	 * Represents the left trigger button.
	 */
	BUTTON_LEFT_TRIGGER : 6,
	/**
	 * Represents the right trigger button.
	 */
	BUTTON_RIGHT_TRIGGER : 7,

	/**
	 * Represents the left joystick button.
	 */
	BUTTON_LEFT_JOYSTICK : 10,
	/**
	 * Represents the right joystick button.
	 */
	BUTTON_RIGHT_JOYSTICK : 11,
	/**
	 * Represents the dpad up button.
	 */
	BUTTON_DPAD_UP : 12,
	/**
	 * Represents the dpad down button.
	 */
	BUTTON_DPAD_DOWN : 13,
	/**
	 * Represents the dpad left button.
	 */
	BUTTON_DPAD_LEFT : 14,
	/**
	 * Represents the dpad right button.
	 */
	BUTTON_DPAD_RIGHT : 15,
	/**
	 * Represents the menu button.
	 */
	BUTTON_MENU : 16,

	/**
	 * Represents the left joystick horizontal axis.
	 */
	AXIS_LEFT_JOYSTICK_X : 0,
	/**
	 * Represents the left joystick vertical axis.
	 */
	AXIS_LEFT_JOYSTICK_Y : 1,
	/**
	 * Represents the right joystick horizontal axis.
	 */
	AXIS_RIGHT_JOYSTICK_X : 2,
	/**
	 * Represents the right joystick vertical axis.
	 */
	AXIS_RIGHT_JOYSTICK_Y : 3
};

var command_processing = false;
function handleGamepad() {
	if (command_processing) {
		return;
	}
	if (navigator.webkitGetGamepads) {
		// Get all the available gamepads.
		var gamepads = navigator.webkitGetGamepads();
		if (gamepads && gamepads.length > 0) {
			// Iterate over all the gamepads and show their values.
			for ( var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad) {
					atLeastOneGamepadShown = true;
					// For now, the Gamepad plugin only supports an old version
					// of the W3C Gamepad API that did not declare the
					// GamepadButton interface.
					// Check if the interface is being used to decide how to
					// retrieve the information from the buttons.
					var declaresGamepadButtonInterface = (typeof gamepad.buttons[Gamepad.BUTTON_0]["value"] !== "undefined");
					// Depending if the GamepadButton interface was declared or
					// not:
					// 1.- GamepadButton is not declared: get the button value
					// directly from the elements of the buttons array.
					// 2.- GamepadButton is declared: There is an object in each
					// element of the buttons array and the "value" property
					// holds the button value.
					var button0 = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_0].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_0].toFixed(2);
					var button1 = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_1].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_1].toFixed(2);
					var button2 = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_2].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_2].toFixed(2);
					var button3 = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_3].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_3].toFixed(2);
					var leftBumper = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_LEFT_BUMPER].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_LEFT_BUMPER].toFixed(2);
					var rightBumper = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_RIGHT_BUMPER].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_RIGHT_BUMPER].toFixed(2);
					var leftTrigger = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_LEFT_TRIGGER].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_LEFT_TRIGGER].toFixed(2);
					var rightTrigger = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_RIGHT_TRIGGER].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_RIGHT_TRIGGER].toFixed(2);
					var leftJoystick = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_LEFT_JOYSTICK].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_LEFT_JOYSTICK].toFixed(2);
					var rightJoystick = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_RIGHT_JOYSTICK].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_RIGHT_JOYSTICK].toFixed(2);
					var dpadUp = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_DPAD_UP].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_DPAD_UP].toFixed(2);
					var dpadDown = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_DPAD_DOWN].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_DPAD_DOWN].toFixed(2);
					var dpadLeft = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_DPAD_LEFT].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_DPAD_LEFT].toFixed(2);
					var dpadRight = declaresGamepadButtonInterface ? gamepad.buttons[Gamepad.BUTTON_DPAD_RIGHT].value.toFixed(2) : gamepad.buttons[Gamepad.BUTTON_DPAD_RIGHT].toFixed(2);
					var leftJoystickX = gamepad.axes[Gamepad.AXIS_LEFT_JOYSTICK_X].toFixed(2);
					var leftJoystickY = gamepad.axes[Gamepad.AXIS_LEFT_JOYSTICK_Y].toFixed(2);
					var rightJoystickX = gamepad.axes[Gamepad.AXIS_RIGHT_JOYSTICK_X].toFixed(2);
					var rightJoystickY = gamepad.axes[Gamepad.AXIS_RIGHT_JOYSTICK_Y].toFixed(2);
					var menuButton = declaresGamepadButtonInterface ? gamepad.buttons[16].value.toFixed(2) : gamepad.buttons[16].toFixed(2);
					if (button2 != 0) {
						command_processing = true;
						socket.emit('disarm', function() {
							throttle = 0;
							command_processing = false;
						});
					} else if (button3 != 0) {
						command_processing = true;
						socket.emit('arm', function() {
							throttle = 0;
							command_processing = false;
						});
					} else if (button0 != 0) // accelerate
					{
						command_processing = true;
						socket.emit('accelerate_throttle', button0, function(value) {
							throttle = value;
							command_processing = false;
						});
					} else if (button1 != 0) // decelerate
					{
						command_processing = true;
						socket.emit('accelerate_throttle', -button1, function(value) {
							throttle = value;
							command_processing = false;
						});
					}
					// wait
					if (command_processing) {
						setTimeout(function() {
							command_processing = false;
						}, 1000);
					}
				}
			}
		}
	}
}
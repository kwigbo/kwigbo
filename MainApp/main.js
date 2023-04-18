// Setup the application initialization
(function (window, document, undefined) {
	window.onload = main;
	window.onresize = resizeWindow;
})(window, document, undefined);

// Main function call on application launch
function main() {
	// Initialize the UI
	errorView = document.getElementById("errorView");
	mainCanvas = document.getElementById("mainCanvas");
	contentView = document.getElementById("contentView");
	// currentScene = new SproutLands();
	currentScene = new MainScene();
	setupEvents();
	resizeWindow();
	startAnimating(60);
}

var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;

// initialize the timer variables and start the animation

function startAnimating(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	animate();
}

/// The main game loop method that handles the render cycle
function animate() {
	window.requestAnimationFrame(animate);

	now = Date.now();
	elapsed = now - then;

	// if enough time has elapsed, draw the next frame

	if (elapsed > fpsInterval) {
		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
		then = now - (elapsed % fpsInterval);

		render();
	}
}

function update(progress) {}

var previousScene;
var currentScene;

function changeScene(scene) {
	previousScene = currentScene;
	currentScene = scene;
	currentScene.display();
}

function resizeWindow() {
	mainCanvas.width = window.innerWidth;
	mainCanvas.height = window.innerHeight;
	changeScene(currentScene);
}

/// Main render method. This method manages calls to render each item.
function render() {
	const context = mainCanvas.getContext("2d");
	context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
	if (previousScene.isHidding) {
		previousScene.hide();
	}
	currentScene.render();
}

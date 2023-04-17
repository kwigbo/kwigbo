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
	setupEvents();
	resizeWindow();
	window.requestAnimationFrame(gameLoop);
}

/// Used to track time between render calls
var lastRender = 0;

/// The main game loop method that handles the render cycle
function gameLoop(timestamp) {
	var progress = timestamp - lastRender;

	update(progress);
	render();

	lastRender = timestamp;
	window.requestAnimationFrame(gameLoop);
}

function update(progress) {}

var previousScene;
var currentScene = new MainScene();

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

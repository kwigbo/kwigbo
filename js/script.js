// Setup the application initialization
(function(window, document, undefined){
window.onload = main;
window.onresize = resizeWindow;
})(window, document, undefined);

// Main function call on application launch
function main() {
	// Initialize the UI
	errorView = document.getElementById("errorView");
	avatarCanvas = document.getElementById("avatarCanvas");
	contentView = document.getElementById("contentView");

  	window.addEventListener("touchstart", touchStart, false);
  	window.addEventListener("touchend", touchEnd, false);
  	window.addEventListener("mousedown", mouseDown, false);
  	window.addEventListener("mouseup", mouseUp, false);

 	resizeWindow();

	window.requestAnimationFrame(gameLoop);
}

function resizeWindow() {
	avatarCanvas.width = window.innerWidth;
	avatarCanvas.height = window.innerHeight;
 	generatePixels(kwigboData, kwigboSize, kwigboSize);
 	generateLogos();
}

function touchStart(e) {
	isTouchDown = true;
	touchX = e.touches[0].clientX;
  	touchY = e.touches[0].clientY;
}

function mouseDown(e) {
	isTouchDown = true;
	touchX = e.offsetX;
  	touchY = e.offsetY;
}

function touchEnd() {
	isTouchDown = false;
	isWaitingToSettle = true;
}

function mouseUp() {
	isTouchDown = false;
	isWaitingToSettle = true;
}

var touchX = 0;
var touchY = 0;
var isTouchDown = false;
var isWaitingToSettle = false;
var pixels = [];
var lastUpdate;
const footerHeight = 80;

function gameLoop() {
	var now = window.Date.now();

	if (lastUpdate) {
		var elapsed = (now-lastUpdate) / 1000;
		lastUpdate = now;

		// Update all game objects here.
		//update(elapsed);
		// ...and render them somehow.
		render();
	} else {
		// Skip first frame, so elapsed is not 0.
		lastUpdate = now;
	}
	  // This makes the `tick` function run 60 frames per second (or slower, depends on monitor's refresh rate).
	  window.requestAnimationFrame(gameLoop);
}

var isReversing = false;

function render() {
	const context = avatarCanvas.getContext('2d');
	context.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);

	renderIcons();

	for (var i = 0; i < pixels.length; i++) {
		let pixel = pixels[i];
		if (isTouchDown) {
			if (pixel.distanceMoved() < 50) {
				pixel.repel(touchX, touchY);
				pixel.integrate();
			}
		} else if (!pixel.isSettled) {
			pixel.return();
			pixel.integrate();
		} else {
			pixel.stay();
		}
		pixel.draw();
	}

	renderFooter();
}

function renderFooter() {
	let context = avatarCanvas.getContext('2d');
	context.fillStyle = "#ffffff";
	context.fillRect(0, window.innerHeight - footerHeight,
		window.innerWidth, footerHeight);
	context.fillStyle = "#000000";
	context.fillRect(0, window.innerHeight - footerHeight,
		window.innerWidth, 5);
	context.font = "40px Helvetica";
	context.textAlign = 'center';
	context.textBaseline = "middle";
	let textY = Math.ceil(window.innerHeight - (footerHeight/2))
	context.fillText("kwigbo.crypto",
		Math.ceil(window.innerWidth/2), textY);
}

function renderIcons() {
	let xpos = Math.ceil(window.innerWidth/2);
	let ypos = Math.ceil(window.innerHeight/2);

	for (var i = 0; i < icons.length; i++) {
		let icon = icons[i];
		icon.move();
		icon.draw();
	}
}

var icons = [];

function generateLogos() {
	icons = [];
    loadSymbol("vet");
    loadSymbol("zil");
    loadSymbol("xtz");
    loadSymbol("ltc");
    loadSymbol("eth");
    loadSymbol("enj");
    loadSymbol("bat");
    loadSymbol("beam");
    loadSymbol("algo");
    loadSymbol("btc");
    loadSymbol("ada");
}

function loadSymbol(symbol) {
	let image = new Image();
    image.onload = function() {
    	icons.push(new Icon(getRandomInt(window.innerWidth),
    		getRandomInt(window.innerHeight), image));
    }
    image.src = "./icons/" + symbol + "@2x.png";
}

function generatePixels(string, imageWidth, imageHeight) {
	let maxWidth = window.innerWidth;
	let maxHeight = window.innerHeight - footerHeight;

	pixels = [];
	// Get the image data for kwigbo
	var array = string.split(",");
	array = chunk(array, 4);

	// Max width
	let realSize = scaleSizeToFit(imageWidth, imageHeight, maxWidth, maxHeight);
	let displaySize = realSize[0];

	let scaleFactor = displaySize/kwigboSize;
	let xOffset = Math.ceil((maxWidth/2) - (displaySize/2));
	let yOffset = Math.ceil(maxHeight - (displaySize));

	for (var x = 0; x < imageWidth; x++) {
		for (var y = 0; y < imageHeight; y++) {
			let realIndex = x * imageWidth + y
			let pixelData = array[realIndex];
			let xPos = Math.ceil(x*scaleFactor) + xOffset;
			let yPos = Math.ceil(y*scaleFactor) + yOffset;
			let width = Math.ceil(scaleFactor);

			pixels.push(new Pixel(xPos, yPos, width, pixelData));
		}
	}
}

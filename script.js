// Setup the application initialization
(function(window, document, undefined){
window.onload = main;
})(window, document, undefined);

// Method used to check if the browser support this app
function isBrowserSupported() {
	var isSupported = window.FileReader
	return isSupported
}

// Main function call on application launch
function main() {
	// Initialize the UI
	setupUIElements();

	// Check for browser app support
	updateUnsupportedViewHidden(isBrowserSupported());

	// Render the avatar
	render();
}

function render() {
	let image = new Image();
    image.onload = function() {
    	let maxWidth = mintView.offsetWidth - 40;
    	renderPixelImage(image, dataCanvas, previewCanvas, maxWidth);

    }
    image.src = "kwigbo.png";
}

function setupUIElements() {
	errorView = document.getElementById("errorView");
	mintView = document.getElementById("mintView");
	unsupportedView = document.getElementById("unsupportedView");
	dataCanvas = document.getElementById("dataCanvas");
	previewCanvas = document.getElementById("previewCanvas");
}

function updateUnsupportedViewHidden(hidden) {
	if (hidden) {
		mintView.style.display = "block";
		unsupportedView.style.display = "none";
	} else {
		mintView.style.display = "none";
		unsupportedView.style.display = "block";
	}
}

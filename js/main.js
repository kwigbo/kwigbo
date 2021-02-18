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
  	setupEvents();
 	resizeWindow();
	window.requestAnimationFrame(gameLoop);
}

function resizeWindow() {
	avatarCanvas.width = window.innerWidth;
	avatarCanvas.height = window.innerHeight;
 	generatePixels(kwigboData, kwigboSize, kwigboSize);
 	loadCryptoIcons();
}

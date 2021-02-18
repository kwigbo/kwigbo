var touchX = 0;
var touchY = 0;
var isTouchDown = false;

function setupEvents() {
	window.addEventListener("touchstart", touchStart, false);
  	window.addEventListener("touchend", touchEnd, false);
  	window.addEventListener("mousedown", mouseDown, false);
  	window.addEventListener("mouseup", mouseUp, false);
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
}

function mouseUp() {
	isTouchDown = false;
}

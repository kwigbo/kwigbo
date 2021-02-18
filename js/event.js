var touchX = 0;
var touchY = 0;
var isTouchDown = false;

function setupEvents() {
	window.addEventListener("touchstart", touchStart, false);
  	window.addEventListener("touchend", touchEnd, false);
  	window.addEventListener("touchmove", touchMove, false);
  	window.addEventListener("mousedown", mouseDown, false);
  	window.addEventListener("mousemove", mouseMove, false);
  	window.addEventListener("mouseup", mouseUp, false);
}

function touchMove(e) {
	if (isTouchDown) {
		touchX = e.touches[0].clientX;
  		touchY = e.touches[0].clientY;
	}
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

function mouseMove(e) {
	if (isTouchDown) {
		touchX = e.offsetX;
  		touchY = e.offsetY;
	}
}

function touchEnd() {
	isTouchDown = false;
}

function mouseUp() {
	isTouchDown = false;
}

var touchX = 0;
var touchY = 0;
var isTouchDown = false;

var moveX = 0;
var moveY = 0;

function setupEvents() {
	window.addEventListener("touchstart", touchStart, false);
  	window.addEventListener("touchend", touchEnd, false);
  	window.addEventListener("touchmove", touchMove, false);
  	window.addEventListener("mousedown", mouseDown, false);
  	window.addEventListener("mousemove", mouseMove, false);
  	window.addEventListener("mouseup", mouseUp, false);
}

function touchMove(e) {
	moveX = e.touches[0].clientX;
	moveY = e.touches[0].clientY;
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
	moveX = e.offsetX;
	moveY = e.offsetY;
	if (isTouchDown) {
		touchX = e.offsetX;
  		touchY = e.offsetY;
	}
}

function touchEnd() {
	isTouchDown = false;
	moveX = 0;
	moveY = 0;
}

function mouseUp() {
	isTouchDown = false;
	moveX = 0;
	moveY = 0;
}

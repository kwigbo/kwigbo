var isTouchDown = false;
var touchFrame = new Frame(new Point(0, 0), new Size(64, 64));

function setupEvents() {
	window.addEventListener("touchstart", touchStart, false);
  	window.addEventListener("touchend", touchEnd, false);
  	window.addEventListener("touchmove", touchMove, false);
  	window.addEventListener("mousedown", mouseDown, false);
  	window.addEventListener("mousemove", mouseMove, false);
  	window.addEventListener("mouseup", mouseUp, false);
}

function touchMove(e) {
	touchFrame.origin = new Point(
		e.touches[0].clientX, e.touches[0].clientY);
}

function touchStart(e) {
	isTouchDown = true;
	touchFrame.origin = new Point(
		e.touches[0].clientX, e.touches[0].clientY);
}

function mouseDown(e) {
	isTouchDown = true;
	touchFrame.origin = new Point(e.offsetX, e.offsetY);
}

function mouseMove(e) {
	touchFrame.origin = new Point(e.offsetX, e.offsetY);
}

function touchEnd() {
	isTouchDown = false;
	touchFrame.origin = new Point(0, 0);
}

function mouseUp() {
	isTouchDown = false;
	touchFrame.origin = new Point(0, 0);
}

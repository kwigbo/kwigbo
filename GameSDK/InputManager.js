class InputManager {
	isTouchDown = false;
	touchFrame = new Frame(new Point(0, 0), new Size(64, 64));

	constructor() {
		this.boundTouchMove = this.touchMove.bind(this);
		this.boundTouchEnd = this.touchEnd.bind(this);
		this.boundTouchStart = this.touchStart.bind(this);
		this.boundMouseDown = this.mouseDown.bind(this);
		this.boundMouseUp = this.mouseUp.bind(this);
		this.boundMouseMove = this.mouseMove.bind(this);

		window.addEventListener("touchstart", this.boundTouchStart, false);
		window.addEventListener("touchend", this.boundTouchEnd, false);
		window.addEventListener("touchmove", this.boundTouchMove, false);
		window.addEventListener("mousedown", this.boundMouseDown, false);
		window.addEventListener("mousemove", this.boundMouseMove, false);
		window.addEventListener("mouseup", this.boundMouseUp, false);
	}

	destroy() {
		window.removeEventListener("touchstart", this.boundTouchStart, false);
		window.removeEventListener("touchend", this.boundTouchEnd, false);
		window.removeEventListener("touchmove", this.boundTouchMove, false);
		window.removeEventListener("mousedown", this.boundMouseDown, false);
		window.removeEventListener("mousemove", this.boundMouseMove, false);
		window.removeEventListener("mouseup", this.boundMouseUp, false);
	}

	touchMove(event) {
		this.touchFrame.origin = new Point(
			event.touches[0].clientX,
			event.touches[0].clientY
		);
	}

	touchStart(event) {
		this.isTouchDown = true;
		this.touchFrame.origin = new Point(
			event.touches[0].clientX,
			event.touches[0].clientY
		);
	}

	mouseDown(event) {
		this.isTouchDown = true;
		this.touchFrame.origin = new Point(event.offsetX, event.offsetY);
	}

	mouseMove(event) {
		this.touchFrame.origin = new Point(event.offsetX, event.offsetY);
	}

	touchEnd() {
		this.isTouchDown = false;
		this.touchFrame.origin = new Point(0, 0);
	}

	mouseUp() {
		this.isTouchDown = false;
		this.touchFrame.origin = new Point(0, 0);
	}
}

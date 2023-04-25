class SproutLands extends Scene {
	constructor(rootContainer) {
		super(rootContainer);
		this.display();
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.map.resize(this.canvas);
	}

	display() {
		if (!this.canvas) {
			this.canvas = document.createElement("canvas");
			this.canvas.setAttribute("id", "mainCanvas");
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.rootContainer.appendChild(this.canvas);
			this.map = new MainMap(4, this.canvas);
			this.map.loadMap();
			this.displayLoop.start(60);
		}
	}

	inputUpdated() {
		this.map.updateTouchPoint(this.touchFrame.origin);
	}

	touchStart(event) {
		super.touchStart(event);
		this.inputUpdated();
	}

	mouseDown(event) {
		super.mouseDown(event);
		if (this.lastMouse) {
			let currentTime = Date.now();
			let elapsedTime = currentTime - this.lastMouse;
			if (elapsedTime < 100) {
				return;
			}
		}
		this.lastMouse = Date.now();
		this.inputUpdated();
	}

	render() {
		this.map.render();
	}
}

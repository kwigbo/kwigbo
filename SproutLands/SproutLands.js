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
			this.displayLoop.start(60);
		}
		this.loadCat();
	}

	loadGeisha() {
		let startPoint = new Point(300, 50);
		let characterSheet = new Image();
		characterSheet.src = "./SproutLands/Assets/Geisha-Sprite.png";
		this.characterSprite = new CharacterSprite(
			characterSheet,
			48,
			8,
			this.canvas,
			2,
			this.map,
			startPoint
		);
	}

	loadCat() {
		let startPoint = new Point(300, 50);
		let characterSheet = new Image();
		characterSheet.src = "./SproutLands/Assets/Character.png";
		this.characterSprite = new CharacterSprite(
			characterSheet, // image
			16, // size
			4, // frames
			this.canvas, // canvas
			4, // scale
			this.map, // map
			startPoint // start
		);
	}

	inputUpdated() {
		this.touchPoint = new Point(
			this.touchFrame.origin.x +
				this.map.viewPort.origin.x -
				this.canvas.width * 0.5 +
				this.map.viewPort.size.width * 0.5,
			this.touchFrame.origin.y +
				this.map.viewPort.origin.y -
				this.canvas.height * 0.5 +
				this.map.viewPort.size.height * 0.5
		);
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
		if (this.touchPoint) {
			// Position the character
			this.characterSprite.moveTo(this.touchPoint);
			// Position the map
			this.map.scrollTo(this.characterSprite.currentPosition);
		}

		// Draw the frame
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// Draw base layer
		this.map.renderMapBaseLayer();
		// Draw the character
		this.characterSprite.render();
	}
}

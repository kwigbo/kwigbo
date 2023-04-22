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
		let context = this.canvas.getContext("2d");
		let characterSheet = new Image();
		characterSheet.src = "./SproutLands/Assets/Character.png";
		this.characterSprite = new CharacterSprite(
			characterSheet,
			16,
			4,
			this.canvas,
			4,
			this.map
		);
		this.touchPoint = new Point(
			Math.floor(this.canvas.width / 2),
			Math.floor(this.canvas.height / 2)
		);
		// Position the character
		this.characterSprite.moveTo(this.touchPoint, false);
	}

	inputUpdated() {
		this.touchPoint.x =
			this.touchFrame.origin.x +
			this.map.viewPort.origin.x -
			this.canvas.width * 0.5 +
			this.map.viewPort.size.width * 0.5;
		this.touchPoint.y =
			this.touchFrame.origin.y +
			this.map.viewPort.origin.y -
			this.canvas.height * 0.5 +
			this.map.viewPort.size.height * 0.5;
	}

	touchStart(event) {
		super.touchStart(event);
		this.inputUpdated();
	}

	mouseDown(event) {
		this.inputUpdated();
	}

	render() {
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Position the character
		this.characterSprite.moveTo(this.touchPoint, true);
		// // Position the map
		this.map.scrollTo(this.characterSprite.currentPosition);

		// Draw base layer
		this.map.renderMapBaseLayer();
		// Draw Character
		this.characterSprite.stand(Direction.Down);
	}
}

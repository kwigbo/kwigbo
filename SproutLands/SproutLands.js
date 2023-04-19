class SproutLands extends Scene {
	constructor(rootContainer) {
		super(rootContainer);
		this.display();
	}

	display() {
		if (!this.canvas) {
			this.canvas = document.createElement("canvas");
			this.canvas.setAttribute("id", "mainCanvas");
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.rootContainer.appendChild(this.canvas);
			this.displayLoop.start(60);
		}
		let context = this.canvas.getContext("2d");
		let characterSheet = new Image();
		characterSheet.src = "./SproutLands/Sprites/Character.png";
		this.characterSprite = new CharacterSprite(
			characterSheet,
			48,
			4,
			context
		);
	}

	render() {
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		let characterSpeed = 3;
		let pos = this.characterSprite.currentPosition;
		let mouse = this.touchFrame.origin;
		let dx = mouse.x - pos.x;
		let dy = mouse.y - pos.y;
		let distance = Math.sqrt(dx * dx + dy * dy);
		if (this.isTouchDown && distance > 2) {
			let factor = distance / characterSpeed;
			let xspeed = dx / factor;
			let yspeed = dy / factor;
			let newX = (pos.x += xspeed);
			let newY = (pos.y += yspeed);
			let newPosition = new Point(newX, newY);
			this.characterSprite.currentPosition = newPosition;
			this.characterSprite.walk(
				this.directionBetween(newPosition, mouse, distance)
			);
		} else {
			this.characterSprite.stand(Direction.Down);
		}
	}

	directionBetween(start, end) {
		let horizontalDistance = Math.abs(start.x - end.x);
		if (start.x < end.x && horizontalDistance > 60) {
			return Direction.Right;
		} else if (start.x > end.x && horizontalDistance > 60) {
			return Direction.Left;
		} else if (start.y > end.y) {
			return Direction.Up;
		} else {
			return Direction.Down;
		}
	}
}

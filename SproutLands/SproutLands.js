class SproutLands extends Scene {
	constructor() {
		super();
		this.context = mainCanvas.getContext("2d");
		let characterSheet = new Image();
		characterSheet.src = "./SproutLands/Sprites/Character.png";
		this.characterSprite = new CharacterSprite(
			characterSheet,
			48,
			4,
			this.context
		);
	}

	display() {}

	hide() {}

	render() {
		let characterSpeed = 3;
		let pos = this.characterSprite.currentPosition;
		let mouse = touchFrame.origin;
		let dx = mouse.x - pos.x;
		let dy = mouse.y - pos.y;
		let distance = Math.sqrt(dx * dx + dy * dy);
		if (isTouchDown && distance > 2) {
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

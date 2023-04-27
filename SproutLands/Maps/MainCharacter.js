class MainCharacter extends Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(canvas, scale, map, start) {
		let sheet = new Image();
		sheet.src = "./Assets/Character.png";
		super(sheet, 16, 4, canvas, scale, map, start);
		this.animations = [4, 4, 4, 4];
		this.frameDelay = 10;
		this.currentAnimation = 0;
	}

	render() {
		super.render();
		if (this.currentDistance > 2) {
			let direction = this.directionBetween(
				this.currentPosition,
				this.moveToPoint
			);
			this.currentAnimation = direction.rawValue;
		} else {
			this.currentFrame = 0;
			this.currentAnimation = Direction.Down.rawValue;
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

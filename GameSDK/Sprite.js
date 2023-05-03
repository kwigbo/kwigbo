class Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	/// 	- image: The image source for the sprite
	///		- frameSize: The size of the frames in the sprite
	///		- animations: The number of animations in the sheet.
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(image, frameSize, animations, canvas, scale, map, start) {
		this.image = image;
		this.frameSize = frameSize;
		this.animations = frames;
		this.canvas = canvas;
		this.scale = scale;
		this.map = map;
		this.currentPosition = start;
		this.context = this.canvas.getContext("2d");
		this.scaledSize = Math.floor(this.frameSize * scale);
	}

	animations = [];
	currentAnimation = 0;
	currentFrame = 0;

	frameDelay = 10;
	delayCount = 0;

	currentPosition = new Point(0, 0);
	currentDistance = 0;
	moveToPoint;

	get frame() {
		return new Frame(
			new Point(
				this.currentPosition.x - this.scaledSize / 2,
				this.currentPosition.y - this.scaledSize / 2
			),
			new Size(this.scaledSize, this.scaledSize)
		);
	}

	get isOnscreen() {
		return this.frame.collided(this.map.viewPort);
	}

	render() {
		this.context.drawImage(
			this.image,
			this.currentFrame * this.frameSize,
			this.currentAnimation * this.frameSize,
			this.frameSize,
			this.frameSize,
			this.drawPoint().x,
			this.drawPoint().y,
			this.scaledSize,
			this.scaledSize
		);
		let maxFrames = this.animations[this.currentAnimation];
		if (this.delayCount !== 0) {
			if (this.delayCount === this.frameDelay) {
				this.delayCount = 0;
			} else {
				this.delayCount += 1;
				return;
			}
		}
		this.delayCount += 1;
		this.currentFrame += 1;
		if (this.currentFrame >= maxFrames - 1) {
			this.currentFrame = 0;
			this.onEndAnimation();
		}
	}

	onEndAnimation() {}

	moveTo(point) {
		let characterSpeed = 3;
		let pos = new Point(this.currentPosition.x, this.currentPosition.y);
		let mouse = point;
		let dx = mouse.x - pos.x;
		let dy = mouse.y - pos.y;
		this.currentDistance = Math.sqrt(dx * dx + dy * dy);
		if (this.currentDistance > 2) {
			let factor = this.currentDistance / characterSpeed;
			let xspeed = dx / factor;
			let yspeed = dy / factor;
			let newX = (pos.x += xspeed);
			let newY = (pos.y += yspeed);
			let newPosition = new Point(newX, newY);
			this.moveToPoint = point;
			this.updatePosition(newPosition);
		} else {
			this.updatePosition(point);
		}
	}

	updatePosition(newPosition) {
		let halfSize = this.scaledSize / 2;
		let movePoint = new Point(newPosition.x, newPosition.y);
		if (this.currentPosition.x > newPosition.x) {
			movePoint.x -= halfSize;
		} else if (this.currentPosition.x < newPosition.x) {
			movePoint.x += halfSize;
		}
		if (this.currentPosition.y < newPosition.y) {
			movePoint.y += halfSize;
		}
		let coordinates = new GridCoordinates(
			Math.floor(movePoint.x / this.map.scaledTileSize),
			Math.floor(movePoint.y / this.map.scaledTileSize)
		);
		// Check new position for collisions
		if (this.map.isWalkable(coordinates)) {
			this.currentPosition = newPosition;
		} else {
			this.currentDistance = 0;
		}
	}

	drawPoint() {
		let mapX = this.map.viewPort.origin.x;
		let mapY = this.map.viewPort.origin.y;
		let viewPortHalfWidth = this.map.viewPort.size.width / 2;
		let viewPortHalfHeight = this.map.viewPort.size.height / 2;
		let newX =
			this.currentPosition.x -
			mapX +
			this.canvas.width / 2 -
			viewPortHalfWidth -
			this.scaledSize / 2;
		let newY =
			this.currentPosition.y -
			mapY +
			this.canvas.height / 2 -
			viewPortHalfHeight -
			this.scaledSize / 2;
		return new Point(newX, newY);
	}
}

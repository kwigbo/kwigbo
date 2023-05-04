class Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	/// 	- image: The image source for the sprite
	///		- frameSize: The size of the frames in the sprite
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(image, frameSize, canvas, scale, map, start) {
		this.image = image;
		this.frameSize = frameSize;
		this.canvas = canvas;
		this.scale = scale;
		this.map = map;
		this.currentPosition = start;
		this.context = this.canvas.getContext("2d");
		this.scaledSize = Math.floor(this.frameSize * scale);
		this.debugFrameEnabled = false;
	}

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
		if (this.debugFrameEnabled) {
			this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
			this.context.fillRect(
				this.drawPoint().x,
				this.drawPoint().y,
				this.scaledSize,
				this.scaledSize
			);
		}
		if (this.stateMachine) {
			this.stateMachine.render();
		}
	}

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
		let halfSize = this.frame.size.width / 2;
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
		return new Point(Math.floor(newX), Math.floor(newY));
	}
}

class SpriteState extends State {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, frameDelay);
		this.sprite = sprite;
		this.currentFrame = 0;
		this.animationIndex = 0;
	}
	render() {
		this.sprite.context.drawImage(
			this.sprite.image,
			this.currentFrame * this.sprite.frameSize,
			this.animationIndex * this.sprite.frameSize,
			this.sprite.frameSize,
			this.sprite.frameSize,
			this.sprite.drawPoint().x,
			this.sprite.drawPoint().y,
			this.sprite.scaledSize,
			this.sprite.scaledSize
		);
		super.render();
	}
}

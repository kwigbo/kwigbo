class CharacterSprite {
	constructor(image, size, frames, canvas, scale, map) {
		this.map = map;
		this.canvas = canvas;
		this.scale = scale;
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
		this.image = image;
		this.size = size;
		this.frames = frames;
		this.scaledSize = Math.floor(this.size * scale);
	}

	currentFrame = 0;
	currentDirection = Direction.Down;

	frameDelay = 10;
	delayCount = 0;

	currentPosition = new Point(0, 0);

	moveTo(point, animated) {
		if (animated) {
			let xMove = (point.x - this.currentPosition.x) * 0.05;
			let yMove = (point.y - this.currentPosition.y) * 0.05;
			this.currentPosition.x += xMove;
			this.currentPosition.y += yMove;
		} else {
			this.currentPosition = point;
		}
	}

	stand(direction) {
		if (direction !== this.currentDirection) {
			this.currentDirection = direction;
		}
		let offsetX = this.map.viewPort.origin.x;
		let offsetY = this.map.viewPort.origin.y;
		let newX = this.currentPosition.x - offsetX;
		let newY = this.currentPosition.y - offsetY;
		// let newX = this.currentPosition.x;
		// let newY = this.currentPosition.y;
		// this.context.fillStyle = "#ffffff";
		// this.context.fillRect(newX, newY, this.scaledSize, this.scaledSize);
		this.context.imageSmoothingEnabled = false;
		this.context.drawImage(
			this.image,
			Math.ceil(0 * this.size),
			Math.ceil(this.currentDirection.rawValue * this.size),
			this.size,
			this.size,
			newX - this.scaledSize / 2,
			newY - this.scaledSize / 2,
			this.scaledSize,
			this.scaledSize
		);
	}
	walk(direction) {
		if (direction !== this.currentDirection) {
			this.currentFrame = 0;
			this.currentDirection = direction;
		}
		// Down is default
		this.context.imageSmoothingEnabled = false;
		this.context.drawImage(
			this.image,
			Math.ceil(this.currentFrame * this.size),
			Math.ceil(this.currentDirection.rawValue * this.size),
			this.size,
			this.size,
			this.currentPosition.x,
			this.currentPosition.y,
			this.scaledSize,
			this.scaledSize
		);
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
		if (this.currentFrame >= this.frames) {
			this.currentFrame = 0;
		}
	}
}

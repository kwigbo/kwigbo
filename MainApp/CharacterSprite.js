const Direction = {
	Down: 0,
	Up: 1,
	Left: 2,
	Right: 3,
};
class CharacterSprite {
	constructor(image, size, frames, context) {
		this.image = image;
		this.size = size;
		this.frames = frames;
		this.context = context;
		this.scaledSize = Math.floor(this.size * 4);
		this.midDistance = Math.floor(this.scaledSize / 2);
	}

	currentFrame = 0;
	currentDirection = Direction.Down;

	frameDelay = 10;
	delayCount = 0;

	currentPosition = new Point(0, 0);

	stand(direction) {
		if (direction !== this.currentDirection) {
			this.currentDirection = direction;
		}
		this.context.imageSmoothingEnabled = false;
		this.context.drawImage(
			this.image,
			Math.ceil(0 * this.size),
			Math.ceil(this.currentDirection * this.size),
			this.size,
			this.size,
			this.currentPosition.x - this.midDistance,
			this.currentPosition.y - this.midDistance,
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
			Math.ceil(this.currentDirection * this.size),
			this.size,
			this.size,
			this.currentPosition.x - this.midDistance,
			this.currentPosition.y - this.midDistance,
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

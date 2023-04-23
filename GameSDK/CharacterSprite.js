class CharacterSprite {
	constructor(image, size, frames, canvas, scale, map, start) {
		this.map = map;
		this.canvas = canvas;
		this.scale = scale;
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
		this.image = image;
		this.size = size;
		this.frames = frames;
		this.scaledSize = Math.floor(this.size * scale);
		this.currentPosition = start;
	}

	currentFrame = 0;
	currentDirection = Direction.Down;

	frameDelay = 10;
	delayCount = 0;

	currentPosition = new Point(0, 0);

	easedMove(point) {
		var xMove = point.x - this.currentPosition.x - this.scaledSize / 2;
		var yMove = point.y - this.currentPosition.y - this.scaledSize / 2;
		xMove = xMove * 0.05;
		yMove = yMove * 0.05;
		if (Math.abs(xMove) < 1) {
			xMove = 0;
		}
		if (Math.abs(yMove) < 1) {
			yMove = 0;
		}
		this.currentPosition.x += xMove;
		this.currentPosition.y += yMove;
	}

	currentDistance = 0;
	moveToPoint = 0;

	moveTo(point) {
		let characterSpeed = 3;
		let pos = this.currentPosition;
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
			this.currentPosition = newPosition;
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

	render() {
		if (this.currentDistance > 2) {
			this.walk(
				this.directionBetween(this.currentPosition, this.moveToPoint)
			);
		} else {
			this.stand(Direction.Down);
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
			viewPortHalfWidth;
		let newY =
			this.currentPosition.y -
			mapY +
			this.canvas.height / 2 -
			viewPortHalfHeight;
		return new Point(newX, newY);
	}

	stand(direction) {
		if (direction !== this.currentDirection) {
			this.currentDirection = direction;
		}

		this.context.drawImage(
			this.image,
			Math.ceil(0 * this.size),
			Math.ceil(this.currentDirection.rawValue * this.size),
			this.size,
			this.size,
			this.drawPoint().x,
			this.drawPoint().y,
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
		this.context.drawImage(
			this.image,
			Math.ceil(this.currentFrame * this.size),
			Math.ceil(this.currentDirection.rawValue * this.size),
			this.size,
			this.size,
			this.drawPoint().x,
			this.drawPoint().y,
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

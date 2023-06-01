import Point from "./Geometry/Point.js";
import Frame from "./Geometry/Frame.js";
import Size from "./Geometry/Size.js";
import GridCoordinates from "./GridUtil/GridCoordinates.js";

/// Class used to represent a sprite drawn to a Canvas
export default class Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	/// 	- image: The image source for the sprite
	///		- frameSize: The size of the frames in the sprite
	///		- canvas: The canvas to draw to
	///		- tileMap: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(image, frameSize, canvas, tileMap, start) {
		this.image = image;
		this.frameSize = frameSize;
		this.canvas = canvas;
		this.tileMap = tileMap;
		this.currentPosition = start;
		this.currentDistance = 0;
		this.context = this.canvas.getContext("2d");
		this.debugFrameEnabled = false;
	}

	/// Frame that defines the position and size of the sprite
	get frame() {
		const halfSize = this.frameSize / 2;
		return new Frame(
			new Point(
				this.currentPosition.x - halfSize,
				this.currentPosition.y - halfSize
			),
			new Size(this.frameSize, this.frameSize)
		);
	}

	get hitFrame() {
		return this.frame;
	}

	/// Get the current coordinates for the sprite
	get currentCoordinates() {
		return this.tileMap.coordinatesForPoint(
			new Point(this.currentPosition.x, this.currentPosition.y)
		);
	}

	/// Property used to check if the sprite is in the viewport
	get isOnscreen() {
		return this.frame.collided(this.tileMap.cameraFrame);
	}

	/// Override to handle touch
	touch() {}

	/// Override to handle walking to Coordinates
	///
	/// - Parameter coordinates: The coordinates to walk to
	walkTo(coordinates) {}

	/// Method used to render the sprite
	render() {
		if (this.debugFrameEnabled) {
			const realFrame = this.tileMap.realFrameToScreenFrame(this.frame);
			this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
			this.context.fillRect(
				realFrame.origin.x,
				realFrame.origin.y,
				realFrame.size.width,
				realFrame.size.width
			);
			const realHitFrame = this.tileMap.realFrameToScreenFrame(
				this.hitFrame
			);
			this.context.fillStyle = "rgba(255, 0, 0, 0.5)";
			this.context.fillRect(
				realHitFrame.origin.x,
				realHitFrame.origin.y,
				realHitFrame.size.width,
				realHitFrame.size.height
			);
		}
		if (this.stateMachine) {
			this.stateMachine.render();
		}
	}

	/// Method used to walk the sprite to a point in the map
	///
	/// - Parameter point: The point to move to
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
			this.updatePosition(newPosition);
		} else {
			this.updatePosition(point);
		}
	}

	/// Method used to update the position of the player in the map
	///
	/// - Parameter newPosition: The position to move to
	updatePosition(newPosition) {
		let movePoint = new Point(newPosition.x, newPosition.y);
		let coordinates = new GridCoordinates(
			Math.floor(movePoint.x / this.tileMap.tileSize),
			Math.floor(movePoint.y / this.tileMap.tileSize)
		);
		this.currentPosition = newPosition;
	}
}

import Effect from "./Effect.js";
import Point from "../../Geometry/Point.js";

/// Used to display an animated expanding contracting circle mask
export default class AnimatedCircleMaskEffect extends Effect {
	///
	///
	constructor(renderCanvas, startPoint, drawFrame, reverse, complete) {
		super(renderCanvas);
		this.effectCanvas.width = drawFrame.size.width;
		this.effectCanvas.height = drawFrame.size.height;
		this.startPoint = startPoint;
		this.drawFrame = drawFrame;
		this.complete = complete;
		this.reverse = reverse;
		this.maxDiameter = this.getMaxDiameter(startPoint, drawFrame);
		this.currentDiameter = reverse ? 0 : this.maxDiameter;
		this.update();
	}

	getMaxDiameter(startPoint, drawFrame) {
		const topLeft = new Point(drawFrame.origin.x, drawFrame.origin.y);
		const topRight = new Point(
			drawFrame.origin.x + drawFrame.size.width,
			drawFrame.origin.y
		);
		const bottomLeft = new Point(
			drawFrame.origin.x,
			drawFrame.origin.y + drawFrame.size.height
		);
		const bottomRight = new Point(
			drawFrame.origin.x + drawFrame.size.width,
			drawFrame.origin.y + drawFrame.size.height
		);
		const tlDistance = startPoint.distanceTo(topLeft);
		const trDistance = startPoint.distanceTo(topRight);
		const blDistance = startPoint.distanceTo(bottomLeft);
		const brDistance = startPoint.distanceTo(bottomRight);

		const maxTDistance = Math.max(tlDistance, trDistance);
		const maxBDistance = Math.max(blDistance, brDistance);
		const maxDistance = Math.max(maxTDistance, maxBDistance);
		return maxDistance * 2;
	}

	render() {
		if (this.renderCanvas) {
			let context = this.renderCanvas.getContext("2d");
			context.drawImage(
				this.effectCanvas,
				this.drawFrame.origin.x,
				this.drawFrame.origin.y
			);
			this.checkAndPauseIfNeeded();
			this.update();
		}
	}

	checkAndPauseIfNeeded() {
		if (this.pause) {
			return;
		}
		if (this.reverse) {
			this.pause = this.currentDiameter === this.maxDiameter;
		} else {
			this.pause = this.currentDiameter === 0;
		}
		if (this.pause) {
			this.complete();
		}
	}

	/// Method called when the state should be updated
	update() {
		let context = this.effectCanvas.getContext("2d");
		context.fillStyle = "rgba(0, 0, 0, 1)";
		context.fillRect(
			0,
			0,
			this.effectCanvas.width,
			this.effectCanvas.height
		);
		context.save();
		if (this.currentDiameter > 0) {
			context.beginPath();
			context.arc(
				this.startPoint.x,
				this.startPoint.y,
				this.currentDiameter / 2,
				0,
				2 * Math.PI
			);
			context.closePath();
			context.clip();
			context.clearRect(
				0,
				0,
				this.effectCanvas.width,
				this.effectCanvas.height
			);
		}
		context.restore();
		if (!this.pause) {
			if (this.reverse) {
				this.nextOut();
			} else {
				this.nextIn();
			}
		}
	}

	nextIn() {
		const speed = this.maxDiameter * 0.02;
		if (this.currentDiameter - speed >= 0) {
			this.currentDiameter -= speed;
		} else {
			this.currentDiameter = 0;
		}
	}

	nextOut() {
		const speed = this.maxDiameter * 0.02;
		if (this.currentDiameter + speed < this.maxDiameter) {
			this.currentDiameter += speed;
		} else {
			this.currentDiameter = this.maxDiameter;
		}
	}
}

import Effect from "./Effect.js";
import Point from "../../Geometry/Point.js";

/// Used to display an animated expanding contracting circle mask
export default class CircleMaskEffect extends Effect {
	///Construct a new animated circle mask effect
	///
	/// - Parameter:
	///		- renderCanvas: The canvas that the mask should be rendered to
	///		- startPoint: The point at which the circle should animate from
	///		- drawFrame: The frame used to define where to draw the mask
	///		- onComplete: The method called when the effect is complete
	constructor(renderCanvas, startPoint, drawFrame, onComplete) {
		super(renderCanvas, startPoint, drawFrame, onComplete);
		this.maxDiameter = this.getMaxDiameter(startPoint, drawFrame);
		this.currentDiameter = this.maxDiameter;
		this.update();
	}

	/// Get the maximum diameter needed for the circle to contain the drawFrame
	///
	/// - Parameters:
	///		- startPoint: The point where the circle center is
	///		- drawFrame: The frame that the circle must cover
	///	- Returns: The diameter of a circle that will contain the draw Frame
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

	get isComplete() {
		let complete = false;
		if (this.reverse) {
			complete = this.currentDiameter === this.maxDiameter;
		} else {
			complete = this.currentDiameter === 0;
		}
		return complete;
	}

	reverseEffect(startPoint, complete) {
		this.currentDiameter = 0;
		super.reverseEffect(startPoint, complete);
	}

	render() {
		if (this.renderCanvas) {
			let context = this.renderCanvas.getContext("2d");
			context.drawImage(
				this.effectCanvas,
				this.drawFrame.origin.x,
				this.drawFrame.origin.y
			);
			this.update();
		}
	}

	/// Method called when the state should be updated
	update() {
		if (this.pause) {
			return;
		}
		if (this.reverse) {
			this.nextOut();
		} else {
			this.nextIn();
		}
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
		if (this.isComplete) {
			this.pause = true;
			this.onComplete();
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

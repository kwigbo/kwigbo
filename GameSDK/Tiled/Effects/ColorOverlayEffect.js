import Effect from "./Effect.js";
import Point from "../../Geometry/Point.js";

/// Used to display an animated expanding contracting circle mask
export default class ColorOverlayEffect extends Effect {
	///Construct a new animated circle mask effect
	///
	/// - Parameter:
	///		- renderCanvas: The canvas that the mask should be rendered to
	///		- drawFrame: The frame used to define where to draw the mask
	constructor(renderCanvas, drawFrame, color) {
		super(renderCanvas, new Point(0, 0), drawFrame, null);
		this.color = color;
		this.update();
	}

	updateColor(newColor) {
		this.color = newColor;
	}

	render() {
		if (this.renderCanvas) {
			let context = this.renderCanvas.getContext("2d");
			context.drawImage(
				this.effectCanvas,
				this.drawFrame.origin.x,
				this.drawFrame.origin.y
			);
		}
	}

	update() {
		let context = this.effectCanvas.getContext("2d");
		context.fillStyle = this.color;
		context.fillRect(
			0,
			0,
			this.effectCanvas.width,
			this.effectCanvas.height
		);
	}
}

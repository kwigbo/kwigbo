import Effect from "./Effect.js";
import Point from "../../Geometry/Point.js";

/// Used to display an an overlay snow effect
export default class RainEffect extends Effect {
	///Construct a new animated circle mask effect
	///
	/// - Parameter:
	///		- renderCanvas: The canvas that the mask should be rendered to
	///		- drawFrame: The frame used to define where to draw the mask
	constructor(renderCanvas, drawFrame, color) {
		super(renderCanvas, new Point(0, 0), drawFrame, null);
		this.rainDrops = new Array(100);
		let index = 0;
		while (index <= 100) {
			this.rainDrops.push(new RainDrop(drawFrame));
			index++;
		}
		this.update();
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

	update() {
		let context = this.effectCanvas.getContext("2d");
		context.clearRect(
			0,
			0,
			this.effectCanvas.width,
			this.effectCanvas.height
		);
		context.fillStyle = "rgba(255, 255, 255, 0.35)";
		for (const index in this.rainDrops) {
			const drop = this.rainDrops[index];
			drop.draw(context);
			drop.y += 3;
			if (drop.y > this.effectCanvas.height) {
				drop.y = 0;
			}
		}
	}
}

class RainDrop {
	constructor(frame) {
		this.x = Math.random() * frame.size.width;
		this.y = Math.random() * frame.size.height;
		this.width = 2;
		this.height = 5;
	}
	draw(context) {
		context.fillRect(this.x, this.y, this.width, this.height);
	}
}

class SnowFlakeDrop {
	constructor(frame) {
		this.x = Math.random() * frame.size.width;
		this.y = Math.random() * frame.size.height;
		this.radius = 2;
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.closePath();
		context.fill();
	}
}

export default class Effect {
	///Construct a new animated circle mask effect
	///
	/// - Parameter:
	///		- renderCanvas: The canvas that the mask should be rendered to
	///		- startPoint: The point at which the circle should animate from
	///		- drawFrame: The frame used to define where to draw the mask
	///		- onComplete: The method called when the effect is complete
	constructor(renderCanvas, startPoint, drawFrame, onComplete) {
		this.renderCanvas = renderCanvas;
		this.effectCanvas = document.createElement("canvas");
		this.effectCanvas.width = drawFrame.size.width;
		this.effectCanvas.height = drawFrame.size.height;
		this.startPoint = startPoint;
		this.drawFrame = drawFrame;
		this.reverse = false;
		this.pause = false;
		this.onComplete = onComplete;
	}
	get isComplete() {
		return true;
	}
	reverseEffect(startPoint, complete) {
		this.onComplete = complete;
		this.startPoint = startPoint;
		this.reverse = true;
		this.pause = false;
	}
	/// Method used to render the effect
	render() {}
	/// Method called when the state should be updated
	update() {}
}

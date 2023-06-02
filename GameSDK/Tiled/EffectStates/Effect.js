export default class Effect {
	constructor(renderCanvas) {
		this.effectCanvas = document.createElement("canvas");
		this.renderCanvas = renderCanvas;
	}
	/// Method used to render the effect
	render() {}
	/// Method called when the state should be updated
	update() {}
}

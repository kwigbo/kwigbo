class Scene {
	get isTouchDown() {
		return this.inputManager.isTouchDown;
	}

	get touchFrame() {
		return this.inputManager.touchFrame;
	}

	constructor(rootContainer) {
		this.boundRender = this.render.bind(this);
		this.displayLoop = new DisplayLoop(this.boundRender);
		this.inputManager = new InputManager();
		this.rootContainer = rootContainer;
	}

	destroy() {
		this.displayLoop.stop();
		this.displayLoop = null;
		this.inputManager.destroy();
		this.inputManager = null;
		this.boundRender = null;
		this.rootContainer = null;
	}

	render() {}
}

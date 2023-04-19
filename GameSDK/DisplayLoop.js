class DisplayLoop {
	fpsInterval;
	startTime;
	currentTime;
	previousTime;
	elapsedTime;
	isRunning = false;

	constructor(render) {
		this.boundLoop = this.loop.bind(this);
		this.render = render;
	}

	// initialize the timer variables and start the animation
	start(fps) {
		this.fpsInterval = 1000 / fps;
		this.previousTime = Date.now();
		this.startTime = this.previousTime;
		this.loop();
		this.isRunning = true;
	}

	stop() {
		window.cancelAnimationFrame(this.requestId);
		this.isRunning = false;
	}

	/// Main loop that controls render based on FPS
	loop() {
		this.requestId = window.requestAnimationFrame(this.boundLoop);

		this.currentTime = Date.now();
		this.elapsedTime = this.currentTime - this.previousTime;

		if (this.elapsedTime > this.fpsInterval) {
			this.previousTime =
				this.currentTime - (this.elapsedTime % this.fpsInterval);
			this.render();
		}
	}
}

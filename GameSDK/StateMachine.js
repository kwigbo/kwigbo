class State {
	constructor(identifier, frameDelay) {
		this.identifier = identifier;
		this.frameDelay = frameDelay;
		this.delayCount = 0;
	}
	render() {
		if (this.delayCount !== this.frameDelay) {
			this.delayCount += 1;
			return;
		}
		this.delayCount = 0;
		this.update();
	}
	update() {}
	transition(state, onComplete) {}
}

class StateMachine {
	constructor(initialState) {
		this.currentState = initialState;
	}
	transition(state) {
		this.currentState.transition(
			state,
			function (state) {
				this.currentState = state;
			}.bind(this)
		);
	}
	render() {
		if (this.currentState) {
			this.currentState.render();
		}
	}
}

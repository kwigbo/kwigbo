class State {
	constructor(identifier, frameDelay) {
		this.identifier = identifier;
		this.frameDelay = frameDelay;
		this.delayCount = 0;
	}
	render() {
		if (this.delayCount !== 0) {
			if (this.delayCount === this.frameDelay) {
				this.delayCount = 0;
			} else {
				this.delayCount += 1;
				return;
			}
		}
		this.delayCount += 1;
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
		this.currentState.transition(state, function (state) {
			this.currentState = state;
		});
	}
	render() {
		if (this.currentState) {
			this.currentState.render();
		}
	}
}

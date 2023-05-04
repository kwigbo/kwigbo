class State {
	constructor(identifier, updateDelay) {
		this.identifier = identifier;
		this.updateDelay = updateDelay;
		this.delayCount = 0;
	}
	render() {
		if (this.delayCount !== this.updateDelay) {
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

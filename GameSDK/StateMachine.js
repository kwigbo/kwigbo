/// Class used to represent a state in a state machine
class State {
	/// Initialize a new state
	///
	/// - Parameters:
	///		- identifier: The string identifier for the state
	///		- updateDelay: The value to delay updates by
	///			The update delay is used if we don't need to update every frame
	constructor(identifier, updateDelay) {
		this.identifier = identifier;
		this.updateDelay = updateDelay;
		this.delayCount = 0;
	}
	/// Method used to render the state
	render() {
		if (this.delayCount !== this.updateDelay) {
			this.delayCount += 1;
			return;
		}
		this.delayCount = 0;
		this.update();
	}
	/// Method called when the state should be updated
	update() {}
	/// Method used to transition to another state
	///
	/// - Parameters:
	///		- state: The new state to transition to
	///		- onComplete: Function called when the transition is complete
	transition(state, onComplete) {}
}

/// Simple state machine implementation
class StateMachine {
	/// Initialize a state machine with an initial state
	///
	/// - Parameter initialState: The state to start the machine in
	constructor(initialState) {
		this.currentState = initialState;
	}
	/// Method to make the state machine transition to another state
	///
	/// - Parameter state: The state to transition to
	transition(state) {
		this.currentState.transition(
			state,
			function (state) {
				this.currentState = state;
			}.bind(this)
		);
	}
	/// Method used to render the current state
	render() {
		if (this.currentState) {
			this.currentState.render();
		}
	}
}

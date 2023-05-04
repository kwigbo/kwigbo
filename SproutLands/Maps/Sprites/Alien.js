class Alien extends Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(canvas, scale, map, start) {
		let sheet = new Image();
		sheet.src = "./Assets/Alien.png";
		super(sheet, 32, canvas, scale, map, start);
		this.frameDelay = 10;
		this.currentAnimation = 0;
		this.stateMachine = new StateMachine(new AlienStand(this));
	}

	render() {
		this.stateMachine.render();
	}
}

class AlienStand extends SpriteState {
	constructor(character) {
		super("AlienStand", character);
		this.character = character;
		this.animationIndex = 0;
	}
	transition(state, onComplete) {
		this.character.stateMachine.currentState = state;
	}
}

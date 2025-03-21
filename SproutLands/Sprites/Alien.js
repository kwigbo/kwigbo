import Sprite from "../GameSDK/Sprite.js";
import SpriteState from "../GameSDK/SpriteState.js";
import StateMachine from "../GameSDK/StateMachine.js";

export default class Alien extends Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- gridImage: The sprite sheet
	///		- canvas: The canvas to draw to
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(gridImage, canvas, map, start) {
		super(gridImage.image, gridImage.frameSize, canvas, map, start);
		this.frameDelay = 10;
		this.currentAnimation = 0;
		this.debugFrameEnabled = true;
		this.stateMachine = new AlienStateMachine(this);
	}

	render() {
		this.stateMachine.render();
	}
}

export class AlienState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
	}
	transition(state, onComplete) {
		onComplete(state);
	}
}

export class AlienStand extends AlienState {
	constructor(sprite) {
		super("AlienStand", sprite, 10);
		this.animationIndex = 0;
		this.idleWait = 0;
	}
	update() {
		this.idleWait++;
		if (this.idleWait > 20) {
			const idle = new AlienIdle(this.sprite);
			this.sprite.stateMachine.transition(idle);
		}
	}
}

export class AlienIdle extends AlienState {
	static Identifier = "AlienIdle";
	constructor(sprite) {
		super(AlienIdle.Identifier, sprite, 3);
		this.animationIndex = 0;
		this.playCount = 0;
	}
	update() {
		let maxFrames = 10;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.playCount++;
			this.currentFrame = 0;
		}
		if (this.playCount > 5) {
			const stand = new AlienStand(this.sprite);
			this.sprite.stateMachine.transition(stand);
		}
	}
}

export class AlienStateMachine extends StateMachine {
	get currentStateId() {
		return this.currentState.identifier;
	}
	get isStanding() {
		return this.currentStateId === AlienStand.Identifier;
	}
	get isIdling() {
		return this.currentStateId === AlienIdle.Identifier;
	}
	constructor(character) {
		super(new AlienStand(character));
	}
}

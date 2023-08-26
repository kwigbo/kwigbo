import Sprite from "../GameSDK/Sprite.js";
import SpriteState from "../GameSDK/SpriteState.js";
import StateMachine from "../GameSDK/StateMachine.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Point from "../GameSDK/Geometry/Point.js";
import Size from "../GameSDK/Geometry/Size.js";

export default class Goblin extends Sprite {
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
		this.debugFrameEnabled = false;
		this.stateMachine = new GoblinStateMachine(this);
	}

	get hitFrame() {
		const frameWidth = this.frame.size.width;
		const frameHeight = this.frame.size.height;

		const hitSize = frameWidth / 4;

		let frameX = this.frame.origin.x;
		let frameY = this.frame.origin.y;

		frameX = frameX + frameWidth / 2 - hitSize / 2;
		frameY = frameY + frameHeight / 2 - hitSize / 2;
		return new Frame(new Point(frameX, frameY), new Size(hitSize, hitSize));
	}
}

export class GoblinState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
	}
	transition(state, onComplete) {
		onComplete(state);
	}
}

export class GoblinStand extends GoblinState {
	constructor(sprite) {
		super("GoblinStand", sprite, 10);
		this.animationIndex = 1;
		this.currentFrame = 5;
		this.idleWait = 0;
	}
	update() {
		this.idleWait++;
		if (this.idleWait > 20) {
			const idle = new GoblinIdle(this.sprite);
			this.sprite.stateMachine.transition(idle);
		}
	}
}

export class GoblinIdle extends GoblinState {
	static Identifier = "GoblinIdle";
	constructor(sprite) {
		super(GoblinIdle.Identifier, sprite, 10);
		this.animationIndex = 1;
		this.playCount = 0;
	}
	update() {
		let maxFrames = 8;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.playCount++;
			this.currentFrame = 0;
		}
		if (this.playCount > 5) {
			const stand = new GoblinStand(this.sprite);
			this.sprite.stateMachine.transition(stand);
		}
	}
}

export class GoblinStateMachine extends StateMachine {
	get currentStateId() {
		return this.currentState.identifier;
	}
	get isStanding() {
		return this.currentStateId === GoblinStand.Identifier;
	}
	get isIdling() {
		return this.currentStateId === GoblinIdle.Identifier;
	}
	constructor(character) {
		super(new GoblinStand(character));
	}
}

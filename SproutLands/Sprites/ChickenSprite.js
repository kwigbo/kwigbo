import Sprite from "../GameSDK/Sprite.js";
import SpriteState from "../GameSDK/SpriteState.js";
import StateMachine from "../GameSDK/StateMachine.js";
import Util from "../GameSDK/Util.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Size from "../GameSDK/Geometry/Size.js";
import Point from "../GameSDK/Geometry/Point.js";

export default class ChickenSprite extends Sprite {
	/// Blink animation index
	static blink = 0;
	/// Eat animation index
	static eat = 11;
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- gridImage: The GridImage used for display
	///		- canvas: The canvas to draw to
	///		- tileMap: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(gridImage, canvas, tileMap, start) {
		super(gridImage.image, gridImage.frameSize, canvas, tileMap, start);
		this.stateMachine = new ChickenStateMachine(this);
		this.debugFrameEnabled = false;
	}

	get hitFrame() {
		const frameWidth = this.frame.size.width;
		const frameHeight = this.frame.size.height;
		let frameX = this.frame.origin.x;
		let frameY = this.frame.origin.y;

		const quarterWidth = frameWidth / 4;
		const hitWidth = frameWidth - quarterWidth;
		const hitHeight = frameHeight / 2;

		frameY = frameY + frameHeight - hitHeight;
		frameX = frameX + frameWidth / 2 - hitWidth / 2;

		return new Frame(
			new Point(frameX, frameY),
			new Size(hitWidth, hitHeight),
		);
	}
}

class ChickenState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
	}
	transition(state, onComplete) {
		onComplete(state);
	}
}

class ChickenStand extends ChickenState {
	static StandFrame = 3;
	static Identifier = "ChickenStand";
	constructor(sprite) {
		super(ChickenStand.Identifier, sprite, 10);
		this.animationIndex = ChickenSprite.blink;
		this.currentFrame = ChickenStand.StandFrame;
		this.waitCount = 0;
		this.waitTime = Util.getRandomInt(30);
		if (this.waitTime < 10) {
			this.waitTime = 10;
		}
	}
	update() {
		this.waitCount++;
		if (this.waitCount > this.waitTime) {
			const eat = new ChickenEat(this.sprite);
			this.sprite.stateMachine.transition(eat);
		}
	}
}

class ChickenEat extends ChickenState {
	static Frames = 6;
	static Identifier = "ChickenEat";
	constructor(sprite) {
		super(ChickenEat.Identifier, sprite, 10);
		this.animationIndex = ChickenSprite.eat;
		this.currentFrame = 0;
	}
	update() {
		this.currentFrame++;
		if (this.currentFrame === ChickenEat.Frames) {
			const stand = new ChickenStand(this.sprite);
			this.sprite.stateMachine.transition(stand);
		}
	}
}

class ChickenStateMachine extends StateMachine {
	get currentStateId() {
		return this.currentState.identifier;
	}
	get isStanding() {
		return this.currentStateId === ChickenStand.Identifier;
	}
	constructor(chicken) {
		super(new ChickenStand(chicken));
	}
}

import Sprite from "../GameSDK/Sprite.js";
import SpriteState from "../GameSDK/SpriteState.js";
import StateMachine from "../GameSDK/StateMachine.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Point from "../GameSDK/Geometry/Point.js";
import Size from "../GameSDK/Geometry/Size.js";

export default class ThetaChestSprite extends Sprite {
	/// Load the svgs needed for the theta chest
	static loadSVGs() {
		ThetaChestSprite.TFuelSVG = new Image();
		ThetaChestSprite.TFuelSVG.src = "./AssetManager/Theta/TFuel.svg";
		ThetaChestSprite.TDropSVG = new Image();
		ThetaChestSprite.TDropSVG.src = "./AssetManager/Theta/TDrop.svg";
	}
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
		this.stateMachine = new ChestStateMachine(this);
		this.tfuelAmount = 0;
		this.tdropAmount = 0;
	}

	get frame() {
		return new Frame(
			new Point(this.currentPosition.x, this.currentPosition.y),
			new Size(this.frameSize.width, this.frameSize.height)
		);
	}

	toggle() {
		if (this.stateMachine.isClosed) {
			this.stateMachine.transition(new ChestOpen(this));
		} else if (this.stateMachine.isOpen) {
			this.stateMachine.transition(new ChestClose(this));
		}
	}

	open() {}

	render() {
		this.stateMachine.render();
	}
}

export class ChestState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
		this.disableDefault = true;
		this.iconAlpha = 0;
	}
	render() {
		super.render();
		this.sprite.context.drawImage(
			this.sprite.image,
			this.currentFrame * this.sprite.frameSize.width,
			0,
			this.sprite.frameSize.width,
			this.sprite.frameSize.height,
			this.sprite.currentPosition.x,
			this.sprite.currentPosition.y,
			this.sprite.frameSize.width,
			this.sprite.frameSize.height
		);
		const iconSize = 30;
		const spriteSize = this.sprite.frameSize;
		this.sprite.context.globalAlpha = this.iconAlpha;
		const TFuelLeft = this.sprite.currentPosition.x + spriteSize.width;
		const TDropLeft = TFuelLeft + iconSize + 10;
		const iconBottom = this.sprite.currentPosition.y + spriteSize.height;

		const tfuel = Math.trunc(this.sprite.tfuelAmount);
		const tdrop = Math.trunc(this.sprite.tdropAmount);

		if (tfuel > 0) {
			this.sprite.context.drawImage(
				ThetaChestSprite.TFuelSVG,
				TFuelLeft,
				iconBottom - iconSize,
				iconSize,
				iconSize
			);

			const tFuelCenter = new Point(TFuelLeft + iconSize / 2, iconBottom);
			this.drawTextUnderCenter(tFuelCenter, `${tfuel}`);
		}

		if (tdrop > 0) {
			this.sprite.context.drawImage(
				ThetaChestSprite.TDropSVG,
				TDropLeft,
				iconBottom - iconSize,
				iconSize,
				iconSize
			);
			const tDropCenter = new Point(TDropLeft + iconSize / 2, iconBottom);
			this.drawTextUnderCenter(tDropCenter, `${tdrop}`);
		}

		this.sprite.context.globalAlpha = 1;
	}
	drawTextUnderCenter(centerPoint, text) {
		const context = this.sprite.context;
		context.font = "bold 12px Arial";
		const textWidth = context.measureText(text).width;
		const realPoint = new Point(
			centerPoint.x - textWidth / 2,
			centerPoint.y + 5
		);
		context.lineWidth = 5;
		context.fillStyle = "white";
		context.strokeStyle = "white";
		context.strokeText(text, realPoint.x, realPoint.y);
		context.fillStyle = "black";
		context.fillText(text, realPoint.x, realPoint.y);
	}
	transition(state, onComplete) {
		onComplete(state);
	}
}

export class ChestOpen extends ChestState {
	static Identifier = "ChestOpen";
	constructor(sprite) {
		super(ChestOpen.Identifier, sprite, 4);
	}
	render() {
		super.render();
	}
	update() {
		if (this.iconAlpha < 1) {
			this.iconAlpha += 0.25;
		}
		if (this.iconAlpha > 1) {
			this.iconAlpha = 1;
		}
		if (this.currentFrame < 5) {
			this.currentFrame++;
		}
	}
}

export class ChestClose extends ChestState {
	static Identifier = "ChestClose";
	constructor(sprite) {
		super(ChestClose.Identifier, sprite, 4);
	}
	update() {
		if (this.iconAlpha > 0) {
			this.iconAlpha -= 0.25;
		}
		if (this.iconAlpha < 0) {
			this.iconAlpha = 0;
		}
		if (this.currentFrame > 0) {
			this.currentFrame--;
		}
	}
}

export class ChestStateMachine extends StateMachine {
	get currentStateId() {
		return this.currentState.identifier;
	}
	get isClosed() {
		const isClosed = this.currentStateId === ChestClose.Identifier;
		const isEndFrame = this.currentState.currentFrame === 0;
		return isClosed && isEndFrame;
	}

	get isOpen() {
		const isOpen = this.currentStateId === ChestOpen.Identifier;
		const isEndFrame = this.currentState.currentFrame === 5;
		return isOpen && isEndFrame;
	}
	/// Method to make the state machine transition to another state
	///
	/// - Parameter state: The state to transition to
	transition(state) {
		state.currentFrame = this.currentState.currentFrame;
		state.iconAlpha = this.currentState.iconAlpha;
		super.transition(state);
	}
	constructor(character) {
		const closeState = new ChestClose(character);
		closeState.currentFrame = 0;
		closeState.iconAlpha = 0;
		super(closeState);
	}
}

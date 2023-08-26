import State from "./State.js";

/// Class used to represent the state of a sprite
export default class SpriteState extends State {
	/// Initialize a new state for the sprite
	///
	/// - Parameters:
	///		- identifier: The string idetifier for the state
	///		- sprite: The sprite the state should apply to
	///		- frameDelay: The delay to use when rendering each frame of the state
	///			THIS MUST BE SET FOR THE UPDATE METHOD TO TRIGGER!
	constructor(identifier, sprite, frameDelay) {
		super(identifier, frameDelay);
		this.sprite = sprite;
		this.currentFrame = 0;
		this.animationIndex = 0;
		this.flipHorizontal = false;
		this.disableDefault = false;
	}

	/// Method used to render the sprite based on the current state
	render() {
		if (this.disableDefault) {
			super.render();
			return;
		}
		this.sprite.context.save();
		const realFrame = this.sprite.tileMap.realFrameToScreenFrame(
			this.sprite.frame,
		);
		let drawPointX = realFrame.origin.x;
		if (this.flipHorizontal) {
			this.sprite.context.scale(-1, 1);
			drawPointX = drawPointX * -1 - this.sprite.frameSize.width;
		}
		this.sprite.context.drawImage(
			this.sprite.image,
			this.currentFrame * this.sprite.frameSize.width,
			this.animationIndex * this.sprite.frameSize.height,
			this.sprite.frameSize.width,
			this.sprite.frameSize.height,
			drawPointX,
			realFrame.origin.y,
			realFrame.size.width,
			realFrame.size.height,
		);
		this.sprite.context.restore();
		super.render();
	}
}

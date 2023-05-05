class BabyCowSprite extends Sprite {
	/// Blink animation index
	static blink = 0;
	/// Ear wiggle animation index
	static ears = 1;
	/// Walk animation index
	static walk = 2;
	/// Jump animation index
	static jump = 3;
	/// LayDown animation index
	static layDown = 4;
	/// Sleep animation index
	static sleep = 5;
	/// Eat animation index
	static eat = 6;
	/// Chew animation index
	static chew = 7;
	/// Love animation index
	static love = 8;
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- spriteSheets: The different color cow sprite sheets
	///		- canvas: The canvas to draw to
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(spriteSheets, canvas, map, start) {
		const sheet = spriteSheets[getRandomInt(spriteSheets.length - 1)];
		super(sheet, 128, canvas, 1, map, start);
		this.stateMachine = new BabyCowStateMachine(this);
		this.eatCount = 0;
	}

	get frame() {
		// Cut the frame down to touches only collide with the body
		return new Frame(
			new Point(
				this.currentPosition.x - this.scaledSize / 2,
				this.currentPosition.y
			),
			new Size(this.scaledSize, this.scaledSize / 2)
		);
	}

	touch() {
		if (this.stateMachine.isStanding) {
			this.stateMachine.transition(new BabyCowJump(this));
		}
	}
}

class BabyCowState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
	}
	transition(state, onComplete) {
		onComplete(state);
	}
}

class BabyCowStand extends BabyCowState {
	static Identifier = "BabyCowStand";
	constructor(sprite) {
		super(BabyCowStand.Identifier, sprite);
		this.animationIndex = BabyCowSprite.blink;
	}
}

class BabyCowJump extends BabyCowState {
	static Identifier = "BabyCowJump";
	constructor(sprite) {
		super(BabyCowJump.Identifier, sprite, 8);
		this.animationIndex = BabyCowSprite.jump;
	}
	update() {
		let maxFrames = 3;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const ears = new BabyCowEars(this.sprite);
			this.sprite.stateMachine.transition(ears);
		}
	}
}

class BabyCowEars extends BabyCowState {
	static Identifier = "BabyCowEars";
	constructor(sprite) {
		super(BabyCowEars.Identifier, sprite, 20);
		this.animationIndex = BabyCowSprite.ears;
	}
	update() {
		let maxFrames = 3;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const stand = new BabyCowStand(this.sprite);
			this.sprite.stateMachine.transition(stand);
		}
	}
}

class BabyCowStateMachine extends StateMachine {
	get currentStateId() {
		return this.currentState.identifier;
	}
	get isStanding() {
		return this.currentStateId === BabyCowStand.Identifier;
	}
	constructor(cow) {
		super(new BabyCowStand(cow));
	}
}

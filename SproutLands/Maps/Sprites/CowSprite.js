class CowSprite extends Sprite {
	/// Blink animation index
	static blink = 0;
	/// Walk animation index
	static walk = 1;
	/// LayDown animation index
	static layDown = 2;
	/// Sleep animation index
	static sleep = 4;
	/// Eat animation index
	static eat = 5;
	/// Chew animation index
	static chew = 6;
	/// Love animation index
	static love = 7;
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- spriteSheets: The different color cow sprite sheets
	///		- canvas: The canvas to draw to
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(spriteSheets, canvas, map, start) {
		const sheet = spriteSheets[getRandomInt(spriteSheets.length - 1)];
		super(sheet, 128, canvas, map, start);
		this.stateMachine = new CowStateMachine(this);
		this.eatCount = 0;
	}

	get frame() {
		// Cut the frame down to touches only collide with the body
		return new Frame(
			new Point(
				this.currentPosition.x - this.frameSize / 2,
				this.currentPosition.y
			),
			new Size(this.frameSize, this.frameSize / 2)
		);
	}

	touch() {
		if (this.stateMachine.isStanding) {
			var random = Math.random() < 0.5;
			if (random) {
				this.stateMachine.transition(new CowLove(this));
			} else {
				this.stateMachine.transition(new CowEat(this));
			}
		}
	}
}

class CowState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
	}
	transition(state, onComplete) {
		onComplete(state);
	}
}

class CowStand extends CowState {
	static Identifier = "CowStand";
	constructor(sprite) {
		super(CowStand.Identifier, sprite);
		this.animationIndex = CowSprite.blink;
	}
}

class CowLove extends CowState {
	static Identifier = "CowLove";
	constructor(sprite) {
		super(CowLove.Identifier, sprite, 10);
		this.animationIndex = CowSprite.love;
	}
	update() {
		let maxFrames = 6;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const stand = new CowStand(this.sprite);
			this.sprite.stateMachine.transition(stand);
		}
	}
}

class CowEat extends CowState {
	static Identifier = "CowEat";
	constructor(sprite) {
		super(CowEat.Identifier, sprite, 10);
		this.animationIndex = CowSprite.eat;
		this.sprite.eatCount++;
	}
	update() {
		let maxFrames = 7;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const chew = new CowChew(this.sprite, 4);
			this.sprite.stateMachine.transition(chew);
		}
	}
}

class CowChew extends CowState {
	static Identifier = "CowChew";
	constructor(sprite, count) {
		super(CowChew.Identifier, sprite, 20);
		this.animationIndex = CowSprite.chew;
		this.count = count - 1;
	}
	update() {
		let maxFrames = 4;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			if (this.count <= 0) {
				if (this.sprite.eatCount < 3) {
					const stand = new CowStand(this.sprite);
					this.sprite.stateMachine.transition(stand);
				} else {
					const sleep = new CowSleep(this.sprite);
					this.sprite.stateMachine.transition(sleep);
				}
			} else {
				const chew = new CowChew(this.sprite, this.count);
				this.sprite.stateMachine.transition(chew);
			}
		}
	}
}

class CowLay extends CowState {
	static Identifier = "CowLay";
	constructor(sprite) {
		super(CowLay.Identifier, sprite, 10);
		this.animationIndex = CowSprite.layDown;
	}
	update() {
		let maxFrames = 4;
		if (this.currentFrame < maxFrames - 1) {
			this.currentFrame++;
		}
	}
}

class CowSleep extends CowState {
	static Identifier = "CowSleep";
	constructor(sprite) {
		super(CowSleep.Identifier, sprite, 20);
		this.animationIndex = CowSprite.layDown;
	}
	update() {
		let maxFrames = 4;
		if (
			this.currentFrame >= maxFrames - 1 &&
			this.animationIndex === CowSprite.layDown
		) {
			this.animationIndex = CowSprite.sleep;
			this.currentFrame = 0;
		} else {
			if (this.currentFrame + 1 > maxFrames - 1) {
				this.currentFrame = 0;
			} else {
				this.currentFrame++;
			}
		}
	}
}

class CowStateMachine extends StateMachine {
	get currentStateId() {
		return this.currentState.identifier;
	}
	get isStanding() {
		return this.currentStateId === CowStand.Identifier;
	}
	constructor(cow) {
		super(new CowStand(cow));
	}
}

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
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(canvas, scale, map, start) {
		let sheet = new Image();
		const colors = ["Pink", "Green", "Light", "Brown", "Purple"];
		const color = colors[getRandomInt(colors.length - 1)];
		sheet.src = `./Assets/Cow/${color} Cow.png`;
		//sheet.src = `./Assets/Cow/Baby ${color} Cow.png`;
		super(sheet, 32, canvas, scale, map, start);
		this.stateMachine = new CowStateMachine(this);
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
			var random = Math.random() < 0.5;
			if (random) {
				this.stateMachine.transition(new CowLove(this));
			} else {
				this.stateMachine.transition(new CowEat(this));
			}
		}
	}
}

class CowStand extends SpriteState {
	static Identifier = "CowStand";
	constructor(cow) {
		super(CowStand.Identifier, cow);
		this.cow = cow;
		this.animationIndex = CowSprite.blink;
	}

	transition(state, onComplete) {
		onComplete(state);
	}
}

class CowLove extends SpriteState {
	static Identifier = "CowLove";
	constructor(cow) {
		super(CowLove.Identifier, cow, 10);
		this.cow = cow;
		this.animationIndex = CowSprite.love;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		let maxFrames = 6;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const stand = new CowStand(this.cow);
			this.cow.stateMachine.transition(stand);
		}
	}
}

class CowEat extends SpriteState {
	static Identifier = "CowEat";
	constructor(cow) {
		super(CowEat.Identifier, cow, 10);
		this.cow = cow;
		this.animationIndex = CowSprite.eat;
		this.cow.eatCount++;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		let maxFrames = 7;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const chew = new CowChew(this.cow, 4);
			this.cow.stateMachine.transition(chew);
		}
	}
}

class CowChew extends SpriteState {
	static Identifier = "CowChew";
	constructor(cow, count) {
		super(CowChew.Identifier, cow, 20);
		this.cow = cow;
		this.animationIndex = CowSprite.chew;
		this.count = count - 1;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		let maxFrames = 4;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			if (this.count <= 0) {
				if (this.cow.eatCount < 3) {
					const stand = new CowStand(this.cow);
					this.cow.stateMachine.transition(stand);
				} else {
					const sleep = new CowSleep(this.cow);
					this.cow.stateMachine.transition(sleep);
				}
			} else {
				const chew = new CowChew(this.cow, this.count);
				this.cow.stateMachine.transition(chew);
			}
		}
	}
}

class CowLay extends SpriteState {
	static Identifier = "CowLay";
	constructor(cow) {
		super(CowLay.Identifier, cow, 10);
		this.cow = cow;
		this.animationIndex = CowSprite.layDown;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		let maxFrames = 4;
		if (this.currentFrame < maxFrames - 1) {
			this.currentFrame++;
		}
	}
}

class CowSleep extends SpriteState {
	static Identifier = "CowSleep";
	constructor(cow) {
		super(CowSleep.Identifier, cow, 20);
		this.cow = cow;
		this.animationIndex = CowSprite.layDown;
	}

	transition(state, onComplete) {
		onComplete(state);
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

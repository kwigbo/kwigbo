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
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(canvas, scale, map, start) {
		let sheet = new Image();
		const colors = ["Pink", "Green", "Light", "Brown", "Purple"];
		const color = colors[getRandomInt(colors.length - 1)];
		sheet.src = `./Assets/Cow/Baby ${color} Cow.png`;
		super(sheet, 32, canvas, scale, map, start);
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

class BabyCowStand extends SpriteState {
	static Identifier = "BabyCowStand";
	constructor(cow) {
		super(BabyCowStand.Identifier, cow);
		this.cow = cow;
		this.animationIndex = BabyCowSprite.blink;
	}

	transition(state, onComplete) {
		onComplete(state);
	}
}

class BabyCowJump extends SpriteState {
	static Identifier = "BabyCowJump";
	constructor(cow) {
		super(BabyCowJump.Identifier, cow, 8);
		this.cow = cow;
		this.animationIndex = BabyCowSprite.jump;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		let maxFrames = 3;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const ears = new BabyCowEars(this.cow);
			this.cow.stateMachine.transition(ears);
		}
	}
}

class BabyCowEars extends SpriteState {
	static Identifier = "BabyCowEars";
	constructor(cow) {
		super(BabyCowEars.Identifier, cow, 20);
		this.cow = cow;
		this.animationIndex = BabyCowSprite.ears;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		let maxFrames = 3;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			const stand = new BabyCowStand(this.cow);
			this.cow.stateMachine.transition(stand);
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

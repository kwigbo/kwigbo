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
		sheet.src = "./Assets/Brown Cow.png";
		super(sheet, 32, 8, canvas, scale, map, start);
		this.stateMachine = new StateMachine(new CowStand(this));
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
		if (this.stateMachine.currentState.identifier === "CowStand") {
			var random = Math.random() < 0.5;
			if (random) {
				this.stateMachine.transition(new CowLove(this));
			} else {
				this.stateMachine.transition(new CowEat(this));
			}
		}
	}

	render() {
		this.stateMachine.render();
	}
}

class CowState extends State {
	constructor(identifier, cow, frameDelay) {
		super(identifier, frameDelay);
		this.cow = cow;
		this.currentFrame = 0;
		this.animationIndex = CowSprite.blink;
	}
	render() {
		super.render();
		this.cow.context.drawImage(
			this.cow.image,
			this.currentFrame * this.cow.frameSize,
			this.animationIndex * this.cow.frameSize,
			this.cow.frameSize,
			this.cow.frameSize,
			this.cow.drawPoint().x,
			this.cow.drawPoint().y,
			this.cow.scaledSize,
			this.cow.scaledSize
		);
	}
}

class CowStand extends CowState {
	constructor(cow) {
		super("CowStand", cow);
		this.cow = cow;
	}
	transition(state, onComplete) {
		this.cow.stateMachine.currentState = state;
	}
}

class CowLove extends CowState {
	constructor(cow) {
		super("CowLove", cow, 10);
		this.cow = cow;
		this.animationIndex = CowSprite.love;
	}
	transition(state, onComplete) {}

	update() {
		let maxFrames = 6;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.cow.stateMachine.currentState = new CowStand(this.cow);
		}
	}
}

class CowEat extends CowState {
	constructor(cow) {
		super("CowEat", cow, 10);
		this.cow = cow;
		this.animationIndex = CowSprite.eat;
		this.cow.eatCount++;
	}
	transition(state, onComplete) {}

	update() {
		let maxFrames = 7;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.cow.stateMachine.currentState = new CowChew(this.cow, 4);
		}
	}
}

class CowChew extends CowState {
	constructor(cow, count) {
		super("CowChew", cow, 20);
		this.cow = cow;
		this.animationIndex = CowSprite.chew;
		this.count = count - 1;
	}
	transition(state, onComplete) {}

	update() {
		let maxFrames = 4;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			if (this.count <= 0) {
				if (this.cow.eatCount < 3) {
					this.cow.stateMachine.currentState = new CowStand(this.cow);
				} else {
					this.cow.stateMachine.currentState = new CowSleep(this.cow);
				}
			} else {
				this.cow.stateMachine.currentState = new CowChew(
					this.cow,
					this.count
				);
			}
		}
	}
}

class CowLay extends CowState {
	constructor(cow) {
		super("CowLay", cow, 10);
		this.cow = cow;
		this.animationIndex = CowSprite.layDown;
	}

	transition(state, onComplete) {}

	update() {
		let maxFrames = 4;
		if (this.currentFrame < maxFrames - 1) {
			this.currentFrame++;
		}
	}
}

class CowSleep extends CowState {
	constructor(cow) {
		super("CowSleep", cow, 20);
		this.cow = cow;
		this.animationIndex = CowSprite.layDown;
	}
	transition(state, onComplete) {}

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

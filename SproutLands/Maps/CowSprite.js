class CowSprite extends Sprite {
	/// Stand animation index
	static stand = -1;
	/// Blink animation index
	static blink = 0;
	/// Walk animation index
	static walk = 1;
	/// LayDown animation index
	static layDown = 2;
	/// Eat animation index
	static eat = 5;
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

class CowStand extends State {
	constructor(cow) {
		super("CowStand");
		this.cow = cow;
	}
	transition(state, onComplete) {
		this.cow.stateMachine.currentState = state;
	}
	render() {
		this.cow.context.drawImage(
			this.cow.image,
			0 * this.cow.frameSize,
			0 * this.cow.frameSize,
			this.cow.frameSize,
			this.cow.frameSize,
			this.cow.drawPoint().x,
			this.cow.drawPoint().y,
			this.cow.scaledSize,
			this.cow.scaledSize
		);
	}
}

class CowLove extends State {
	constructor(cow) {
		super("CowLove", 10);
		this.cow = cow;
		this.currentFrame = 0;
	}
	transition(state, onComplete) {}
	render() {
		super.render();
		this.cow.context.drawImage(
			this.cow.image,
			this.currentFrame * this.cow.frameSize,
			7 * this.cow.frameSize,
			this.cow.frameSize,
			this.cow.frameSize,
			this.cow.drawPoint().x,
			this.cow.drawPoint().y,
			this.cow.scaledSize,
			this.cow.scaledSize
		);
	}

	update() {
		let maxFrames = 6;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.cow.stateMachine.currentState = new CowStand(this.cow);
		}
	}
}

class CowEat extends State {
	constructor(cow) {
		super("CowEat", 10);
		this.cow = cow;
		this.currentFrame = 0;
	}
	transition(state, onComplete) {}
	render() {
		super.render();
		this.cow.context.drawImage(
			this.cow.image,
			this.currentFrame * this.cow.frameSize,
			5 * this.cow.frameSize,
			this.cow.frameSize,
			this.cow.frameSize,
			this.cow.drawPoint().x,
			this.cow.drawPoint().y,
			this.cow.scaledSize,
			this.cow.scaledSize
		);
	}

	update() {
		let maxFrames = 7;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.cow.stateMachine.currentState = new CowChew(this.cow, 4);
		}
	}
}

class CowChew extends State {
	constructor(cow, count) {
		super("CowChew", 20);
		this.cow = cow;
		this.currentFrame = 0;
		this.count = count - 1;
	}
	transition(state, onComplete) {}
	render() {
		super.render();
		this.cow.context.drawImage(
			this.cow.image,
			this.currentFrame * this.cow.frameSize,
			6 * this.cow.frameSize,
			this.cow.frameSize,
			this.cow.frameSize,
			this.cow.drawPoint().x,
			this.cow.drawPoint().y,
			this.cow.scaledSize,
			this.cow.scaledSize
		);
	}

	update() {
		let maxFrames = 4;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			if (this.count <= 0) {
				this.cow.stateMachine.currentState = new CowStand(this.cow);
			} else {
				this.cow.stateMachine.currentState = new CowChew(
					this.cow,
					this.count
				);
			}
		}
	}
}

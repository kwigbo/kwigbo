class MainCharacter extends Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(canvas, scale, map, start) {
		let sheet = new Image();
		sheet.src = "./Assets/Character.png";
		super(sheet, 48, canvas, scale, map, start);
		this.stateMachine = new CharacterStateMachine(this);
		this.debugFrameEnabled = false;
		this.isMoving = false;
		this.direction = Direction.Down;
	}

	get frame() {
		let hitSize = 16 * this.scale;
		// Cut the frame down to touches only collide with the body
		return new Frame(
			new Point(
				this.currentPosition.x - hitSize / 2,
				this.currentPosition.y - hitSize / 2
			),
			new Size(hitSize, hitSize)
		);
	}

	updatePosition(newPosition) {
		if (this.currentPosition) {
			this.lastPosition = new Point(
				this.currentPosition.x,
				this.currentPosition.y
			);
		}
		super.updatePosition(newPosition);
		if (this.lastPosition) {
			this.isMoving =
				this.lastPosition.x !== this.currentPosition.x &&
				this.lastPosition.y !== this.currentPosition.y;
			if (this.isMoving) {
				this.direction = this.directionBetween(
					this.lastPosition,
					this.currentPosition
				);
				if (!this.stateMachine.isWalking) {
					const walk = new CharacterWalk(this);
					this.stateMachine.transition(walk);
				}
				if (this.stateMachine.isWalking) {
					const currentState = this.stateMachine.currentState;
					currentState.direction = this.direction;
				}
			} else if (
				!this.stateMachine.isStanding &&
				!this.stateMachine.isIdling
			) {
				const stand = new CharacterStand(this);
				this.stateMachine.transition(stand);
			}
		}
	}

	directionBetween(start, end) {
		let horizontalDistance = Math.abs(start.x - end.x);
		if (start.x < end.x && horizontalDistance > 2) {
			return Direction.Right;
		} else if (start.x > end.x && horizontalDistance > 2) {
			return Direction.Left;
		} else if (start.y > end.y) {
			return Direction.Up;
		} else {
			return Direction.Down;
		}
	}
}

class CharacterStand extends SpriteState {
	static Identifier = "CharacterStand";
	constructor(character) {
		super(CharacterStand.Identifier, character, 10);
		this.character = character;
		this.animationIndex = 0;
		this.currentFrame = 0;
		this.idleWait = 0;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		this.idleWait++;
		if (this.idleWait > 20) {
			const idle = new CharacterIdle(this.character);
			this.character.stateMachine.transition(idle);
		}
	}
}

class CharacterIdle extends SpriteState {
	static Identifier = "CharacterIdle";
	constructor(character) {
		super(CharacterIdle.Identifier, character, 4);
		this.character = character;
		this.animationIndex = 0;
		this.playCount = 0;
	}

	transition(state, onComplete) {
		onComplete(state);
	}

	update() {
		let maxFrames = 8;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.playCount++;
			this.currentFrame = 0;
		}
		if (this.playCount > 5) {
			const stand = new CharacterStand(this.character);
			this.character.stateMachine.transition(stand);
		}
	}
}

class CharacterWalk extends SpriteState {
	static Identifier = "CharacterWalk";
	constructor(character) {
		super(CharacterWalk.Identifier, character, 5);
		this.character = character;
		this.animationIndex = 4;
		this.direction = Direction.Down;
	}
	transition(state, onComplete) {
		onComplete(state);
	}
	update() {
		this.convertDirection();
		let maxFrames = 8;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.currentFrame = 0;
		}
	}
	convertDirection() {
		switch (this.direction) {
			case Direction.Down:
				this.animationIndex = 4;
				break;
			case Direction.Up:
				this.animationIndex = 5;
				break;
			case Direction.Right:
				this.animationIndex = 6;
				break;
			case Direction.Left:
				this.animationIndex = 7;
				break;
		}
	}
}

class CharacterStateMachine extends StateMachine {
	get currentStateId() {
		return this.currentState.identifier;
	}
	get isStanding() {
		return this.currentStateId === CharacterStand.Identifier;
	}
	get isWalking() {
		return this.currentStateId === CharacterWalk.Identifier;
	}
	get isIdling() {
		return this.currentStateId === CharacterIdle.Identifier;
	}
	constructor(character) {
		super(new CharacterStand(character));
	}
}

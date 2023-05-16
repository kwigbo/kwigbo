import Sprite from "../GameSDK/Sprite.js";
import SpriteState from "../GameSDK/SpriteState.js";
import StateMachine from "../GameSDK/StateMachine.js";
import Direction from "../GameSDK/Direction.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Point from "../GameSDK/Geometry/Point.js";
import Size from "../GameSDK/Geometry/Size.js";
import AStar from "../GameSDK/AStar/AStar.js";
import SpriteWalkTo from "../GameSDK/SpriteWalkTo.js";

export default class MainCharacter extends Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- gridImage: The sprite sheet
	///		- canvas: The canvas to draw to
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(gridImage, canvas, map, start) {
		super(gridImage.image, gridImage.frameSize, canvas, map, start);
		this.gridImage = gridImage;
		this.stateMachine = new CharacterStateMachine(this);
		this.debugFrameEnabled = false;
		this.isMoving = false;
		this.direction = Direction.Down;
		this.astar = new AStar(this.map);
	}

	/// Override frame method to set the hit area of the player
	get frame() {
		const hitSize = this.gridImage.frameSize / 2;
		// Cut the frame down to touches only collide with the body
		return new Frame(
			new Point(
				this.currentPosition.x - hitSize / 2,
				this.currentPosition.y - hitSize / 2
			),
			new Size(hitSize, hitSize)
		);
	}

	/// Method to call when the player is touched
	touch() {
		if (this.stateMachine.isStanding) {
			// const idle = new CharacterIdle(this, 4);
			// this.stateMachine.transition(idle);
			const hoe = new CharacterHoe(this, 4);
			this.stateMachine.transition(hoe);
		}
	}

	/// Method to walk to a specific coordinates
	///
	/// - Parameters coordinates: The coordinates to walk to
	walkTo(coordinates) {
		const walkTo = new CharacterWalkTo(this, coordinates, this.astar);
		this.stateMachine.transition(walkTo);
	}
}

/// Base class for a character state. Handles all common
/// functionality between all character states.
class CharacterState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
		this.direction = sprite.direction;
		this.convertDirection();
	}
	/// Overridden
	transition(state, onComplete) {
		onComplete(state);
	}
	/// Overridden
	update() {
		this.convertDirection();
	}
	/// Overridden
	convertDirection() {}
}

class CharacterStand extends CharacterState {
	static Identifier = "CharacterStand";
	constructor(sprite) {
		super(CharacterStand.Identifier, sprite, 10);
		this.idleWait = 0;
	}
	/// Overridden
	update() {
		super.update();
		this.idleWait++;
		if (this.idleWait > 20) {
			const idle = new CharacterIdle(this.sprite);
			this.sprite.stateMachine.transition(idle);
		}
	}
	/// Overridden
	convertDirection() {
		switch (this.direction) {
			case Direction.Down:
				this.animationIndex = 0;
				break;
			case Direction.Up:
				this.animationIndex = 1;
				break;
			case Direction.Right:
				this.animationIndex = 3;
				break;
			case Direction.Left:
				this.animationIndex = 2;
				break;
		}
	}
}

class CharacterIdle extends CharacterState {
	static Identifier = "CharacterIdle";
	constructor(sprite) {
		super(CharacterIdle.Identifier, sprite, 4);
		sprite.direction = Direction.Down;
		this.playCount = 0;
	}
	/// Overridden
	update() {
		super.update();
		let maxFrames = 8;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.playCount++;
			this.currentFrame = 0;
		}
		if (this.playCount > 5) {
			const stand = new CharacterStand(this.sprite);
			this.sprite.stateMachine.transition(stand);
		}
	}
}

/// State ot walk in the current direction
class CharacterWalk extends CharacterState {
	static Identifier = "CharacterWalk";
	constructor(sprite) {
		super(CharacterWalk.Identifier, sprite, 5);
	}
	/// Overridden
	update() {
		super.update();
		let maxFrames = 8;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.currentFrame = 0;
		}
	}
	/// Overridden
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

/// State to use the Hoe in the current direction
class CharacterHoe extends CharacterState {
	static Identifier = "CharacterHoe";
	constructor(sprite, count) {
		super(CharacterHoe.Identifier, sprite, 3);
		this.playCount = 0;
		this.count = count;
	}
	/// Overridden
	update() {
		super.update();
		let maxFrames = 8;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.playCount++;
			this.currentFrame = 0;
		}
		if (this.playCount >= this.count) {
			const stand = new CharacterStand(this.sprite);
			this.sprite.stateMachine.transition(stand);
		}
	}
	/// Overridden
	convertDirection() {
		switch (this.direction) {
			case Direction.Down:
				this.animationIndex = 12;
				break;
			case Direction.Up:
				this.animationIndex = 13;
				break;
			case Direction.Right:
				this.animationIndex = 15;
				break;
			case Direction.Left:
				this.animationIndex = 14;
				break;
		}
	}
}

/// State to use the Hoe in the current direction
class CharacterWalkTo extends CharacterState {
	static Identifier = "CharacterWalkTo";
	constructor(sprite, coordinates, astar) {
		super(CharacterWalkTo.Identifier, sprite, 3);
		this.astar = astar;
		const walkFrom = this.sprite.map.coordinatesForPoint(
			this.sprite.currentPosition
		);
		this.astar.findPath(
			walkFrom,
			coordinates,
			function (pathArray) {
				this.walkTo = new SpriteWalkTo(
					this.sprite,
					this.sprite.map,
					pathArray,
					this.completeWalkTo.bind(this)
				);
			}.bind(this)
		);
	}
	completeWalkTo() {
		const stand = new CharacterStand(this.sprite);
		this.sprite.stateMachine.transition(stand);
	}
	render() {
		super.render();
		this.walkTo.update();
	}
	/// Overridden
	update() {
		super.update();
		let maxFrames = 8;
		if (!this.sprite.currentCoordinates.isEqual(this.walkTo.nextInPath)) {
			this.sprite.direction = this.sprite.currentCoordinates.directionTo(
				this.walkTo.nextInPath
			);
			this.direction = this.sprite.direction;
			this.convertDirection();
		}
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.currentFrame = 0;
		}
	}
	/// Overridden
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

import Sprite from "../GameSDK/Sprite.js";
import SpriteState from "../GameSDK/SpriteState.js";
import StateMachine from "../GameSDK/StateMachine.js";
import Util from "../GameSDK/Util.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Size from "../GameSDK/Geometry/Size.js";
import Point from "../GameSDK/Geometry/Point.js";
import AStar from "../GameSDK/AStar/AStar.js";
import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Direction from "../GameSDK/Direction.js";
import SpriteWalkTo from "../GameSDK/SpriteWalkTo.js";

export default class BabyCowSprite extends Sprite {
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
	///		- gridImage: The Grid Image used for display
	///		- canvas: The canvas to draw to
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(gridImage, canvas, tileMap, start, scale) {
		super(gridImage.image, gridImage.frameSize, canvas, tileMap, start);
		this.stateMachine = new BabyCowStateMachine(this);
		this.eatCount = 0;
		this.scale = scale;
		this.astar = new AStar(this.tileMap, this);
		this.debugFrameEnabled = false;
		this.followSprite = null;
	}

	/// Frame that defines the position and size of the sprite
	get frame() {
		const halfSize = this.frameSize / 2;
		const halfTile = this.tileMap.tileSize / 2;
		// Space at the bottom of the sprite
		const offset = 2 * this.scale;
		return new Frame(
			new Point(
				this.currentPosition.x - halfSize,
				this.currentPosition.y - this.frameSize + halfTile + offset
			),
			new Size(this.frameSize, this.frameSize)
		);
	}

	get hitFrame() {
		const frameWidth = this.frame.size.width;
		const frameHeight = this.frame.size.height;
		let frameX = this.frame.origin.x;
		let frameY = this.frame.origin.y;

		const quarterWidth = frameWidth / 4;
		const hitWidth = frameWidth - quarterWidth;
		const hitHeight = frameHeight / 2;

		frameY = frameY + frameHeight - hitHeight;
		frameX = frameX + frameWidth / 2 - hitWidth / 2;

		return new Frame(
			new Point(frameX, frameY),
			new Size(hitWidth, hitHeight)
		);
	}

	touch(touchFrame, isTouchDown) {
		const collided = this.hitFrame.collided(touchFrame);
		if (!collided) {
			return false;
		}
		if (this.stateMachine.isStanding) {
			this.stateMachine.transition(new BabyCowJump(this));
			return true;
		}
		return false;
	}
}

class BabyCowState extends SpriteState {
	constructor(identifier, sprite, frameDelay) {
		super(identifier, sprite, frameDelay);
		this.flipHorizontal = this.sprite.direction === Direction.Left;
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

class BabyWalkTo extends BabyCowState {
	static Identifier = "BabyWalkTo";
	constructor(sprite, coordinates, astar) {
		super(BabyWalkTo.Identifier, sprite, 8);
		this.animationIndex = BabyCowSprite.walk;
		this.coordinates = coordinates;
		this.astar = astar;
		const walkFrom = this.sprite.tileMap.coordinatesForPoint(
			this.sprite.currentPosition
		);
		const followSprite = this.sprite.followSprite;
		if (!followSprite) {
			this.completeWalkTo();
			return;
		}
		this.astar.findPath(
			walkFrom,
			coordinates,
			function (pathArray) {
				this.walkTo = new SpriteWalkTo(
					this.sprite,
					this.sprite.tileMap,
					pathArray,
					this.completeWalkTo.bind(this)
				);
			}.bind(this)
		);
	}

	completeWalkTo() {
		const stand = new BabyCowStand(this.sprite);
		this.sprite.stateMachine.transition(stand);
	}
	render() {
		super.render();
		const followSprite = this.sprite.followSprite;
		if (!followSprite) {
			return;
		}
		const characterCoordinates = followSprite.currentCoordinates;
		this.walkTo.ignoreCoordinates = [characterCoordinates];
		this.walkTo.update();
	}
	update() {
		const followSprite = this.sprite.followSprite;
		if (!followSprite) {
			return;
		}
		const characterCoordinates = followSprite.currentCoordinates;
		const currentCoordinates = this.sprite.currentCoordinates;
		if (!currentCoordinates.isEqual(this.walkTo.nextInPath)) {
			const isLeft =
				this.sprite.currentCoordinates.column >
				characterCoordinates.column;
			this.sprite.direction = isLeft ? Direction.Left : Direction.Right;
			this.flipHorizontal = this.sprite.direction === Direction.Left;
		}
		let maxFrames = 4;
		this.currentFrame++;
		if (this.currentFrame >= maxFrames - 1) {
			this.currentFrame = 0;
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
	get isWalkingTo() {
		return this.currentStateId === BabyWalkTo.Identifier;
	}
	constructor(sprite) {
		super(new BabyCowStand(sprite));
		this.sprite = sprite;
	}
	render() {
		super.render();
		const followSprite = this.sprite.followSprite;
		if (!followSprite) {
			return;
		}
		const characterCoordinates = followSprite.currentCoordinates;
		const cowPosition = this.sprite.currentPosition;
		const cowCoordinates = this.sprite.currentCoordinates;
		const distance = cowCoordinates.distanceTo(characterCoordinates);
		if (distance > 30 && !this.isWalkingTo) {
			this.walkTo(characterCoordinates);
		}
	}

	walkTo(walkTo) {
		const babyCoordinates = new GridCoordinates(walkTo.column, walkTo.row);
		const walkToState = new BabyWalkTo(
			this.sprite,
			babyCoordinates,
			this.sprite.astar
		);
		this.transition(walkToState);
	}
}

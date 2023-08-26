import Point from "../Geometry/Point.js";
import Frame from "../Geometry/Frame.js";
import Size from "../Geometry/Size.js";

/// Class used to manage all the sprites in a map
export default class TiledSpriteManager {
	constructor() {
		this.ignoreListForSprite = function (bySprite) {
			return [];
		};
	}

	/// Method to generate all the needed sprites
	///
	/// - Parameters:
	///		- assetManager: Ued to get assets for generated sprites
	///		- tileMap: The tile map to get sprite info from
	///		- scale: The scale for positioning the sprite
	///		- getSpriteForId: Method called to get the generated sprite
	generateSprites(assetManager, tileMap, scale, getSpriteForId) {
		const spriteObjects = tileMap.spriteObjects;
		this.tileMap = tileMap;
		this.spriteMap = {};
		this.allSprites = [];
		for (const index in spriteObjects) {
			const spriteJSON = spriteObjects[index];
			const gid = spriteJSON.gid;
			const tileSheet = assetManager.tileSheetForGID(gid);
			const id = tileSheet.id;
			const point = new Point(
				Math.floor((spriteJSON.x + spriteJSON.width / 2) * scale),
				Math.floor((spriteJSON.y - spriteJSON.width / 2) * scale),
			);
			const sprite = getSpriteForId(spriteJSON, tileSheet, point);
			if (sprite) {
				sprite.properties = spriteJSON.properties;
				this.spriteMap[sprite.id] = sprite;
				this.allSprites.push(sprite);
			}
		}
	}

	/// Check the walkable layer to see if tiles are walkable
	///
	/// - Parameter coordinates: The coordinates to check
	/// - Parameter bySprite: The sprite to check walkability for.
	/// - Returns: true if the tile is walkable
	isWalkable(coordinates, bySprite) {
		const ignoreList = this.ignoreListForSprite(bySprite);
		const coordPoint = this.tileMap.realPointForCoordinates(coordinates);
		const coordFrame = new Frame(
			coordPoint,
			new Size(this.tileMap.tileSize, this.tileMap.tileSize),
		);
		let coordinatesHasSprite = false;
		let tileArea = this.tileMap.tileSize * this.tileMap.tileSize;
		for (const index in this.allSprites) {
			const sprite = this.allSprites[index];
			const isSameSprite = bySprite.id === sprite.id;
			const shouldIgnore = ignoreList.includes(sprite.id);
			const overlap = sprite.hitFrame.overlapArea(coordFrame);
			const overlapPercent = (overlap / tileArea) * 100;
			// At least 20% overlap
			if (!isSameSprite && !shouldIgnore && overlapPercent > 20) {
				coordinatesHasSprite = true;
			}
		}
		return !coordinatesHasSprite;
	}

	/// Check to see if a given sprite has collided with another sprite
	///
	/// - Parameter sprite: The sprite to check for collisions
	/// - Returns: The sprite that was collided with
	checkForCollision(sprite) {
		let collided = [];
		for (const index in this.allSprites) {
			const checkSprite = this.allSprites[index];
			const isSameSprite = sprite.id === checkSprite.id;
			const hasCollided = sprite.hitFrame.collided(checkSprite.hitFrame);
			if (!isSameSprite && hasCollided) {
				collided.push(checkSprite);
			}
		}
		return collided;
	}

	/// Get a sprite based on its unique id
	///
	/// - Parameter id: The id of the sprite to get
	/// - Returns: The sprite with mathcing id or null
	spriteForId(id) {
		if (!this.spriteMap[id]) {
			return null;
		}
		return this.spriteMap[id];
	}

	touch(touchFrame, isTouchDown) {
		let touchHandled = false;
		for (const index in this.allSprites) {
			const sprite = this.allSprites[index];
			const properties = sprite.properties;
			let isUserInteractionDisabled = false;
			if (properties) {
				isUserInteractionDisabled =
					properties.isUserInteractionDisabled;
			}
			const touched = sprite.touch(touchFrame, isTouchDown);
			if (!isUserInteractionDisabled && touched) {
				touchHandled = true;
			}
		}
		return touchHandled;
	}

	touchMoved(touchFrame, isTouchDown) {
		for (const index in this.allSprites) {
			const sprite = this.allSprites[index];
			sprite.touchMoved(touchFrame, isTouchDown);
		}
	}

	render() {
		this.allSprites.sort(this.sortSprites);
		this.allSprites.forEach(
			function (item, index) {
				if (item.frame.collided(this.tileMap.cameraFrame)) {
					item.render();
				}
			}.bind(this),
		);
	}

	/// Method used to sort sprites by position
	sortSprites(spriteA, spriteB) {
		const aPoint = spriteA.currentPosition;
		const bPoint = spriteB.currentPosition;
		if (aPoint.y > bPoint.y) {
			return 1;
		}
		if (aPoint.y < bPoint.y) {
			return -1;
		}
		return 0;
	}
}

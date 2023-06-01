import Point from "../Geometry/Point.js";

/// Class used to manage all the sprites in a map
export default class TiledSpriteManager {
	constructor() {}

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
		this.sprites = {};
		this.allSprites = [];
		for (const index in spriteObjects) {
			const spriteJSON = spriteObjects[index];
			const gid = spriteJSON.gid;
			const tileSheet = assetManager.tileSheetForGID(gid);
			const id = tileSheet.id;
			const point = new Point(
				Math.floor((spriteJSON.x + spriteJSON.width / 2) * scale),
				Math.floor((spriteJSON.y - spriteJSON.width / 2) * scale)
			);
			const sprite = getSpriteForId(id, tileSheet, point);
			if (!this.sprites[id]) {
				this.sprites[id] = [];
			}
			this.sprites[id].push(sprite);
			this.allSprites.push(sprite);
		}
	}

	/// Get the first sprite available with a specific id
	///
	/// - Parameter id: The id to get the first sprite for
	/// - Returns: The first sprite or null if not found
	firstSpriteForId(id) {
		const selectedSprites = this.sprites[id];
		if (selectedSprites && selectedSprites.length > 0) {
			return selectedSprites[0];
		}
		return null;
	}

	handleTouch(touchFrame) {
		this.touchFrame = touchFrame;
		for (const index in this.allSprites) {
			const sprite = this.allSprites[index];
			if (sprite.hitFrame.collided(touchFrame)) {
				sprite.touch();
				return true;
			}
		}
		return false;
	}

	render() {
		this.allSprites.sort(this.sortSprites);
		this.allSprites.forEach(
			function (item, index) {
				if (item.frame.collided(this.tileMap.cameraFrame)) {
					item.render();
				}
			}.bind(this)
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

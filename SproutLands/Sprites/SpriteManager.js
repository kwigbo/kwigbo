import CowManager from "./CowManager.js";
import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Point from "../GameSDK/Geometry/Point.js";
import Size from "../GameSDK/Geometry/Size.js";
import Alien from "./Alien.js";
import MainCharacter from "./MainCharacter.js";

export default class SpriteManager {
	constructor(tileMap) {
		this.tileMap = tileMap;
	}

	handleTouch(touchFrame) {
		let touchedPlayer = this.characterSprite.frame.collided(touchFrame);
		if (touchedPlayer) {
			this.characterSprite.touch();
			return true;
		}
		// Check for touch collision
		let touchedCow = this.cowManager.checkForCollision(touchFrame);
		if (touchedCow) {
			return true;
		}
		return false;
	}

	isWalkable(coordinates) {
		let point = this.tileMap.realPointForCoordinates(coordinates);
		let frame = new Frame(
			point,
			new Size(this.tileMap.tileSize, this.tileMap.tileSize)
		);
		for (const index in this.cowManager.cows) {
			const cow = this.cowManager.cows[index];
			if (frame.collided(cow.frame)) {
				return false;
			}
		}
		return true;
	}

	createSprites() {
		// Load Cows
		this.cowManager = new CowManager(
			this.tileMap.canvas,
			this.tileMap.cowsLayer,
			this.tileMap,
			this.tileMap.assetManager.scaledTileSize
		);

		this.cowManager.createCows(
			this.tileMap.assetManager.cowAssetManager.cowGridImages,
			this.tileMap.assetManager.cowAssetManager.babyCowGridImages
		);

		const startCoordinates = new GridCoordinates(11, 2);
		const startPoint =
			this.tileMap.centerPointForCoordinates(startCoordinates);
		this.alien = new Alien(
			this.tileMap.assetManager.alienSheet,
			this.tileMap.canvas,
			this.tileMap,
			startPoint
		);

		const characterStart = new GridCoordinates(16, 18);
		const characterPoint =
			this.tileMap.centerPointForCoordinates(characterStart);
		this.tileMap.touchPoint = characterPoint;
		this.characterSprite = new MainCharacter(
			this.tileMap.assetManager.characterSheet,
			this.tileMap.canvas,
			this.tileMap,
			characterPoint
		);

		this.tileMap.scrollTo(this.characterSprite.currentPosition, false);
	}
}

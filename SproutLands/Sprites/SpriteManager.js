import CowManager from "./CowManager.js";
import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Point from "../GameSDK/Geometry/Point.js";
import Size from "../GameSDK/Geometry/Size.js";
import Alien from "./Alien.js";
import MainCharacter from "./MainCharacter.js";
import AStar from "../GameSDK/AStar/AStar.js";
import GridImage from "../GameSDK/GridImage.js";
import GridSize from "../GameSDK/GridUtil/GridSize.js";
import GridArray from "../GameSDK/GridUtil/GridArray.js";
import Util from "../GameSDK/Util.js";

export default class SpriteManager {
	constructor(tileMap, scale, spriteObjects) {
		this.tileMap = tileMap;
		this.scale = scale;
		this.spriteObjects = spriteObjects;
		this.astar = null;
		this.generateAStarDebugImage();
	}

	handleTouch(touchFrame) {
		this.touchFrame = touchFrame;
		let touchedPlayer = this.characterSprite.hitFrame.collided(touchFrame);
		if (touchedPlayer) {
			this.characterSprite.touch();
			return true;
		}
		// Check for touch collision
		let touchedCow = this.cowManager.checkForCollision(touchFrame);
		if (touchedCow) {
			return true;
		}
		const newPoint = touchFrame.origin;
		const walkTo = this.tileMap.coordinatesForPoint(newPoint);
		if (this.tileMap.isWalkable(walkTo)) {
			this.characterSprite.walkTo(walkTo);
			return true;
		}

		return false;
	}

	render() {
		// Debug render the players AStar path
		this.renderAStar();
		this.allSprites.sort(this.sortSprites);
		this.allSprites.forEach(
			function (item, index) {
				if (item.frame.collided(this.tileMap.cameraFrame)) {
					item.render();
				}
			}.bind(this)
		);
	}

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

	renderAStar() {
		if (this.astar && this.astar.debugGridArray && this.debugGridImage) {
			this.tileMap.renderGridImageLayer(
				this.astar.debugGridArray,
				this.debugGridImage
			);
		}
	}

	createSprites() {
		this.allSprites = [];
		// Load Cows
		this.cowManager = new CowManager(
			this.tileMap.canvas,
			this.scale,
			this.spriteObjects,
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

		const characterStart = new GridCoordinates(5, 2);
		const characterPoint =
			this.tileMap.centerPointForCoordinates(characterStart);
		this.tileMap.touchPoint = characterPoint;
		this.characterSprite = new MainCharacter(
			this.tileMap.assetManager.characterSheet,
			this.tileMap.canvas,
			this.tileMap,
			characterPoint
		);
		// this.astar = this.characterSprite.astar;
		// this.astar.debug = true;

		this.allSprites = this.allSprites.concat(this.cowManager.cows);
		this.allSprites = this.allSprites.concat(this.cowManager.babyCows);
		this.allSprites.push(this.characterSprite);
		// this.allSprites.push(this.alien);

		this.tileMap.scrollTo(this.characterSprite.currentPosition, false);
	}

	generateAStarDebugImage() {
		this.debugGridImage = GridImage.coloredTileSheet(
			this.tileMap.tileSize,
			[
				"rgba(255, 255, 255, 0.0)",
				"rgba(255, 255, 255, 0.5)",
				"rgba(238, 75, 43, 0.5)",
				"rgba(0, 0, 255, 0.5)",
			],
			this.tileMap.assetManager.scaler
		);
	}
}

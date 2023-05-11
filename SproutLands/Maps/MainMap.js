import TileMap from "../GameSDK/TileMap.js";
import GridImage from "../GameSDK/GridImage.js";
import GridSize from "../GameSDK/GridUtil/GridSize.js";
import GridArray from "../GameSDK/GridUtil/GridArray.js";
import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Size from "../GameSDK/Geometry/Size.js";
import Point from "../GameSDK/Geometry/Point.js";
import MainLayersCSV from "./CSV/MainLayersCSV.js";
import AssetManager from "../AssetManager/AssetManager.js";
import TileSheetManager from "../AssetManager/TileSheetManager.js";
import SpriteManager from "../Sprites/SpriteManager.js";
import AStar from "../GameSDK/AStar/AStar.js";

export default class MainMap extends TileMap {
	constructor(scale, canvas) {
		let gridSize = new GridSize(25, 25);
		let tileImageScale = 4;
		let tileImageSize = 16;
		let scaledTileSize = tileImageSize * tileImageScale;
		super(canvas, gridSize, tileImageSize * tileImageScale);

		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;

		// Layers
		this.floorLayer = this.createLayer(MainLayersCSV.floorData, gridSize);
		this.bushesLayer = this.createLayer(MainLayersCSV.bushesData, gridSize);
		this.objectsLayer = this.createLayer(
			MainLayersCSV.objectsData,
			gridSize
		);
		this.canopyLayer = this.createLayer(MainLayersCSV.canopyData, gridSize);
		this.cowsLayer = this.createLayer(MainLayersCSV.cowsData, gridSize);

		this.assetManager = new AssetManager(tileImageScale, tileImageSize);
		this.spriteManager = new SpriteManager(this);

		this.astar = new AStar(this);
		this.generateAStarDebugImage();
	}

	updateTouchPoint(point) {
		let newPoint = new Point(
			point.x +
				this.viewPort.origin.x -
				this.canvas.width * 0.5 +
				this.viewPort.size.width * 0.5,
			point.y +
				this.viewPort.origin.y -
				this.canvas.height * 0.5 +
				this.viewPort.size.height * 0.5
		);
		let touchFrame = new Frame(
			new Point(newPoint.x - 10, newPoint.y - 10),
			new Size(20, 20)
		);

		if (!this.spriteManager.handleTouch(touchFrame)) {
			const character = this.spriteManager.characterSprite;
			const characterPosition = character.currentPosition;
			const walkFrom = this.coordinatesForPoint(characterPosition);
			const walkTo = this.coordinatesForPoint(newPoint);
			if (this.isWalkable(walkTo)) {
				this.astar.findPath(
					walkFrom,
					walkTo,
					function (pathArray) {
						this.characterPath = pathArray;
						this.updateCharacterWalkTo();
					}.bind(this)
				);
			}
		} else {
			this.touchPoint = newPoint;
		}
	}

	loadMap() {
		this.assetManager.load(
			function () {
				this.spriteManager.createSprites();
				this.loadComplete = true;
			}.bind(this)
		);
	}

	isWalkable(coordinates) {
		let isSpriteWalkable = this.spriteManager.isWalkable(coordinates);
		let bushesTile = parseInt(this.bushesLayer.getElementAt(coordinates));
		let objectsTile = parseInt(this.objectsLayer.getElementAt(coordinates));
		return bushesTile === -1 && objectsTile === -1 && isSpriteWalkable;
	}

	updateCharacterWalkTo() {
		const mainCharacter = this.spriteManager.characterSprite;
		if (this.characterPath && this.characterPath.length > 0) {
			const nextInPath = this.characterPath[0].coordinates;
			const nextPosition = this.centerPointForCoordinates(nextInPath);
			let newPoint = new Point(
				nextPosition.x +
					this.viewPort.origin.x -
					this.canvas.width * 0.5 +
					this.viewPort.size.width * 0.5,
				nextPosition.y +
					this.viewPort.origin.y -
					this.canvas.height * 0.5 +
					this.viewPort.size.height * 0.5
			);
			this.nextPosition = newPoint;
		}
	}

	walkNext() {
		if (!this.characterPath || this.characterPath.length <= 0) {
			return;
		}
		const mainCharacter = this.spriteManager.characterSprite;
		if (mainCharacter.currentPosition === this.nextPosition) {
			this.characterPath.shift();
			this.updateCharacterWalkTo();
		}
	}

	render() {
		if (!this.loadComplete) {
			return;
		}

		if (this.logFrameRenderTime) {
			console.time();
		}

		const mainCharacter = this.spriteManager.characterSprite;

		// Position the character
		if (this.nextPosition) {
			mainCharacter.moveTo(this.nextPosition);
			this.walkNext();
		}

		// Position the map
		this.scrollTo(mainCharacter.currentPosition, true);

		// Draw the frame
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// Draw base layer
		this.renderMapBaseLayer();
		// Debug render the players AStar path
		this.renderAStar();
		// Draw the character
		mainCharacter.render();
		// Draw the canopy layer
		this.renderCanopyLayer();

		if (this.logFrameRenderTime) {
			console.timeEnd();
		}
	}

	renderCanopyLayer() {
		const tileSheetManager = this.assetManager.tileSheetManager;
		this.spriteManager.cowManager.render();
		this.spriteManager.alien.render();
		this.renderLayer(
			this.canopyLayer,
			tileSheetManager.sheets[TileSheetManager.TreesSheet]
		);
	}

	renderMapBaseLayer() {
		const tileSheetManager = this.assetManager.tileSheetManager;
		this.renderLayer(
			this.floorLayer,
			tileSheetManager.sheets[TileSheetManager.DarkGrassSheet]
		);
		this.renderLayer(
			this.bushesLayer,
			tileSheetManager.sheets[TileSheetManager.BushesSheet]
		);
		this.renderLayer(
			this.objectsLayer,
			tileSheetManager.sheets[TileSheetManager.TreesSheet]
		);
	}

	renderAStar() {
		if (this.astar.debugGridArray && this.debugGridImage) {
			this.renderLayer(this.astar.debugGridArray, this.debugGridImage);
		}
	}

	generateAStarDebugImage() {
		const canvas = this.assetManager.scaler.canvas;
		canvas.width = this.tileSize * 4;
		canvas.height = this.tileSize;
		let tempContext = canvas.getContext("2d");
		tempContext.imageSmoothingEnabled = false;
		tempContext.clearRect(0, 0, canvas.width, canvas.height);
		/// Clear
		tempContext.fillStyle = "rgba(255, 255, 255, 0.0)";
		tempContext.fillRect(0, 0, this.tileSize, this.tileSize);
		/// White
		tempContext.fillStyle = "rgba(255, 255, 255, 0.5)";
		tempContext.fillRect(this.tileSize, 0, this.tileSize, this.tileSize);
		/// Red
		tempContext.fillStyle = "rgba(238, 75, 43, 0.5)";
		tempContext.fillRect(
			this.tileSize * 2,
			0,
			this.tileSize,
			this.tileSize
		);
		/// Blue
		tempContext.fillStyle = "rgba(0, 0, 255, 0.5)";
		tempContext.fillRect(
			this.tileSize * 3,
			0,
			this.tileSize,
			this.tileSize
		);
		let image = new Image();
		image.src = canvas.toDataURL("image/png");
		this.debugGridImage = new GridImage(image, new GridSize(4, 1));
		this.debugGridImage.load(this.assetManager.scaler, function () {});
	}

	createLayer(csvData, gridSize) {
		var array = csvData.trim().split("\n");
		var newString = array.join(",");
		array = newString.split(",");
		let layer = new GridArray(gridSize, 0);
		layer.overwriteElements(array);
		return layer;
	}
}

import TileMap from "../GameSDK/TileMap.js";
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
			/// Handle map touch
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

	render() {
		if (!this.loadComplete) {
			return;
		}

		if (this.logFrameRenderTime) {
			console.time();
		}

		const mainCharacter = this.spriteManager.characterSprite;

		// Position the map
		this.scrollTo(mainCharacter.currentPosition, true);

		// Draw the frame
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// Draw base layer
		this.renderMapBaseLayer();
		// Draw the character
		this.spriteManager.render();
		// Draw the canopy layer
		this.renderCanopyLayer();

		if (this.logFrameRenderTime) {
			console.timeEnd();
		}
	}

	renderCanopyLayer() {
		const tileSheetManager = this.assetManager.tileSheetManager;
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

	createLayer(csvData, gridSize) {
		var array = csvData.trim().split("\n");
		var newString = array.join(",");
		array = newString.split(",");
		let layer = new GridArray(gridSize, 0);
		layer.overwriteElements(array);
		return layer;
	}
}

import TileMap from "../GameSDK/TileMap.js";
import GridSize from "../GameSDK/GridUtil/GridSize.js";
import GridArray from "../GameSDK/GridUtil/GridArray.js";
import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Size from "../GameSDK/Geometry/Size.js";
import Point from "../GameSDK/Geometry/Point.js";
import AssetManager from "../AssetManager/AssetManager.js";
import TileManager from "../AssetManager/TileManager.js";
import SpriteManager from "../Sprites/SpriteManager.js";

export default class MainMap extends TileMap {
	constructor(scale, canvas) {
		let gridSize = new GridSize(50, 50);
		let tileImageScale = 4;
		let tileImageSize = 16;
		let scaledTileSize = tileImageSize * tileImageScale;
		super(canvas, gridSize, tileImageSize * tileImageScale);

		this.spriteRenderIndex = 3;

		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;

		this.loadMapLayers(
			function () {
				this.assetManager = new AssetManager(
					tileImageScale,
					tileImageSize
				);
				this.spriteManager = new SpriteManager(
					this,
					tileImageScale,
					this.spriteObjects
				);
				this.assetManager.load(
					function () {
						this.spriteManager.createSprites();
						this.loadComplete = true;
					}.bind(this)
				);
			}.bind(this)
		);
	}

	async loadMapLayers(complete) {
		this.layers = {};
		await this.loadMapsJSON(
			function (json) {
				const jsonLayers = json["layers"];
				for (const index in jsonLayers) {
					const layer = jsonLayers[index];
					const layerName = layer.name;
					if (layerName !== "Sprites") {
						this.layers[layerName] = {
							layer: this.createLayer(layer.data, this.gridSize),
							name: layerName,
						};
					} else {
						this.spriteObjects = layer.objects;
					}
				}
			}.bind(this)
		);
		complete();
	}

	/// Method used to load a CSV layer map
	///
	/// - Parameters:
	///		- name: The name of the map to load
	/// 	- complete: The Method called when the map is loaded
	async loadMapsJSON(complete) {
		let response = await fetch(`./Maps/MainMap.json`);
		let json = await response.json();
		complete(json);
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

	isWalkable(coordinates) {
		let isSpriteWalkable = this.spriteManager.isWalkable(coordinates);
		const keys = Object.keys(this.layers);
		let isWalkable = true;
		for (const index in keys) {
			const key = keys[index];
			const layerDetails = this.layers[key];
			const layer = layerDetails.layer;
			const layerName = layerDetails.name;
			const isObjects = layerName === "Objects";
			const isFloorBoundaries = layerName === "Floor Boundaries";
			const isBlockable = isObjects || isFloorBoundaries;
			if (layer && isBlockable) {
				const value = parseInt(layer.getElementAt(coordinates));
				if (value !== 0) {
					isWalkable = false;
				}
			}
		}
		return isSpriteWalkable && isWalkable;
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

		const tileManager = this.assetManager.tileManager;
		const keys = Object.keys(this.layers);
		for (const index in keys) {
			const key = keys[index];
			const layer = this.layers[key].layer;
			if (parseInt(index) === this.spriteRenderIndex) {
				// Draw the character
				this.spriteManager.render();
			}
			this.renderLayer(layer, tileManager);
		}

		if (this.logFrameRenderTime) {
			console.timeEnd();
		}
	}

	createLayer(json, gridSize) {
		let layer = new GridArray(gridSize, 0);
		layer.overwriteElements(json);
		return layer;
	}
}

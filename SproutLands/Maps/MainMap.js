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
		let gridSize = new GridSize(25, 25);
		let tileImageScale = 4;
		let tileImageSize = 16;
		let scaledTileSize = tileImageSize * tileImageScale;
		let viewPortSize = new Size(500, 500);
		super(canvas, gridSize, tileImageSize * tileImageScale, viewPortSize);

		this.spriteRenderIndex = 3;

		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;

		this.loadMapLayers(
			function () {
				this.assetManager = new AssetManager(
					tileImageScale,
					tileImageSize,
					this.tileSetsJSON
				);
				this.spriteManager = new SpriteManager(
					this,
					tileImageScale,
					this.spriteObjects
				);
				this.assetManager.load(
					function () {
						this.createWalkablityLayer();
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
				this.tileSetsJSON = json["tilesets"];
				for (const index in jsonLayers) {
					const layer = jsonLayers[index];
					const layerName = layer.name;
					if (layerName == "Sprites") {
						this.spriteObjects = layer.objects;
						this.layers[layerName] = {
							layer: this.createLayer(null, this.gridSize),
							name: layerName,
						};
					} else {
						this.layers[layerName] = {
							layer: this.createLayer(layer.data, this.gridSize),
							name: layerName,
						};
					}
				}
			}.bind(this)
		);
		complete();
	}

	createWalkablityLayer() {
		this.walkablityLayer = new GridArray(this.gridSize, true);
		const columns = this.walkablityLayer.size.columns;
		const rows = this.walkablityLayer.size.rows;
		const layerKeys = Object.keys(this.layers);
		const tileManager = this.assetManager.tileManager;
		for (let column = 0; column < columns; column++) {
			for (let row = 0; row < rows; row++) {
				const currentCoordinates = new GridCoordinates(column, row);
				let isWalkable = true;
				for (const index in layerKeys) {
					const key = layerKeys[index];
					const isCanopy = key === "Canopy";
					const isSprites = key === "Sprites";
					if (!isCanopy && !isSprites) {
						const layer = this.layers[key].layer;
						let tileGID = layer.getElementAt(currentCoordinates);
						let isTileWalkable =
							tileManager.tileGIDIsWalkable(tileGID);
						if (!isTileWalkable) {
							isWalkable = false;
						}
					}
				}
				this.walkablityLayer.setElementAt(
					isWalkable,
					currentCoordinates
				);
			}
		}
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
		let touchFrame = new Frame(
			new Point(point.x - 10, point.y - 10),
			new Size(20, 20)
		);
		touchFrame = this.screenFrameToRealFrame(touchFrame);
		if (!this.spriteManager.handleTouch(touchFrame)) {
			/// Handle map touch
		}
	}

	isWalkable(coordinates) {
		let isSpriteWalkable = this.spriteManager.isWalkable(coordinates);
		let isWalkable = this.walkablityLayer.getElementAt(coordinates);
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

		const realCameraFrame = this.realFrameToScreenFrame(this.cameraFrame);
		context.save();
		this.clipFrame(context, realCameraFrame);

		const tileManager = this.assetManager.tileManager;
		const keys = Object.keys(this.layers);
		for (const index in keys) {
			const key = keys[index];
			const layer = this.layers[key].layer;
			if (key === "Sprites") {
				this.spriteManager.render();
			} else {
				this.renderLayer(layer, tileManager);
			}
		}

		context.restore();
		this.drawFrame(context, realCameraFrame);

		if (this.logFrameRenderTime) {
			console.timeEnd();
		}
	}

	drawFrame(context, cameraFrame) {
		context.strokeStyle = "rgba(0, 0, 0, 0.5)";
		context.lineWidth = 10;
		context.strokeRect(
			cameraFrame.origin.x,
			cameraFrame.origin.y,
			cameraFrame.size.width,
			cameraFrame.size.height
		);
	}

	clipFrame(context, cameraFrame) {
		context.beginPath();
		context.rect(
			cameraFrame.origin.x,
			cameraFrame.origin.y,
			cameraFrame.size.width,
			cameraFrame.size.height
		);
		context.clip();
	}

	drawViewPortDebug(context) {
		const cameraFrame = this.realFrameToScreenFrame(this.cameraFrame);

		context.fillStyle = "rgba(255, 255, 255, 0.1)";
		context.fillRect(
			cameraFrame.origin.x,
			cameraFrame.origin.y,
			cameraFrame.size.width,
			cameraFrame.size.height
		);
		context.strokeRect(
			cameraFrame.origin.x,
			cameraFrame.origin.y,
			cameraFrame.size.width,
			cameraFrame.size.height
		);
	}

	createLayer(json, gridSize) {
		let layer = new GridArray(gridSize, 0);
		if (json) {
			layer.overwriteElements(json);
		}
		return layer;
	}
}

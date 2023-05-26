import TileMap from "../GameSDK/TileMap.js";
import GridSize from "../GameSDK/GridUtil/GridSize.js";
import GridArray from "../GameSDK/GridUtil/GridArray.js";
import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Size from "../GameSDK/Geometry/Size.js";
import Point from "../GameSDK/Geometry/Point.js";
import AssetManager from "../AssetManager/AssetManager.js";
import TileSheetManager from "../AssetManager/TileSheetManager.js";
import SpriteManager from "../Sprites/SpriteManager.js";

export default class MainMap extends TileMap {
	constructor(scale, canvas) {
		let gridSize = new GridSize(50, 50);
		let tileImageScale = 4;
		let tileImageSize = 16;
		let scaledTileSize = tileImageSize * tileImageScale;
		super(canvas, gridSize, tileImageSize * tileImageScale);

		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;

		this.loadMapLayers(
			function () {
				this.assetManager = new AssetManager(
					tileImageScale,
					tileImageSize
				);
				this.spriteManager = new SpriteManager(this);
				this.loadMap();
			}.bind(this)
		);
	}

	async loadMapLayers(complete) {
		this.spriteRenderIndex = 5;
		const layersDetails = {
			Floor: {
				sheet: TileSheetManager.DarkGrassSheet,
				walkable: true,
				source: "Dark Grass Tiles.tsx",
			},
			Water: {
				sheet: TileSheetManager.Water,
				walkable: false,
				source: "Water.tsx",
			},
			"Water Outline": {
				sheet: TileSheetManager.WaterOutline,
				walkable: true,
				source: "Dark Grass Water.tsx",
			},
			Sprites: { sheet: null, walkable: true, source: "Brown Cow.tsx" },
			Bushes: {
				sheet: TileSheetManager.BushesSheet,
				walkable: false,
				source: "Bushes.tsx",
			},
			Objects: {
				sheet: TileSheetManager.TreesSheet,
				walkable: false,
				source: "Trees.tsx",
			},
			Canopy: {
				sheet: TileSheetManager.TreesSheet,
				walkable: true,
				source: "Trees.tsx",
			},
		};
		this.layers = {};
		await this.loadMapsJSON(
			function (json) {
				const tileSheets = json["tilesets"];
				const jsonLayers = json["layers"];
				for (const index in jsonLayers) {
					const layer = jsonLayers[index];
					const layerName = layer.name;
					const layerDetails = layersDetails[layerName];
					const tileSheetSource = layerDetails.source;
					let firstgid = 0;
					for (const index in tileSheets) {
						const sheet = tileSheets[index];
						if (tileSheetSource === sheet.source) {
							firstgid = sheet.firstgid;
							continue;
						}
					}
					this.layers[layerName] = {
						layer: this.createLayer(
							layer.data,
							this.gridSize,
							firstgid
						),
						sheetName: layerDetails.sheet,
						walkable: layerDetails.walkable,
					};
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
		let isUnWalkable = false;
		for (const index in this.layers) {
			const layer = this.layers[index].layer;
			const isWalkable = this.layers[index].walkable;
			if (layer && !isWalkable) {
				const value = parseInt(layer.getElementAt(coordinates));
				if (value !== -1) {
					isUnWalkable = true;
				}
			}
		}
		return isSpriteWalkable && !isUnWalkable;
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

		const tileSheetManager = this.assetManager.tileSheetManager;
		const keys = Object.keys(this.layers);
		for (const index in keys) {
			const key = keys[index];
			const layer = this.layers[key].layer;
			const tileSheetName = this.layers[key].sheetName;
			if (parseInt(index) === this.spriteRenderIndex) {
				// Draw the character
				this.spriteManager.render();
			}
			if (layer && tileSheetName) {
				const tileSheet = tileSheetManager.sheets[tileSheetName];
				if (tileSheet && layer) {
					this.renderLayer(layer, tileSheet);
				}
			}
		}

		if (this.logFrameRenderTime) {
			console.timeEnd();
		}
	}

	createLayer(json, gridSize, firstGID) {
		let realArray = [];
		for (const index in json) {
			const item = parseInt(json[index]);
			if (item === 0) {
				realArray.push(-1);
			} else {
				realArray.push(item - firstGID);
			}
		}
		let layer = new GridArray(gridSize, 0);
		layer.overwriteElements(realArray);
		return layer;
	}
}

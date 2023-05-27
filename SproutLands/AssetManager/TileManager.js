import GridSize from "../GameSDK/GridUtil/GridSize.js";
import GridImage from "../GameSDK/GridImage.js";
import TileSheetManager from "../GameSDK/TileSheetManager.js";

/// Tile sheet manager that loads and scales tile assets
export default class TileManager extends TileSheetManager {
	/// Key for the dark grass tile sheet
	static DarkGrassSheet = "darkGrass";
	/// Key for the bushes tile sheet
	static BushesSheet = "bushes";
	/// Key for the trees tile sheet
	static TreesSheet = "trees";
	/// Key for the waters edge tiles
	static WaterOutline = "waterOutline";
	/// Key for the water tiles
	static Water = "water";

	/// Create a new tile sheet manager
	///
	/// - Parameters:
	///		- assetScaler: The AssetScaler to use when resizing the tiles
	///		- scale: The scale to use for the tiles
	constructor(assetScaler, scale) {
		super();
		this.isLoaded = false;
		this.sheetsDetails = {};
		this.sheetsDetails[TileManager.DarkGrassSheet] = {
			path: "./AssetManager/Assets/Tiles/Dark Grass Tiles.png",
			gridSize: new GridSize(11, 7),
			startGID: 1,
		};
		this.sheetsDetails[TileManager.BushesSheet] = {
			path: "./AssetManager/Assets/Tiles/Bush Tiles.png",
			gridSize: new GridSize(11, 12),
			startGID: 78,
		};
		this.sheetsDetails[TileManager.TreesSheet] = {
			path: "./AssetManager/Assets/Tiles/Trees Bushes.png",
			gridSize: new GridSize(12, 7),
			startGID: 210,
		};
		this.sheetsDetails[TileManager.WaterOutline] = {
			path: "./AssetManager/Assets/Tiles/Dark Grass Water Animated.png",
			gridSize: new GridSize(9, 8),
			startGID: 294,
		};
		this.sheetsDetails[TileManager.Water] = {
			path: "./AssetManager/Assets/Tiles/Water.png",
			gridSize: new GridSize(4, 1),
			startGID: 366,
		};
		this.sheets = {};
		this.loadedSheets = 0;
		this.assetScaler = assetScaler;
		this.scale = scale;
	}

	/// Get the tile sheet need for the given GID
	///
	/// - Parameter gid: The gid to get the tile sheet for
	/// - Returns: The sheet or null if not found
	tileSheetForGID(gid) {
		const keys = Object.keys(this.sheets);
		for (const index in keys) {
			const key = keys[index];
			const sheet = this.sheets[key];
			if (gid < sheet.endGID && gid >= sheet.startGID) {
				return sheet;
			}
		}
		return null;
	}

	/// Method it initiate the load/scale of the tile sheets
	///
	/// - Parameter complete: The function called when loading is complete
	load(complete) {
		this.complete = complete;
		this.loadNextSheet();
	}

	/// Method used to load the next tile sheet
	loadNextSheet() {
		const sheetkeys = Object.keys(this.sheetsDetails);
		const totalSheets = sheetkeys.length;
		const nextSheetKey = sheetkeys[this.loadedSheets];
		this.loadSheet(
			nextSheetKey,
			this.sheetsDetails[nextSheetKey],
			function () {
				this.loadedSheets++;
				if (this.loadedSheets < totalSheets) {
					this.loadNextSheet();
				} else {
					this.isLoaded = true;
					this.complete();
				}
			}.bind(this)
		);
	}

	/// Method to load an individual tile sheet
	///
	/// - Parameters:
	///		- key: The key for the sheet to load
	///		- details: The details for the sheet to load
	///		- complete: The function called when the sheet is loaded.
	loadSheet(key, details, complete) {
		let image = new Image();
		image.src = details["path"];
		let gridImage = new GridImage(
			image,
			details.gridSize,
			this.scale,
			details.startGID
		);
		this.sheets[key] = gridImage;
		gridImage.load(
			this.assetScaler,
			function () {
				complete();
			}.bind(this)
		);
	}
}

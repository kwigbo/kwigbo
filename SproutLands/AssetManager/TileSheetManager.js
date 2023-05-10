import GridSize from "../GameSDK/GridSize.js";
import GridImage from "../GameSDK/GridImage.js";

/// Tile sheet manager that loads and scales tile assets
export default class TileSheetManager {
	/// Key for the dark grass tile sheet
	static DarkGrassSheet = "darkGrass";
	/// Key for the bushes tile sheet
	static BushesSheet = "bushes";
	/// Key for the trees tile sheet
	static TreesSheet = "trees";

	/// Create a new tile sheet manager
	///
	/// - Parameters:
	///		- assetScaler: The AssetScaler to use when resizing the tiles
	///		- scale: The scale to use for the tiles
	constructor(assetScaler, scale) {
		this.isLoaded = false;
		this.sheetsDetails = {};
		this.sheetsDetails[TileSheetManager.DarkGrassSheet] = {
			path: "./AssetManager/Assets/Tiles/Dark Grass Tiles.png",
			gridSize: new GridSize(11, 7),
		};
		this.sheetsDetails[TileSheetManager.BushesSheet] = {
			path: "./AssetManager/Assets/Tiles/Bush Tiles.png",
			gridSize: new GridSize(11, 12),
		};
		this.sheetsDetails[TileSheetManager.TreesSheet] = {
			path: "./AssetManager/Assets/Tiles/Trees Bushes.png",
			gridSize: new GridSize(12, 7),
		};
		this.sheets = {};
		this.loadedSheets = 0;
		this.assetScaler = assetScaler;
		this.scale = scale;
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
		let gridImage = new GridImage(image, details["gridSize"], this.scale);
		this.sheets[key] = gridImage;
		gridImage.load(
			this.assetScaler,
			function () {
				complete();
			}.bind(this)
		);
	}
}

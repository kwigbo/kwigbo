import GridSize from "../GameSDK/GridUtil/GridSize.js";
import GridImage from "../GameSDK/GridImage.js";
import TileSheetManager from "../GameSDK/TileSheetManager.js";

/// Tile sheet manager that loads and scales tile assets
export default class TileManager extends TileSheetManager {
	/// Create a new tile sheet manager
	///
	/// - Parameters:
	///		- assetScaler: The AssetScaler to use when resizing the tiles
	///		- scale: The scale to use for the tiles
	///		- tileSetsJSON: Detailsused to load all the needed tile sheets
	constructor(assetScaler, scale, tileSetsJSON) {
		super();
		this.isLoaded = false;
		this.sheetsDetails = {};
		for (const index in tileSetsJSON) {
			const tileSet = tileSetsJSON[index];
			// Ignore sprites here
			if (!tileSet.name.includes("Cow")) {
				const pathArray = tileSet.image.split("/");
				const fileName = pathArray[pathArray.length - 1];
				this.sheetsDetails[tileSet.name] = {
					path: `./AssetManager/Assets/Tiles/${fileName}`,
					gridSize: new GridSize(
						tileSet.imagewidth / tileSet.tilewidth,
						tileSet.imageheight / tileSet.tileheight
					),
					startGID: tileSet.firstgid,
				};
			}
		}

		this.sheets = {};
		this.loadedSheets = 0;
		this.assetScaler = assetScaler;
		this.scale = scale;
	}

	tileGIDIsWalkable(gid) {
		const tileSheet = this.tileSheetForGID(gid);
		if (tileSheet) {
			switch (tileSheet.id) {
				case "Water":
					return false;
				case "DarkGreenBushs":
					return false;
			}
		}
		return true;
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
		image.src = details.path;
		let gridImage = new GridImage(
			image,
			details.gridSize,
			this.scale,
			details.startGID,
			key
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

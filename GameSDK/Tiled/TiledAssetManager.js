import AssetScaler from "../AssetScaler.js";
import GridImage from "../GridImage.js";
import GridSize from "../GridUtil/GridSize.js";

/// Class used to load and scale assets
export default class TiledAssetManager {
	/// Initialize an asset manager
	///
	/// - Parameters
	///		- onAssetsLoaded: Method called when all assets are loaded
	///		- assetRootPath: The root path to look for assets in
	constructor(onAssetsLoaded, assetRootPath) {
		this.assetScaler = new AssetScaler();
		this.onAssetsLoaded = onAssetsLoaded;
		this.assetRootPath = assetRootPath;
	}

	/// Get the tile sheet need for the given GID
	///
	/// - Parameter gid: The gid to get the tile sheet for
	/// - Returns: The sheet or null if not found
	tileSheetForGID(gid) {
		const keys = Object.keys(this.tileSheets);
		for (const index in keys) {
			const key = keys[index];
			const sheet = this.tileSheets[key];
			if (gid < sheet.endGID && gid >= sheet.startGID) {
				return sheet;
			}
		}
		return null;
	}

	/// Initialize an asset manager
	///
	/// - Parameters:
	///		- tileScale: The scale of the tile images
	///		- tileSize: The unscaled title size
	///		- json: Detailsused to load all the needed tile sheets
	loadTileSets(tileScale, tileSize, json) {
		this.tileScale = tileScale;
		this.tileSize = tileSize;
		this.scaledTileSize = tileSize * tileScale;
		this.sheetsDetails = {};
		for (const index in json) {
			const tileSet = json[index];
			const pathArray = tileSet.image.split("/");
			const fileName = pathArray[pathArray.length - 1];
			this.sheetsDetails[tileSet.name] = {
				path: `${this.assetRootPath}${fileName}`,
				gridSize: new GridSize(
					tileSet.imagewidth / tileSet.tilewidth,
					tileSet.imageheight / tileSet.tileheight
				),
				startGID: tileSet.firstgid,
			};
		}

		this.tileSheets = {};
		this.loadedSheets = 0;
		this.scale = tileScale;
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
					this.onAssetsLoaded();
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
		this.tileSheets[key] = gridImage;
		gridImage.load(
			this.assetScaler,
			function () {
				complete();
			}.bind(this)
		);
	}
}

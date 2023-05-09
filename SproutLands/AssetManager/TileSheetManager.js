class TileSheetManager {
	static DarkGrassSheet = "darkGrass";
	static BushesSheet = "bushes";
	static TreesSheet = "trees";
	constructor(assetScaler, tileSize, scale) {
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
		this.tileSize = tileSize;
		this.scale = scale;
	}
	load(complete) {
		this.complete = complete;
		this.loadNextSheet();
	}
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

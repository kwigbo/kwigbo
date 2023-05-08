class TileSheetManager {
	static DarkGrassSheet = "darkGrass";
	static BushesSheet = "bushes";
	static TreesSheet = "trees";
	constructor(assetScaler, tileSize, scale) {
		this.isLoaded = false;
		this.sheetsPaths = {};
		this.sheetsPaths[TileSheetManager.DarkGrassSheet] =
			"./Assets/Tiles/Dark Grass Tiles.png";
		this.sheetsPaths[TileSheetManager.BushesSheet] =
			"./Assets/Tiles/Bush Tiles.png";
		this.sheetsPaths[TileSheetManager.TreesSheet] =
			"./Assets/Tiles/Trees Bushes.png";
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
		const sheetkeys = Object.keys(this.sheetsPaths);
		const totalSheets = sheetkeys.length;
		const nextSheetKey = sheetkeys[this.loadedSheets];
		this.loadSheet(
			nextSheetKey,
			this.sheetsPaths[nextSheetKey],
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
	loadSheet(key, path, complete) {
		let image = new Image();
		image.src = path;
		this.assetScaler.scaleImage(
			image,
			this.scale,
			function (scaledImage) {
				const scaledWidth = image.width * this.scale;
				const scaledHeight = image.height * this.scale;
				let realTileSize = this.tileSize * this.scale;
				const sheet = new TileSheet(
					scaledImage,
					realTileSize,
					new Size(scaledWidth, scaledHeight)
				);
				this.sheets[key] = sheet;
				complete();
			}.bind(this)
		);
	}
}

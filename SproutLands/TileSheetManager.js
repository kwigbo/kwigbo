class TileSheetManager {
	static DarkGrassSheet = "darkGrass";
	static BushesSheet = "bushes";
	static TreesSheet = "trees";
	constructor(assetScaler) {
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
			4,
			function (scaledImage) {
				const scaledWidth = image.width * 4;
				const scaledHeight = image.height * 4;
				let realTileSize = 16 * 4;
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

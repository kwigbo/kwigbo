/// Class used to load and scale Sproutlands assets
class AssetManager {
	/// Initialize an asset manager
	///
	/// - Parameters:
	///		- tileImageScale: The scale of the tile images
	///		- tileImageSize: The unscaled title size
	constructor(tileImageScale, tileImageSize) {
		this.tileImageScale = tileImageScale;
		this.tileImageSize = tileImageSize;
		this.scaledTileSize = tileImageSize * tileImageScale;
		this.scaler = new AssetScaler();
		this.cowAssetManager = new CowAssetManager(tileImageScale, this.scaler);
		// Load tiles
		this.tileSheetManager = new TileSheetManager(
			this.scaler,
			tileImageSize,
			tileImageScale
		);
		this.loadCalls = [
			this.loadCowAssets.bind(this),
			this.loadTileSheets.bind(this),
			this.loadMainCharacterAssets.bind(this),
			this.loadAlienAssets.bind(this),
		];
	}

	/// Method used to trigger the load of all assets
	///
	/// - Parameter complete: The function called when all loading is done
	load(complete) {
		this.complete = complete;
		this.loadNext();
	}

	/// Method used to load the next asset
	loadNext() {
		if (this.loadCalls.length === 0) {
			this.complete();
			return;
		}
		const nextCall = this.loadCalls.pop();
		nextCall(
			function () {
				this.loadNext();
			}.bind(this)
		);
	}

	/// Method used to trigger the load of the cows
	///
	/// - Parameter complete: The function called when cows are loaded
	loadCowAssets(complete) {
		this.cowAssetManager.load(
			function () {
				complete();
			}.bind(this)
		);
	}

	/// Method used to trigger the load of the tiles
	///
	/// - Parameter complete: The function called when tiles are loaded
	loadTileSheets(complete) {
		this.tileSheetManager.load(
			function () {
				complete();
			}.bind(this)
		);
	}

	/// Method used to trigger the load of the main character
	///
	/// - Parameter complete: The function called when character is loaded
	loadMainCharacterAssets(complete) {
		const characterSheet = new Image();
		characterSheet.src = "./Assets/Character.png";
		const gridImage = new GridImage(
			characterSheet,
			new GridSize(8, 24),
			this.tileImageScale
		);
		gridImage.load(
			this.scaler,
			function () {
				this.characterSheet = gridImage;
				complete();
			}.bind(this)
		);
	}

	/// Method used to trigger the load of the alien
	///
	/// - Parameter complete: The function called when alien is loaded
	loadAlienAssets(complete) {
		let sheet = new Image();
		sheet.src = "./Assets/Alien.png";
		const gridImage = new GridImage(
			sheet,
			new GridSize(10, 1),
			this.tileImageScale
		);
		gridImage.load(
			this.scaler,
			function () {
				this.alienSheet = gridImage;
				complete();
			}.bind(this)
		);
	}
}

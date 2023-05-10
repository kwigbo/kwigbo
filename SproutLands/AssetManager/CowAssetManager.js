import GridSize from "../GameSDK/GridUtil/GridSize.js";
import GridImage from "../GameSDK/GridImage.js";

/// Asset manager used to load all cow assets
export default class CowAssetManager {
	/// Initialize a new cow asset manager
	///
	/// - Parameters:
	///		- scale: The scale at which to load the assets at
	///		- scaler: The AssetScaler used to scale the cows
	constructor(scale, scaler) {
		this.scale = scale;
		this.assetScaler = scaler;
		this.cowGridImages = [];
		this.babyCowGridImages = [];
	}

	/// Method used to start the load/scale of the cows
	///
	/// - Parameter complete: Function called when load/scale is complete
	load(complete) {
		this.complete = complete;
		const colors = ["Pink", "Green", "Light", "Brown", "Purple"];
		this.cowGridImages = [];
		this.babyCowGridImages = [];
		let totalLoaded = 0;
		const maxToLoad = colors.length * 2;
		for (let i = 0; i < colors.length; i++) {
			this.loadAsset(
				this.assetScaler,
				`./AssetManager/Assets/Cow/${colors[i]} Cow.png`,
				new GridSize(8, 8),
				function (gridImage) {
					this.cowGridImages.push(gridImage);
					totalLoaded++;
					if (totalLoaded === maxToLoad) {
						this.complete();
					}
				}.bind(this)
			);

			this.loadAsset(
				this.assetScaler,
				`./AssetManager/Assets/Cow/Baby ${colors[i]} Cow.png`,
				new GridSize(8, 9),
				function (gridImage) {
					this.babyCowGridImages.push(gridImage);
					totalLoaded++;
					if (totalLoaded === maxToLoad) {
						this.complete();
					}
				}.bind(this)
			);
		}
	}

	/// Load an individual cow asset
	///
	/// - Parameters:
	///		- scaler: The scaler to use
	///		- path: The path of the image asset
	///		- gridSize: The expected GridSize of the asset
	///		- complete: Function called when the asset is loaded
	loadAsset(scaler, path, gridSize, complete) {
		const image = new Image();
		image.src = path;
		const gridImage = new GridImage(image, gridSize, this.scale);
		gridImage.load(
			scaler,
			function () {
				complete(gridImage);
			}.bind(this)
		);
	}
}

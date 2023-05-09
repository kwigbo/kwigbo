class CowAssetManager {
	constructor(scale, scaler) {
		this.scale = scale;
		this.assetScaler = scaler;
		this.cowGridImages = [];
		this.babyCowGridImages = [];
	}
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

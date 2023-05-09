class CowManager {
	constructor(scale, canvas, layer, map, scaler, tileSize) {
		this.scale = scale;
		this.canvas = canvas;
		this.layer = layer;
		this.map = map;
		this.cowGridImages = [];
		this.babyCowGridImages = [];
		this.cows = [];
		this.tileSize = tileSize;
		this.assetScaler = scaler;
	}
	render() {
		this.cows.forEach(function (item, index) {
			item.render();
		});
	}
	checkForCollision(touchFrame) {
		for (let i = 0; i < this.cows.length; i++) {
			let cow = this.cows[i];
			if (cow.isOnscreen) {
				let frame = cow.frame;
				if (frame.collided(touchFrame)) {
					cow.touch();
					return true;
				}
			}
		}
		return false;
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
				`./Assets/Cow/${colors[i]} Cow.png`,
				new GridSize(8, 8),
				function (gridImage) {
					this.cowGridImages.push(gridImage);
					totalLoaded++;
					if (totalLoaded === maxToLoad) {
						this.createCows();
					}
				}.bind(this)
			);

			this.loadAsset(
				this.assetScaler,
				`./Assets/Cow/Baby ${colors[i]} Cow.png`,
				new GridSize(8, 9),
				function (gridImage) {
					this.babyCowGridImages.push(gridImage);
					totalLoaded++;
					if (totalLoaded === maxToLoad) {
						this.createCows();
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
	createCows() {
		this.cows = [];
		for (let column = 0; column < this.layer.size.columns; column++) {
			for (let row = 0; row < this.layer.size.rows; row++) {
				let tileIndex = parseInt(
					this.layer.getElementAt(new GridCoordinates(column, row))
				);
				if (tileIndex !== -1) {
					let startX = column * this.tileSize;
					let startY = row * this.tileSize;
					let startPoint = new Point(startX, startY);
					if (tileIndex === 5) {
						let babyCow = new BabyCowSprite(
							this.babyCowGridImages,
							this.canvas,
							this.map,
							startPoint
						);
						this.cows.push(babyCow);
					} else {
						let cow = new CowSprite(
							this.cowGridImages,
							this.canvas,
							this.map,
							startPoint
						);
						this.cows.push(cow);
					}
				}
			}
		}
		this.complete();
	}
}

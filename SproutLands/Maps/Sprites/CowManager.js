class CowManager {
	constructor(canvas, layer, map, scaler) {
		this.canvas = canvas;
		this.layer = layer;
		this.map = map;
		this.cowSheets = [];
		this.babyCowSheets = [];
		this.cows = [];
		/// TODO: Remove when scale is standard
		this.scaledTileSize = 16 * 4;
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
	load() {
		const colors = ["Pink", "Green", "Light", "Brown", "Purple"];
		this.cowSheets = [];
		this.babyCowSheets = [];
		let totalLoaded = 0;
		const maxToLoad = colors.length * 2;
		for (let i = 0; i < colors.length; i++) {
			const cowSheet = new Image();
			cowSheet.src = `./Assets/Cow/${colors[i]} Cow.png`;
			this.assetScaler.scaleImage(
				cowSheet,
				4,
				function (scaledImage) {
					this.cowSheets.push(scaledImage);
					totalLoaded++;
					if (totalLoaded === maxToLoad) {
						this.createCows();
					}
				}.bind(this)
			);
			let babyCowSheet = new Image();
			babyCowSheet.src = `./Assets/Cow/Baby ${colors[i]} Cow.png`;
			this.assetScaler.scaleImage(
				babyCowSheet,
				4,
				function (scaledImage) {
					this.babyCowSheets.push(scaledImage);
					totalLoaded++;
					if (totalLoaded === maxToLoad) {
						this.createCows();
					}
				}.bind(this)
			);
		}
	}
	createCows() {
		this.cows = [];
		for (let column = 0; column < this.layer.size.columns; column++) {
			for (let row = 0; row < this.layer.size.rows; row++) {
				let tileIndex = parseInt(
					this.layer.getElementAt(new GridCoordinates(column, row))
				);
				if (tileIndex !== -1) {
					let startX = column * this.scaledTileSize;
					let startY = row * this.scaledTileSize;
					let startPoint = new Point(startX, startY);
					if (tileIndex === 5) {
						let babyCow = new BabyCowSprite(
							this.babyCowSheets,
							this.canvas,
							this.map,
							startPoint
						);
						this.cows.push(babyCow);
					} else {
						let cow = new CowSprite(
							this.cowSheets,
							this.canvas,
							this.map,
							startPoint
						);
						this.cows.push(cow);
					}
				}
			}
		}
	}
}

class MainMap extends TileMap {
	constructor(scale, canvas) {
		let gridSize = new GridSize(25, 25);
		let tileImageScale = 8;
		let tileImageSize = 16;
		let scaledTileSize = tileImageSize * tileImageScale;
		super(canvas, gridSize, tileImageSize * tileImageScale);

		this.assetManager = new AssetManager(tileImageScale, tileImageSize);

		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;

		// Layers
		this.floorLayer = this.createLayer(MainLayersCSV.floorData, gridSize);
		this.bushesLayer = this.createLayer(MainLayersCSV.bushesData, gridSize);
		this.objectsLayer = this.createLayer(
			MainLayersCSV.objectsData,
			gridSize
		);
		this.canopyLayer = this.createLayer(MainLayersCSV.canopyData, gridSize);
		this.cowsLayer = this.createLayer(MainLayersCSV.cowsData, gridSize);
	}

	updateTouchPoint(point) {
		let newPoint = new Point(
			point.x +
				this.viewPort.origin.x -
				this.canvas.width * 0.5 +
				this.viewPort.size.width * 0.5,
			point.y +
				this.viewPort.origin.y -
				this.canvas.height * 0.5 +
				this.viewPort.size.height * 0.5
		);
		let touchFrame = new Frame(
			new Point(newPoint.x - 10, newPoint.y - 10),
			new Size(20, 20)
		);
		let touchedPlayer = this.characterSprite.frame.collided(touchFrame);
		if (touchedPlayer) {
			this.characterSprite.touch();
		}
		// Check for touch collision
		let touchedCow = this.cowManager.checkForCollision(touchFrame);
		if (!touchedCow && !touchedPlayer) {
			this.touchPoint = newPoint;
		}
	}

	loadMap() {
		this.assetManager.load(
			function () {
				this.createSprites();
				this.loadComplete = true;
			}.bind(this)
		);
	}

	createSprites() {
		// Load Cows
		this.cowManager = new CowManager(
			this.canvas,
			this.cowsLayer,
			this,
			this.assetManager.scaledTileSize
		);

		this.cowManager.createCows(
			this.assetManager.cowAssetManager.cowGridImages,
			this.assetManager.cowAssetManager.babyCowGridImages
		);

		const startCoordinates = new GridCoordinates(11, 2);
		const startPoint = this.positionForCoordinates(startCoordinates);
		this.alien = new Alien(
			this.assetManager.alienSheet,
			this.canvas,
			this,
			startPoint
		);

		const characterStart = new GridCoordinates(16, 18);
		const characterPoint = this.positionForCoordinates(characterStart);
		this.touchPoint = characterPoint;
		this.characterSprite = new MainCharacter(
			this.assetManager.characterSheet,
			this.canvas,
			this,
			characterPoint
		);

		this.scrollTo(this.characterSprite.currentPosition, false);
	}

	createLayer(data, gridSize) {
		var array = data.trim().split("\n");
		var newString = array.join(",");
		array = newString.split(",");
		let layer = new GridArray(gridSize, 0);
		layer.overwriteElements(array);
		return layer;
	}

	isWalkable(coordinates) {
		let bushesTile = parseInt(this.bushesLayer.getElementAt(coordinates));
		let objectsTile = parseInt(this.objectsLayer.getElementAt(coordinates));
		return bushesTile === -1 && objectsTile === -1;
	}

	render() {
		if (!this.loadComplete) {
			return;
		}

		if (this.logFrameRenderTime) {
			console.time();
		}

		// Position the character
		this.characterSprite.moveTo(this.touchPoint);
		// Position the map
		this.scrollTo(this.characterSprite.currentPosition, true);

		// Draw the frame
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// Draw base layer
		this.renderMapBaseLayer();
		// Draw the character
		this.characterSprite.render();
		// Draw the canopy layer
		this.renderCanopyLayer();

		if (this.logFrameRenderTime) {
			console.timeEnd();
		}
	}

	renderCanopyLayer() {
		const tileSheetManager = this.assetManager.tileSheetManager;
		this.cowManager.render();
		this.alien.render();
		this.renderLayer(
			this.canopyLayer,
			tileSheetManager.sheets[TileSheetManager.TreesSheet]
		);
	}

	renderMapBaseLayer() {
		const tileSheetManager = this.assetManager.tileSheetManager;
		this.renderLayer(
			this.floorLayer,
			tileSheetManager.sheets[TileSheetManager.DarkGrassSheet]
		);
		this.renderLayer(
			this.bushesLayer,
			tileSheetManager.sheets[TileSheetManager.BushesSheet]
		);
		this.renderLayer(
			this.objectsLayer,
			tileSheetManager.sheets[TileSheetManager.TreesSheet]
		);
	}
}

class MainMap extends TileMap {
	constructor(scale, canvas) {
		let gridSize = new GridSize(25, 25);
		let tileImageScale = 4;
		let tileImageSize = 16;
		super(canvas, gridSize, tileImageSize * tileImageScale);

		this.tileImageScale = tileImageScale;
		this.tileImageSize = tileImageSize;

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

		this.cowsLoaded = false;
		this.tilesLoaded = false;
		this.characterLoaded = false;
		this.alienLoaded = false;
		this.positionInitialized = false;
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
		const assetScaler = new AssetScaler();
		this.loadAlien(
			assetScaler,
			function () {
				this.alienLoaded = true;
			}.bind(this)
		);
		// Load Cows
		this.cowManager = new CowManager(
			this.tileImageScale,
			this.canvas,
			this.cowsLayer,
			this,
			assetScaler,
			this.tileSize
		);
		this.cowManager.load(
			function () {
				this.cowsLoaded = true;
			}.bind(this)
		);
		// Load tiles
		this.tileSheetManager = new TileSheetManager(
			assetScaler,
			this.tileImageSize,
			this.tileImageScale
		);
		this.tileSheetManager.load(
			function () {
				this.tilesLoaded = true;
			}.bind(this)
		);
		// Load character
		this.loadMainCharacter(
			assetScaler,
			function () {
				this.characterLoaded = true;
			}.bind(this)
		);
	}

	loadAlien(scaler, complete) {
		const startCoordinates = new GridCoordinates(11, 2);
		const startPoint = this.positionForCoordinates(startCoordinates);
		let sheet = new Image();
		sheet.src = "./Assets/Alien.png";
		const gridImage = new GridImage(
			sheet,
			new GridSize(10, 1),
			this.tileImageScale
		);
		gridImage.load(
			scaler,
			function () {
				this.alien = new Alien(
					gridImage,
					this.canvas,
					this,
					startPoint
				);
				complete();
			}.bind(this)
		);
	}

	loadMainCharacter(scaler, complete) {
		const startCoordinates = new GridCoordinates(16, 18);
		const startPoint = this.positionForCoordinates(startCoordinates);
		this.touchPoint = startPoint;
		const characterSheet = new Image();
		characterSheet.src = "./Assets/Character.png";
		const gridImage = new GridImage(
			characterSheet,
			new GridSize(8, 24),
			this.tileImageScale
		);
		gridImage.load(
			scaler,
			function () {
				this.characterSprite = new MainCharacter(
					gridImage,
					this.canvas,
					this,
					startPoint
				);
				complete();
			}.bind(this)
		);
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

	get assetsLoaded() {
		return (
			this.cowsLoaded &&
			this.tilesLoaded &&
			this.characterLoaded &&
			this.alienLoaded
		);
	}

	logFrameRenderTime = false;

	render() {
		if (!this.assetsLoaded || !this.positionInitialized) {
			if (this.assetsLoaded && !this.positionInitialized) {
				this.scrollTo(this.characterSprite.currentPosition, false);
				this.positionInitialized = true;
			}
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
		this.cowManager.render();
		this.alien.render();
		this.renderLayer(
			this.canopyLayer,
			this.tileSheetManager.sheets[TileSheetManager.TreesSheet]
		);
	}

	renderMapBaseLayer() {
		this.renderLayer(
			this.floorLayer,
			this.tileSheetManager.sheets[TileSheetManager.DarkGrassSheet]
		);
		this.renderLayer(
			this.bushesLayer,
			this.tileSheetManager.sheets[TileSheetManager.BushesSheet]
		);
		this.renderLayer(
			this.objectsLayer,
			this.tileSheetManager.sheets[TileSheetManager.TreesSheet]
		);
	}
}

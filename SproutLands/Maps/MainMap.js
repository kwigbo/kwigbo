class MainMap extends TileMap {
	constructor(scale, canvas) {
		let gridSize = new GridSize(25, 25);
		super(scale, canvas, gridSize, 16);

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

		let grassTilesImage = new Image();
		grassTilesImage.src = "./Assets/Tiles/Dark Grass Tiles.png";
		this.grassTiles = new TileSheet(
			grassTilesImage,
			16,
			new Size(176, 112)
		);
		let bushesTilesImage = new Image();
		bushesTilesImage.src = "./Assets/Tiles/Bush Tiles.png";
		this.bushesTiles = new TileSheet(
			bushesTilesImage,
			16,
			new Size(176, 192)
		);
		let treesImage = new Image();
		treesImage.src = "./Assets/Tiles/Trees Bushes.png";
		this.treesTiles = new TileSheet(treesImage, 16, new Size(192, 112));
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

	render() {
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
	}

	loadMap() {
		this.loadMainCharacter();
		this.alien = new Alien(this.canvas, 4, this, new Point(700, 100));
		this.cowManager = new CowManager(this.canvas, this.cowsLayer, this);
		this.cowManager.load();
		this.scrollTo(this.characterSprite.currentPosition, false);
	}

	loadMainCharacter() {
		let startPoint = new Point(1400, 1400);
		this.touchPoint = startPoint;
		let characterSheet = new Image();
		characterSheet.src = "./Assets/Character.png";
		this.characterSprite = new MainCharacter(
			this.canvas,
			4,
			this,
			startPoint
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

	renderCanopyLayer() {
		this.cowManager.render();
		this.alien.render();
		this.renderLayer(this.canopyLayer, this.treesTiles);
	}

	renderMapBaseLayer() {
		this.renderLayer(this.floorLayer, this.grassTiles);
		this.renderLayer(this.bushesLayer, this.bushesTiles);
		this.renderLayer(this.objectsLayer, this.treesTiles);
	}
}

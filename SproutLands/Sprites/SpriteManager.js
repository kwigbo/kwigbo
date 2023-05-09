class SpriteManager {
	constructor(tileMap) {
		this.tileMap = tileMap;
	}

	handleTouch(touchFrame) {
		let touchedPlayer = this.characterSprite.frame.collided(touchFrame);
		if (touchedPlayer) {
			this.characterSprite.touch();
			return true;
		}
		// Check for touch collision
		let touchedCow = this.cowManager.checkForCollision(touchFrame);
		if (touchedCow) {
			return true;
		}
		return false;
	}

	createSprites() {
		// Load Cows
		this.cowManager = new CowManager(
			this.tileMap.canvas,
			this.tileMap.cowsLayer,
			this.tileMap,
			this.tileMap.assetManager.scaledTileSize
		);

		this.cowManager.createCows(
			this.tileMap.assetManager.cowAssetManager.cowGridImages,
			this.tileMap.assetManager.cowAssetManager.babyCowGridImages
		);

		const startCoordinates = new GridCoordinates(11, 2);
		const startPoint = this.tileMap.pointForCoordinates(startCoordinates);
		this.alien = new Alien(
			this.tileMap.assetManager.alienSheet,
			this.tileMap.canvas,
			this.tileMap,
			startPoint
		);

		const characterStart = new GridCoordinates(16, 18);
		const characterPoint = this.tileMap.pointForCoordinates(characterStart);
		this.tileMap.touchPoint = characterPoint;
		this.characterSprite = new MainCharacter(
			this.tileMap.assetManager.characterSheet,
			this.tileMap.canvas,
			this.tileMap,
			characterPoint
		);

		this.tileMap.scrollTo(this.characterSprite.currentPosition, false);
	}
}

class CowSprite extends Sprite {
	/// Stand animation index
	static stand = -1;
	/// Blink animation index
	static blink = 0;
	/// Walk animation index
	static walk = 1;
	/// Eat animation index
	static eat = 5;
	/// Love animation index
	static love = 7;
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(canvas, scale, map, start) {
		let sheet = new Image();
		sheet.src = "./SproutLands/Assets/Brown Cow.png";
		super(sheet, 32, 8, canvas, scale, map, start);
		this.animations = [3, 8, 7, 3, 4, 7, 4, 6];
		this.frameDelay = 10;
		this.randomStart = Math.floor(Math.random() * 5000) + 5000;
	}

	currentState = CowSprite.stand;
	lastEat = Date.now();

	render() {
		super.render();
		let now = Date.now();

		if (this.currentState === CowSprite.stand) {
			this.currentAnimation = CowSprite.blink;
			this.currentFrame = 0;
		}

		let elapsedTime = now - this.lastEat;
		if (elapsedTime > this.randomStart) {
			this.currentState = CowSprite.eat;
			this.currentAnimation = CowSprite.eat;
			this.lastEat = Date.now();
			this.randomStart = Math.floor(Math.random() * 5000) + 5000;
		}
	}

	onEndAnimation() {
		this.currentState = CowSprite.stand;
		this.lastEat = Date.now();
	}
}

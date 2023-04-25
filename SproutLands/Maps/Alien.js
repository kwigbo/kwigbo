class Alien extends Sprite {
	/// Method to create a new Sprite
	///
	/// - Parameters:
	///		- canvas: The canvas to draw to
	///		- scale: Desired render scale for the sprite
	///		- map: The map that contains the sprite
	///		- start: The start position of the sprite.
	constructor(canvas, scale, map, start) {
		let sheet = new Image();
		sheet.src = "./SproutLands/Assets/Alien.png";
		super(sheet, 32, 1, canvas, scale, map, start);
		this.animations = [10];
		this.frameDelay = 10;
		this.currentAnimation = 0;
	}
}

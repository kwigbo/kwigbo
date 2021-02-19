function Icon(x, y, image, name) {
	this.name = name;
	this.velocityPoint = new Point(2, 2);
	this.image = image;
	this.frame = new Frame(
		new Point(x, y),
		new Size(image.width, image.height));
}

Icon.prototype.draw = function() {
	let context = avatarCanvas.getContext('2d');
	context.drawImage(this.image, this.frame.origin.x, this.frame.origin.y);
};

Icon.prototype.move = function() {
	this.checkForWallCollision();
	this.frame.origin.x += this.velocityPoint.x;
  	this.frame.origin.y += this.velocityPoint.y;
}

Icon.prototype.calculateVelocity = function(otherIcon) {
	let currentXSpeed = this.velocityPoint.x;
	let currentYSpeed = this.velocityPoint.y;

	let otherXSpeed = otherIcon.velocityPoint.x;
	let otherYSpeed = otherIcon.velocityPoint.y;

	let xVelocity = otherXSpeed;
	let yVelocity = otherYSpeed;

	return new Point(xVelocity, yVelocity);
}

Icon.prototype.checkForWallCollision = function() {
	let maxX = window.innerWidth - this.image.width;
	let maxY = window.innerHeight - this.image.height - footerHeight;
	if (this.frame.origin.y <= 0) {
		// Top Edge
		this.velocityPoint.y = -this.velocityPoint.y;
    	this.frame.origin.y = 0;
	}
	if (this.frame.origin.y >= maxY) {
		// bottom Edge
		this.velocityPoint.y = -this.velocityPoint.y
    	this.frame.origin.y = maxY;
	}
	if (this.frame.origin.x <= 0) {
		// Left Edge
		this.velocityPoint.x = -this.velocityPoint.x;
    	this.frame.origin.x = 0;
	}
	if (this.frame.origin.x >= maxX) {
		// Right edge
		this.velocityPoint.x = -this.velocityPoint.x;
    	this.frame.origin.x = maxX;
	}
}

var icons = [];

function loadCryptoIcons() {
	icons = [];
    loadCryptoSymbols([
    	"vet",
    	"zil",
    	"xtz",
    	"ltc",
    	"eth",
    	"enj",
    	"bat",
    	"algo",
    	"btc",
    	"ada",
    	"link",
    	"agi",
    	"cro"]);
}

function loadCryptoSymbols(symbols) {
	for (var i = 0; i < symbols.length; i++) {
		let currentIconName = symbols[i];
		let randomX = getRandomInt(window.innerWidth);
    	let randomY = getRandomInt(window.innerHeight);
		loadCryptoSymbol(randomX, randomY, currentIconName);
	}
}

function loadCryptoSymbol(x, y, symbol) {
	let image = new Image();
    image.onload = function() {
    	icons.push(new Icon(x, y, image, symbol));
    }
    image.src = "./images/" + symbol + ".png";
}

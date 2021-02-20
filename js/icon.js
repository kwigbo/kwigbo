function Icon(x, y, image, name) {
	this.name = name;
	const rand = Math.random() < 0.5
	if (rand) {
		this.velocityPoint = new Point(2, 2);
	} else {
		this.velocityPoint = new Point(-2, -2);
	}

	this.acceleration = 0;

	this.image = image;
	if (image != null) {
		this.frame = new Frame(
			new Point(x, y),
			new Size(image.width, image.height));
	} else {
		this.frame = new Frame(
			new Point(x, y), new Size(0, 0));
	}
}

Icon.prototype.draw = function() {
	let context = avatarCanvas.getContext('2d');
	let halfSize = this.frame.size.width/2;
	context.drawImage(this.image,
		this.frame.origin.x, this.frame.origin.y);
};

Icon.prototype.move = function() {
	this.checkForWallCollision();
	this.frame.origin.x += (this.velocityPoint.x + this.acceleration);
  	this.frame.origin.y += (this.velocityPoint.y + this.acceleration);
  	if (this.acceleration > 0) {
  		this.acceleration -= 0.5;
  	}
}

Icon.prototype.swapVelocity = function(otherIcon) {
	return new Point(otherIcon.velocityPoint.x, otherIcon.velocityPoint.y);
}

Icon.prototype.repel = function(x, y) {
	var angle = Math.atan2(this.y - y, this.x - x);
	this.x += Math.cos(angle) * 2;
	this.y += Math.sin(angle) * 2;
};

Icon.prototype.checkForWallCollision = function() {
	if (this.image == null) return;
	let maxX = window.innerWidth - this.image.width;
	let maxY = window.innerHeight - this.image.height - footerHeight;
	if (this.frame.origin.y <= 0) {
		// Top Edge
		this.velocityPoint.y = -this.velocityPoint.y;
		acceleration = -1;
    	this.frame.origin.y = 0;
	}
	if (this.frame.origin.y >= maxY) {
		// bottom Edge
		this.velocityPoint.y = -this.velocityPoint.y;
		acceleration = 1;
    	this.frame.origin.y = maxY;
	}
	if (this.frame.origin.x <= 0) {
		// Left Edge
		this.velocityPoint.x = -this.velocityPoint.x;
		acceleration = -1;
    	this.frame.origin.x = 0;
	}
	if (this.frame.origin.x >= maxX) {
		// Right edge
		this.velocityPoint.x = -this.velocityPoint.x;
		acceleration = 1;
    	this.frame.origin.x = maxX;
	}
}

Icon.prototype.checkForTouchCollision = function() {
	if (this.image == null) return;
	let collision = this.frame.circleCollision(touchFrame);
	if (collision) {
		let halfWidth = 32;
		let touchIcon = new Icon();
		touchIcon.frame = new Frame(
			new Point(touchFrame.origin.x - halfWidth, touchFrame.origin.y - halfWidth),
			new Size(64, 64));
		performIconInteraction(this, touchIcon, 0);
	}
}

function loadCryptoIcons() {
	icons = [];
	slots = [];
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
    	"beam",
    	"agi",
    	"cro",
    	"doge",
    	"dot"]);
}

var icons = [];
const iconSlotSize = 100;
var slots = [];

function getRandomSlot() {
	let columns = window.innerWidth/iconSlotSize;
	let rows = (window.innerHeight - footerHeight)/iconSlotSize;

	let randomColumn = getRandomInt(columns-1);
	let randomRow = getRandomInt(rows-1);

	var finalPoint = new Point(randomColumn * iconSlotSize, randomRow * iconSlotSize);

	if (slots.includes(randomColumn + "," + randomRow)) {
		return getRandomSlot();
	}

	slots.push(randomColumn + "," + randomRow);
	return finalPoint;
}

function loadCryptoSymbols(symbols) {
	for (var i = 0; i < symbols.length; i++) {
		let slotPoint = getRandomSlot();
		let currentIconName = symbols[i];
		loadCryptoSymbol(slotPoint.x, slotPoint.y, currentIconName);
	}
}

function loadCryptoSymbol(x, y, symbol) {
	let image = new Image();
    image.onload = function() {
    	icons.push(new Icon(x, y, image, symbol));
    }
    image.src = "./images/" + symbol + ".png";
}

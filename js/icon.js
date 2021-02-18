function Icon(x, y, image) {
	this.x = this.oldX = x;
	this.y = this.oldY = y;
	this.image = image;
	this.velocityX = 2;
	this.velocityY = 2;
}

Icon.prototype.draw = function() {
	let context = avatarCanvas.getContext('2d');
	context.drawImage(this.image, this.x, this.y);
};

Icon.prototype.move = function() {
	let maxX = window.innerWidth - this.image.width;
	let maxY = window.innerHeight - this.image.height - footerHeight;
	if (this.y <= 0) {
		// Top Edge
		this.velocityY = -this.velocityY;
    	this.y = 0;
	}
	if (this.y >= maxY) {
		// bottom Edge
		this.velocityY = -this.velocityY
    	this.y = maxY;
	}
	if (this.x <= 0) {
		// Left Edge
		this.velocityX = -this.velocityX;
    	this.x = 0;
	}
	if (this.x >= maxX) {
		// Right edge
		this.velocityX = -this.velocityX
    	this.x = maxX;
	}
	this.x += this.velocityX;
  	this.y += this.velocityY;
}

var icons = [];

function loadCryptoIcons() {
	icons = [];
    loadCryptoSymbol("vet");
    loadCryptoSymbol("zil");
    loadCryptoSymbol("xtz");
    loadCryptoSymbol("ltc");
    loadCryptoSymbol("eth");
    loadCryptoSymbol("enj");
    loadCryptoSymbol("bat");
    loadCryptoSymbol("algo");
    loadCryptoSymbol("btc");
    loadCryptoSymbol("ada");
    loadCryptoSymbol("link");
    loadCryptoSymbol("agi");
    loadCryptoSymbol("cro");
}

function loadCryptoSymbol(symbol) {
	let image = new Image();
    image.onload = function() {
    	icons.push(new Icon(getRandomInt(window.innerWidth),
    		getRandomInt(window.innerHeight), image));
    }
    image.src = "./images/" + symbol + ".png";
}

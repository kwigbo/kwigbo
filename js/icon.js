function Icon(x, y, image) {
	this.x = this.oldX = x;
	this.y = this.oldY = y;
	this.image = image;
	this.velocityX = 2;
	this.velocityY = 2;
	this.isDragging = false;
}

Icon.prototype.draw = function() {
	let context = avatarCanvas.getContext('2d');
	context.drawImage(this.image, this.x, this.y);
};

Icon.prototype.move = function() {
	this.checkForWallCollision();
	this.checkForTouchCollision();
	// Update the position after processing velocity
	this.x += this.velocityX;
  	this.y += this.velocityY;
}

Icon.prototype.checkForWallCollision = function() {
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
}

Icon.prototype.checkForTouchCollision = function() {
	let iconFrame = new Frame(this.x, this.y, this.image.width, this.image.height);
	let touchFrame = new Frame(moveX, moveY, 1, 1);
	let isHit = touchFrame.collided(iconFrame);
	if (isHit) {
		let centerX = iconFrame.x + (iconFrame.width/2);
		let centerY = iconFrame.y + (iconFrame.height/2);
		if (touchFrame.x < centerX) {
			// Left
			this.velocityX = -this.velocityX;
		}
		if (touchFrame.x > centerX) {
			// Right
			this.velocityX = this.velocityX;
		}
		if (touchFrame.y < centerY) {
			// Top
			this.velocityY = -this.velocityY;
		}
		if (touchFrame.y > centerY) {
			// Bottom
			this.velocityY = this.velocityY;
		}
	}
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

function Pixel(x, y, size, pixelData) {
	this.x = this.oldX = x;
	this.y = this.oldY = y;
	this.size = size;
	this.pixelData = pixelData;
	this.originX = this.x;
	this.originY = this.y;
	this.isSettled = true;
}

Pixel.prototype.draw = function() {

	let red = parseInt(this.pixelData[0]);
	let green = parseInt(this.pixelData[1]);
	let blue = parseInt(this.pixelData[2]);
	let alpha = parseInt(this.pixelData[3]);

	let context = avatarCanvas.getContext('2d');
	if (alpha !== 0) {
		context.fillStyle = RGBToHex(red, green, blue);
		context.fillRect(this.x, this.y, this.size, this.size);
	}
};

Pixel.prototype.integrate = function() {
	var velocityX = this.x - this.oldX;
	var velocityY = this.y - this.oldY;
	this.oldX = this.x;
	this.oldY = this.y;
	this.x += velocityX;
	this.y += velocityY;
	this.isSettled = this.y == this.originY && this.x == this.originX;
};

Pixel.prototype.stay = function() {
	this.y = this.originY;
	this.x = this.originX;
	this.oldX = this.x;
	this.oldY = this.y;
	this.isSettled = true;
}

Pixel.prototype.distanceMoved = function() {
	var a = this.x - this.originX;
	var b = this.y - this.originY;
	var distance = Math.abs(Math.sqrt( a*a + b*b ));
	return distance;
}

Pixel.prototype.return = function() {
	var angle = Math.atan2(this.y - this.originY, this.x - this.originX);
	if (Math.abs(this.x - this.originX) <= 1) {
		this.x = this.originX;
	} else {
		this.x -= Math.cos(angle) * 2;
	}
	if (Math.abs(this.y - this.originY) <= 1) {
		this.y = this.originY;
	} else {
		this.y -= Math.sin(angle) * 2;
	}
}

Pixel.prototype.repel = function(x, y) {
	var angle = Math.atan2(this.y - y, this.x - x);
	this.x += Math.cos(angle) * 2;
	this.y += Math.sin(angle) * 2;
	this.isSettled = false;
};

var pixels = [];

function generatePixels(string, imageWidth, imageHeight) {
	let maxWidth = window.innerWidth;
	let maxHeight = window.innerHeight - footerHeight;

	pixels = [];
	// Get the image data for kwigbo
	var array = string.split(",");
	array = chunk(array, 4);

	// Max width
	let realSize = scaleSizeToFit(imageWidth, imageHeight, maxWidth, maxHeight);
	let displaySize = realSize[0];

	let scaleFactor = displaySize/kwigboSize;
	let xOffset = Math.ceil((maxWidth/2) - (displaySize/2));
	let yOffset = Math.ceil(maxHeight - (displaySize));

	for (var x = 0; x < imageWidth; x++) {
		for (var y = 0; y < imageHeight; y++) {
			let realIndex = x * imageWidth + y
			let pixelData = array[realIndex];
			let xPos = Math.ceil(x*scaleFactor) + xOffset;
			let yPos = Math.ceil(y*scaleFactor) + yOffset;
			let width = Math.ceil(scaleFactor);

			pixels.push(new Pixel(xPos, yPos, width, pixelData));
		}
	}
}

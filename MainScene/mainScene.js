import Scene from "../GameSDK/Scene.js";
import Size from "../GameSDK/Geometry/Size.js";
import Point from "../GameSDK/Geometry/Point.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Util from "../GameSDK/Util.js";
import Pixel from "./Pixel.js";
import Icon from "./Icon.js";

export default class MainScene extends Scene {
	kwigboData =
		"0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,0,255,0,0,0,255,252,238,223,255,232,199,185,255,0,0,0,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,232,199,185,255,232,199,185,255,252,238,223,255,232,199,185,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,252,238,223,255,252,238,223,255,232,199,185,255,232,199,185,255,252,238,223,255,232,199,185,255,232,199,185,255,0,0,0,255,252,238,223,255,252,238,223,255,232,199,185,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,252,238,223,255,232,199,185,255,232,199,185,255,252,238,223,255,232,199,185,255,232,199,185,255,0,0,0,255,252,238,223,255,252,238,223,255,252,238,223,255,146,99,73,255,252,238,223,255,232,199,185,255,0,0,0,255,0,0,0,0,0,0,0,255,185,219,252,255,0,0,0,0,0,0,0,0,0,0,0,255,252,238,223,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,252,238,223,255,252,238,223,255,252,238,223,255,146,99,73,255,252,238,223,255,252,238,223,255,252,238,223,255,232,199,185,255,0,0,0,255,43,116,206,255,0,0,0,255,0,0,0,0,0,0,0,0,252,238,223,255,232,199,185,255,252,238,223,255,232,199,185,255,232,199,185,255,232,199,185,255,0,0,0,255,252,238,223,255,252,238,223,255,252,238,223,255,146,99,73,255,0,0,0,255,0,0,0,255,0,0,0,255,252,238,223,255,232,199,185,255,0,0,0,255,185,219,252,255,0,0,0,0,0,0,0,255,252,238,223,255,232,199,185,255,232,199,185,255,232,199,185,255,252,238,223,255,232,199,185,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,232,199,185,255,0,0,0,255,142,196,251,255,0,0,0,0,0,0,0,0,232,199,185,255,252,238,223,255,232,199,185,255,232,199,185,255,232,199,185,255,0,0,0,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,232,199,185,255,0,0,0,255,142,196,251,255,0,0,0,0,0,0,0,0,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,0,0,0,255,232,199,185,255,232,199,185,255,232,199,185,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,252,238,223,255,232,199,185,255,232,199,185,255,0,0,0,255,142,196,251,255,0,0,0,0,0,0,0,255,232,199,185,255,146,99,73,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,0,0,0,255,142,196,251,255,0,0,0,0,0,0,0,0,146,99,73,255,232,199,185,255,146,99,73,255,232,199,185,255,232,199,185,255,232,199,185,255,0,0,0,255,232,199,185,255,232,199,185,255,232,199,185,255,146,99,73,255,0,0,0,255,0,0,0,255,0,0,0,255,232,199,185,255,146,99,73,255,0,0,0,255,142,196,251,255,0,0,0,0,0,0,0,0,0,0,0,255,146,99,73,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,232,199,185,255,146,99,73,255,232,199,185,255,232,199,185,255,232,199,185,255,146,99,73,255,0,0,0,255,43,116,206,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,146,99,73,255,232,199,185,255,232,199,185,255,146,99,73,255,232,199,185,255,232,199,185,255,0,0,0,255,232,199,185,255,232,199,185,255,232,199,185,255,146,99,73,255,232,199,185,255,146,99,73,255,0,0,0,255,0,0,0,0,0,0,0,255,142,196,251,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,146,99,73,255,146,99,73,255,232,199,185,255,232,199,185,255,146,99,73,255,232,199,185,255,232,199,185,255,0,0,0,255,232,199,185,255,232,199,185,255,146,99,73,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,146,99,73,255,146,99,73,255,146,99,73,255,146,99,73,255,232,199,185,255,232,199,185,255,232,199,185,255,146,99,73,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,0,255,0,0,0,255,146,99,73,255,232,199,185,255,0,0,0,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,255,0,0,0,255,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
	kwigboSize = 20;
	footerHeight = 80;
	iconSlotSize = 100;
	opacitySpeed = 0.01;

	constructor(rootContainer) {
		super(rootContainer);
		this.cartImage = new Image();
		this.cartImage.src = "./MainScene/images/Cart.png";
		this.display();
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	touchStart(event) {
		super.touchStart(event);
		this.handleTouch();
	}

	mouseDown(event) {
		super.mouseDown(event);
		this.handleTouch();
	}

	handleTouch() {
		let collision = this.touchFrame.collided(this.cartFrame);
		if (collision) {
			window.location.href = "https://shop.kwigbo.com";
		}
	}

	display() {
		if (!this.canvas) {
			this.canvas = document.createElement("canvas");
			this.canvas.setAttribute("id", "mainCanvas");
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.rootContainer.appendChild(this.canvas);
			this.displayLoop.start(60);
		}
		this.icons = [];
		this.slots = [];
		this.generatePixels(this.kwigboData, this.kwigboSize, this.kwigboSize);
		this.loadOrbSymbols([
			"kwigbo_coin_green",
			"kwigbo_coin_blue",
			"kwigbo_coin_yellow",
			"kwigbo_coin_pink",
			"kwigbo_coin_orange",
			"kwigbo_coin_teal",
		]);
	}

	loadSproutLandsOnHide = false;
	loadVeveOnHide = false;

	render() {
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.renderIcons();
		this.renderPixels();
		this.renderFooter();
		this.renderTouchCircle();
	}

	destroy() {
		super.destroy();
		let context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		contentView.removeChild(contentView.lastElementChild);
	}

	renderTouchCircle() {
		if (!this.isTouchDown) return;
		let context = this.canvas.getContext("2d");
		context.beginPath();
		context.arc(
			this.touchFrame.origin.x,
			this.touchFrame.origin.y,
			this.touchFrame.size.width / 2,
			0,
			2 * Math.PI,
			false,
		);
		context.fillStyle = "rgba(255, 255, 255, 0.5)";
		context.fill();
	}

	/// Render avatar pixels
	renderPixels() {
		for (var i = 0; i < this.pixels.length; i++) {
			let pixel = this.pixels[i];
			if (this.isTouchDown) {
				pixel.repel(this.touchFrame.origin.x, this.touchFrame.origin.y);
				pixel.integrate();
			} else if (!pixel.isSettled) {
				pixel.return();
				pixel.integrate();
			} else {
				pixel.stay();
			}
			pixel.draw();
		}
	}

	/// Render the footer that displays the controls
	renderFooter() {
		let context = this.canvas.getContext("2d");
		context.fillStyle = "#ffffff";
		context.fillRect(
			0,
			this.canvas.height - this.footerHeight,
			this.canvas.width,
			this.footerHeight,
		);
		context.fillStyle = "#000000";
		context.fillRect(
			0,
			this.canvas.height - this.footerHeight,
			this.canvas.width,
			5,
		);
		context.font = "60px JINKY";
		context.textAlign = "center";
		context.textBaseline = "middle";
		let textY = Math.ceil(this.canvas.height - this.footerHeight / 2 + 4);
		context.fillText("kwigbo", Math.ceil(this.canvas.width / 2), textY - 8);

		context.drawImage(
			this.cartImage,
			this.cartFrame.origin.x,
			this.cartFrame.origin.y,
			this.cartFrame.size.width,
			this.cartFrame.size.height,
		);
	}

	get cartFrame() {
		let cartY = Math.ceil(this.canvas.height - this.footerHeight / 2 - 18);
		return new Frame(new Point(15, cartY), new Size(40, 40));
	}

	/// Render the loading icons
	renderIcons() {
		let xpos = Math.ceil(this.canvas.width / 2);
		let ypos = Math.ceil(this.canvas.height / 2);

		// Update positions
		for (var i = 0; i < this.icons.length; i++) {
			let currentIcon = this.icons[i];
			currentIcon.move();
		}

		// Handle collisions
		for (var i = 0; i < this.icons.length; i++) {
			let currentIcon = this.icons[i];
			for (var j = 0; j < this.icons.length; j++) {
				let otherIcon = this.icons[j];
				if (currentIcon !== otherIcon) {
					let collision = currentIcon.frame.circleCollision(
						otherIcon.frame,
					);
					if (collision) {
						this.performIconInteraction(currentIcon, otherIcon, 0);
					}
				}
			}
			currentIcon.checkForTouchCollision(this);
		}

		for (var i = 0; i < this.icons.length; i++) {
			let currentIcon = this.icons[i];
			currentIcon.draw();
		}
	}

	performIconInteraction(currentIcon, otherIcon, type) {
		switch (type) {
			case 0:
				let vCollision = new Point(
					otherIcon.frame.origin.x - currentIcon.frame.origin.x,
					otherIcon.frame.origin.y - currentIcon.frame.origin.y,
				);

				var a = currentIcon.frame.origin.x - otherIcon.frame.origin.x;
				var b = currentIcon.frame.origin.y - otherIcon.frame.origin.y;
				var distance = Math.abs(Math.sqrt(a * a + b * b));

				let vCollisionNorm = new Point(
					vCollision.x / distance,
					vCollision.y / distance,
				);

				let vRelativeVelocity = new Point(
					currentIcon.velocityPoint.x - otherIcon.velocityPoint.x,
					currentIcon.velocityPoint.y - otherIcon.velocityPoint.y,
				);

				let speed =
					vRelativeVelocity.x * vCollisionNorm.x +
					vRelativeVelocity.y * vCollisionNorm.y;

				currentIcon.velocityPoint.x -= speed * vCollisionNorm.x;
				currentIcon.velocityPoint.y -= speed * vCollisionNorm.y;
				otherIcon.velocityPoint.x += speed * vCollisionNorm.x;
				otherIcon.velocityPoint.y += speed * vCollisionNorm.y;
				currentIcon.move();
				otherIcon.move();
				break;
			case 1:
				currentIcon.repel(
					otherIcon.frame.origin.x,
					otherIcon.frame.origin.y,
				);
				otherIcon.repel(
					currentIcon.frame.origin.x,
					currentIcon.frame.origin.y,
				);
				currentIcon.move();
				otherIcon.move();
				break;
			case 2:
				let currentVelocity = currentIcon.swapVelocity(otherIcon);
				let otherVelocity = otherIcon.swapVelocity(currentIcon);
				currentIcon.velocityPoint = currentVelocity;
				otherIcon.velocityPoint = otherVelocity;
				break;
		}
	}

	generatePixels(string, imageWidth, imageHeight) {
		let maxWidth = this.canvas.width;
		let maxHeight = this.canvas.height - this.footerHeight;

		this.pixels = [];
		// Get the image data for kwigbo
		var array = string.split(",");
		array = Util.chunk(array, 4);

		// Max width
		let realSize = Util.scaleSizeToFit(
			new Size(imageWidth, imageHeight),
			new Size(maxWidth, maxHeight),
		);
		let displaySize = realSize.width;

		let scaleFactor = displaySize / this.kwigboSize;
		let xOffset = Math.ceil(maxWidth / 2 - displaySize / 2);
		let yOffset = Math.ceil(maxHeight - displaySize);

		for (var x = 0; x < imageWidth; x++) {
			for (var y = 0; y < imageHeight; y++) {
				let realIndex = x * imageWidth + y;
				let pixelData = array[realIndex];
				let xPos = Math.ceil(x * scaleFactor) + xOffset;
				let yPos = Math.ceil(y * scaleFactor) + yOffset;
				let width = Math.ceil(scaleFactor);

				this.pixels.push(new Pixel(xPos, yPos, width, pixelData));
			}
		}
	}

	getRandomSlot() {
		let columns = this.canvas.width / this.iconSlotSize;
		let rows = (this.canvas.height - this.footerHeight) / this.iconSlotSize;
		let randomColumn = Util.getRandomInt(columns - 1);
		let randomRow = Util.getRandomInt(rows - 1);

		var finalPoint = new Point(
			randomColumn * this.iconSlotSize,
			randomRow * this.iconSlotSize,
		);

		if (this.slots.includes(randomColumn + "," + randomRow)) {
			return this.getRandomSlot();
		}

		this.slots.push(randomColumn + "," + randomRow);
		return finalPoint;
	}

	loadOrbSymbols(symbols) {
		for (var i = 0; i < symbols.length; i++) {
			let slotPoint = this.getRandomSlot();
			let currentIconName = symbols[i];
			this.loadOrbSymbol(slotPoint.x, slotPoint.y, currentIconName);
		}
	}

	loadOrbSymbol(x, y, symbol) {
		let image = new Image();
		image.onload = () => {
			this.icons.push(new Icon(x, y, image, symbol, this.footerHeight));
		};
		let imagePath = "./MainScene/images/" + symbol + ".png";
		image.src = "./MainScene/images/" + symbol + ".png";
	}
}

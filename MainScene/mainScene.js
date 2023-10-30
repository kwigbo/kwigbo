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
	footerHeight = 0;
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
		this.display();
	}

	touchStart(event) {
		if (this.menuOpen) {
			this.handleMenu();
			return;
		}
		let collision = this.touchFrame.collided(this.menuFrame);
		if (!collision) {
			super.touchStart(event);
		} else {
			this.handleMenu();
		}
	}

	touchMove(event) {
		super.touchMove(event);
		this.updateCursor();
	}

	mouseMove(event) {
		super.mouseMove(event);
		this.updateCursor();
	}

	updateCursor() {
		let collision = this.touchFrame.collided(this.menuFrame);
		if (collision) {
			this.rootContainer.style.cursor = "pointer";
		} else {
			this.rootContainer.style.cursor = "default";
		}
	}

	mouseDown(event) {
		if (this.menuOpen) {
			this.handleMenu();
			return;
		}
		let collision = this.touchFrame.collided(this.menuFrame);
		if (!collision) {
			super.mouseDown(event);
		} else {
			this.handleMenu();
		}
	}

	handleMenu() {
		const menu = document.getElementById("menu");
		if (!this.menuOpen) {
			this.menuOpen = true;
			menu.style.display = "inline-block";
		} else {
			const menuRect = menu.getBoundingClientRect();
			let collision = this.touchFrame.collided(menuRect);
			if (!collision) {
				this.menuOpen = false;
				menu.style.display = "none";
			}
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
		if (this.menuOpen) {
			context.globalAlpha = 0.5;
			context.fillStyle = "#000000";
			context.beginPath();
			context.rect(0, 0, this.canvas.width, this.canvas.height);
			context.fill();
			context.globalAlpha = 1;
		}
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

	drawRoundedRect(ctx, x, y, width, height, radius) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(
			x + width,
			y + height,
			x + width - radius,
			y + height,
		);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
	}

	/// Render the footer that displays the controls
	renderFooter() {
		let context = this.canvas.getContext("2d");
		context.fillStyle = "#ffffff";

		let cornerRadius = 10;
		context.globalAlpha = 0.75;

		this.drawRoundedRect(
			context,
			this.menuFrame.origin.x,
			this.menuFrame.origin.y,
			this.menuFrame.size.width,
			this.menuFrame.size.height,
			cornerRadius,
		);
		context.fill();
		context.globalAlpha = 1;

		context.fillStyle = "#000000";
		context.font = "100px JINKY";
		context.textAlign = "left";
		context.textBaseline = "middle";
		let textY = Math.ceil(
			this.canvas.height - this.menuFrame.size.height / 2,
		);
		context.fillText("kwigbo", 20, textY);
	}

	get menuFrame() {
		let rectWidth = 180;
		let rectHeight = 125;
		let startX = -10;
		let startY = this.canvas.height - rectHeight + 10;
		return new Frame(
			new Point(startX, startY),
			new Size(rectWidth, rectHeight),
		);
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

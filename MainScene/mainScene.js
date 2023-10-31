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
		this.menuImage = new Image();
		this.menuImage.src = "./MainScene/images/menu.png";

		// Check url params for a "tokenId"
		const urlParams = new URLSearchParams(
			window.location.search.toLowerCase(),
		);
		this.kwigboHidden = urlParams.get("kwigbohidden") === "true";
		this.display();
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.display();
	}

	touchStart(event) {
		super.touchStart(event);
		this.handleMenu();
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
		super.mouseDown(event);
		this.handleMenu();
	}

	handleMenu() {
		const menu = document.getElementById("menu");
		let menuButtonCollision = this.touchFrame.collided(this.menuFrame);

		const menuRect = menu.getBoundingClientRect();
		let menuCollision = this.touchFrame.collided(menuRect);

		if (!this.menuOpen && menuButtonCollision) {
			this.menuOpen = true;
			menu.style.display = "inline-block";
		} else if (this.menuOpen && !menuCollision) {
			this.menuOpen = false;
			menu.style.display = "none";
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
		if (!this.kwigboHidden) {
			this.renderPixels();
		}
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

		context.drawImage(
			this.menuImage,
			this.menuFrame.origin.x,
			this.menuFrame.origin.y,
			this.menuFrame.size.width,
			this.menuFrame.size.height,
		);

		context.fillStyle = "#ffffff";
		context.font = "50px JINKY";
		context.textAlign = "left";
		context.textBaseline = "middle";
		let textY = Math.ceil(this.menuFrame.size.height / 2);
		context.fillText(
			"kwigbo",
			this.menuFrame.origin.x + this.menuFrame.size.width + 10,
			textY + this.menuFrame.origin.y,
		);
	}

	get menuFrame() {
		let rectWidth = 48;
		let rectHeight = 48;
		let startX = 10;
		let startY = 10;
		return new Frame(
			new Point(startX, startY),
			new Size(rectWidth, rectHeight),
		);
	}

	/// Render the loading icons
	renderIcons() {
		Icon.updateIcons(
			this.icons,
			0.2, // timeStep
			0.95, // wallDamping
			0.03, // objectDamping
			5,
		);

		for (var i = 0; i < this.icons.length; i++) {
			let currentIcon = this.icons[i];
			//currentIcon.move();
			currentIcon.draw();
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

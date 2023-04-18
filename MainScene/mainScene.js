class MainScene extends Scene {
	constructor() {
		super();
	}

	display() {
		generatePixels(kwigboData, kwigboSize, kwigboSize);
		loadOrbs();
	}

	hide() {
		const context = mainCanvas.getContext("2d");
		if (context.globalAlpha > 0) {
			context.globalAlpha -= OpacitySpeed;
			if (context.globalAlpha <= 0.01) {
				context.globalAlpha = 0;
				pixels = [];
				this.isHidding = false;
			}
		}
	}

	render() {
		if (this.isVeveSceneReady()) {
			this.isHidding = true;
			changeScene(new VeveScene());
		}
		this.renderIcons();
		this.renderPixels();
		this.renderFooter();
		this.renderTouchCircle();
		const context = mainCanvas.getContext("2d");
		if (context.globalAlpha < 1) {
			context.globalAlpha += OpacitySpeed;
		}
		let hiddenFrame = new Frame(new Point(0, 0), new Size(64, 64));
		if (isTouchDown) {
			console.log("=======");
			console.log(touchFrame);
			console.log(hiddenFrame);
		}
		if (isTouchDown && touchFrame.collided(hiddenFrame)) {
			changeScene(new SproutLands());
		}
	}

	renderTouchCircle() {
		if (!isTouchDown) return;
		const context = mainCanvas.getContext("2d");
		context.beginPath();
		context.arc(
			touchFrame.origin.x,
			touchFrame.origin.y,
			touchFrame.size.width / 2,
			0,
			2 * Math.PI,
			false
		);
		context.fillStyle = "rgba(255, 255, 255, 0.5)";
		context.fill();
	}

	isVeveSceneReady() {
		var isOffScreen = true;
		for (var i = 0; i < pixels.length; i++) {
			let pixel = pixels[i];
			if (
				pixel.x > 0 &&
				pixel.x < mainCanvas.width &&
				pixel.y > 0 &&
				pixel.y < mainCanvas.height
			) {
				isOffScreen = false;
			}
		}
		return isOffScreen;
	}

	/// Render avatar pixels
	renderPixels() {
		for (var i = 0; i < pixels.length; i++) {
			let pixel = pixels[i];
			if (isTouchDown) {
				pixel.repel(touchFrame.origin.x, touchFrame.origin.y);
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
		let context = mainCanvas.getContext("2d");
		context.fillStyle = "#ffffff";
		context.fillRect(
			0,
			window.innerHeight - footerHeight,
			window.innerWidth,
			footerHeight
		);
		context.fillStyle = "#000000";
		context.fillRect(
			0,
			window.innerHeight - footerHeight,
			window.innerWidth,
			5
		);
		context.font = "50px Gruppo";
		context.textAlign = "center";
		context.textBaseline = "middle";
		let textY = Math.ceil(window.innerHeight - footerHeight / 2 + 4);
		context.fillText("kwigbo", Math.ceil(window.innerWidth / 2), textY - 8);
	}

	/// Render the loading icons
	renderIcons() {
		let xpos = Math.ceil(window.innerWidth / 2);
		let ypos = Math.ceil(window.innerHeight / 2);

		// Update positions
		for (var i = 0; i < icons.length; i++) {
			let currentIcon = icons[i];
			currentIcon.move();
		}

		// Handle collisions
		for (var i = 0; i < icons.length; i++) {
			let currentIcon = icons[i];
			for (var j = 0; j < icons.length; j++) {
				let otherIcon = icons[j];
				if (currentIcon !== otherIcon) {
					let collision = currentIcon.frame.circleCollision(
						otherIcon.frame
					);
					if (collision) {
						this.performIconInteraction(currentIcon, otherIcon, 0);
					}
				}
			}
			currentIcon.checkForTouchCollision();
		}

		for (var i = 0; i < icons.length; i++) {
			let currentIcon = icons[i];
			currentIcon.draw();
		}
	}

	performIconInteraction(currentIcon, otherIcon, type) {
		switch (type) {
			case 0:
				let vCollision = new Point(
					otherIcon.frame.origin.x - currentIcon.frame.origin.x,
					otherIcon.frame.origin.y - currentIcon.frame.origin.y
				);

				var a = currentIcon.frame.origin.x - otherIcon.frame.origin.x;
				var b = currentIcon.frame.origin.y - otherIcon.frame.origin.y;
				var distance = Math.abs(Math.sqrt(a * a + b * b));

				let vCollisionNorm = new Point(
					vCollision.x / distance,
					vCollision.y / distance
				);

				let vRelativeVelocity = new Point(
					currentIcon.velocityPoint.x - otherIcon.velocityPoint.x,
					currentIcon.velocityPoint.y - otherIcon.velocityPoint.y
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
					otherIcon.frame.origin.y
				);
				otherIcon.repel(
					currentIcon.frame.origin.x,
					currentIcon.frame.origin.y
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
}

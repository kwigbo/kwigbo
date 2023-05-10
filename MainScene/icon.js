import Point from "../GameSDK/Geometry/Point.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Size from "../GameSDK/Geometry/Size.js";

export default class Icon {
	constructor(x, y, image, name, footerHeight) {
		this.name = name;
		this.footerHeight = footerHeight;
		const rand = Math.random() < 0.5;
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
				new Size(image.width, image.height)
			);
		} else {
			this.frame = new Frame(new Point(x, y), new Size(0, 0));
		}
	}

	draw() {
		let context = mainCanvas.getContext("2d");
		let halfSize = this.frame.size.width / 2;
		context.drawImage(this.image, this.frame.origin.x, this.frame.origin.y);
	}

	move() {
		this.checkForWallCollision();
		this.frame.origin.x += this.velocityPoint.x + this.acceleration;
		this.frame.origin.y += this.velocityPoint.y + this.acceleration;
		if (this.acceleration > 0) {
			this.acceleration -= 0.5;
		}
	}

	swapVelocity(otherIcon) {
		return new Point(otherIcon.velocityPoint.x, otherIcon.velocityPoint.y);
	}

	repel(x, y) {
		var angle = Math.atan2(this.y - y, this.x - x);
		this.x += Math.cos(angle) * 2;
		this.y += Math.sin(angle) * 2;
	}

	checkForWallCollision() {
		if (this.image == null) return;
		let maxX = window.innerWidth - this.image.width;
		let maxY = window.innerHeight - this.image.height - this.footerHeight;
		if (this.frame.origin.y <= 0) {
			// Top Edge
			this.velocityPoint.y = -this.velocityPoint.y;
			this.acceleration = -1;
			this.frame.origin.y = 0;
		}
		if (this.frame.origin.y >= maxY) {
			// bottom Edge
			this.velocityPoint.y = -this.velocityPoint.y;
			this.acceleration = 1;
			this.frame.origin.y = maxY;
		}
		if (this.frame.origin.x <= 0) {
			// Left Edge
			this.velocityPoint.x = -this.velocityPoint.x;
			this.acceleration = -1;
			this.frame.origin.x = 0;
		}
		if (this.frame.origin.x >= maxX) {
			// Right edge
			this.velocityPoint.x = -this.velocityPoint.x;
			this.acceleration = 1;
			this.frame.origin.x = maxX;
		}
	}

	checkForTouchCollision(scene) {
		if (this.image == null) return;
		let halfWidth = 32;
		let realFrame = new Frame(
			new Point(
				scene.touchFrame.origin.x - halfWidth,
				scene.touchFrame.origin.y - halfWidth
			),
			new Size(64, 64)
		);
		let collision = this.frame.circleCollision(realFrame);
		if (collision) {
			let touchIcon = new Icon();
			touchIcon.frame = realFrame;
			scene.performIconInteraction(this, touchIcon, 0);
		}
	}
}

import Point from "../GameSDK/Geometry/Point.js";
import Frame from "../GameSDK/Geometry/Frame.js";
import Size from "../GameSDK/Geometry/Size.js";

export default class Icon {
	constructor(x, y, image, name, footerHeight) {
		this.name = name;
		this.isGrabbed = false;
		this.footerHeight = footerHeight;
		this.mass = 1;
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
				new Size(image.width, image.height),
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

	static updateIcons(
		objects,
		timeStep,
		wallDamping,
		objectDamping,
		maxSpeed,
		touchFrame,
		isTouchDown,
	) {
		const canvasWidth = window.innerWidth;
		const canvasHeight = window.innerHeight;

		// Iterate through the objects
		for (let index = 0; index < objects.length; index++) {
			const currentIcon = objects[index];

			// Calculate new positions based on velocities and time step
			const newX =
				currentIcon.frame.origin.x +
				currentIcon.velocityPoint.x * timeStep;
			const newY =
				currentIcon.frame.origin.y +
				currentIcon.velocityPoint.y * timeStep;

			// Check for collisions with canvas edges
			if (newX < 0 || newX + currentIcon.frame.size.width > canvasWidth) {
				// Reverse x-velocity to bounce off left or right edge
				currentIcon.velocityPoint.x =
					-currentIcon.velocityPoint.x * wallDamping;
				// Adjust the position to stay inside the canvas
				currentIcon.frame.origin.x = Math.max(
					0,
					Math.min(canvasWidth - currentIcon.frame.size.width, newX),
				);
			}

			if (
				newY < 0 ||
				newY + currentIcon.frame.size.height > canvasHeight
			) {
				// Reverse y-velocity to bounce off top or bottom edge
				currentIcon.velocityPoint.y =
					-currentIcon.velocityPoint.y * wallDamping;
				// Adjust the position to stay inside the canvas
				currentIcon.frame.origin.y = Math.max(
					0,
					Math.min(
						canvasHeight - currentIcon.frame.size.height,
						newY,
					),
				);
			}

			// Check and cap the speed if it exceeds the maximum
			const currentSpeed = Math.sqrt(
				currentIcon.velocityPoint.x * currentIcon.velocityPoint.x +
					currentIcon.velocityPoint.y * currentIcon.velocityPoint.y,
			);
			if (currentSpeed > maxSpeed) {
				const scale = maxSpeed / currentSpeed;
				currentIcon.velocityPoint.x *= scale;
				currentIcon.velocityPoint.y *= scale;
			}

			currentIcon.frame.origin.x += currentIcon.velocityPoint.x;
			currentIcon.frame.origin.y += currentIcon.velocityPoint.y;

			Icon.updateForIconCollisions(
				currentIcon,
				objects,
				index,
				objectDamping,
			);
			Icon.updateForTouchCollision(
				currentIcon,
				touchFrame,
				objectDamping,
				isTouchDown,
			);
		}
	}

	static updateForTouchCollision(currentIcon, frame, dampening, isTouchDown) {
		const touchFrame = new Frame(
			new Point(
				frame.origin.x - frame.size.width / 2,
				frame.origin.y - frame.size.height / 2,
			),
			frame.size,
		);

		if (!isTouchDown || currentIcon.isGrabbed) {
			if (!isTouchDown) {
				currentIcon.isGrabbed = false;
			}
			if (currentIcon.isGrabbed) {
				currentIcon.frame.origin.x = touchFrame.origin.x;
				currentIcon.frame.origin.y = touchFrame.origin.y;
				currentIcon.velocityPoint.x = 0;
				currentIcon.velocityPoint.y = 0;
			}
			return;
		}
		const collision = currentIcon.frame.circleCollision(touchFrame);
		const overlap =
			currentIcon.frame.size.width / 2 +
			touchFrame.size.width / 2 -
			collision;

		const overlapArea = currentIcon.frame.overlapArea(touchFrame);
		if (overlapArea > 2500) {
			currentIcon.isGrabbed = true;
			return;
		}

		if (collision) {
			// Calculate the separation vector
			const dx = currentIcon.frame.origin.x - touchFrame.origin.x;
			const dy = currentIcon.frame.origin.y - touchFrame.origin.y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			if (overlap > 0) {
				// Calculate the normal vector
				const nx = dx / distance;
				const ny = dy / distance;

				// Separate objects to avoid overlap
				const moveX = nx * overlap;
				const moveY = ny * overlap;

				currentIcon.velocityPoint.x += moveX;
				currentIcon.velocityPoint.y += moveY;

				// Apply damping to the velocities to simulate sliding on ice for objects
				currentIcon.velocityPoint.x = currentIcon.velocityPoint.x;
				currentIcon.velocityPoint.y = currentIcon.velocityPoint.y;
			}
		}
	}

	static updateForIconCollisions(
		currentIcon,
		objects,
		ignoreIndex,
		dampening,
	) {
		// Handle collisions with other objects
		for (let index = 0; index < objects.length; index++) {
			if (ignoreIndex !== index) {
				const otherIcon = objects[index];
				const collision = currentIcon.frame.circleCollision(
					otherIcon.frame,
				);
				const overlap =
					currentIcon.frame.size.width / 2 +
					otherIcon.frame.size.width / 2 -
					collision;

				if (collision) {
					// Calculate the separation vector
					const dx =
						currentIcon.frame.origin.x - otherIcon.frame.origin.x;
					const dy =
						currentIcon.frame.origin.y - otherIcon.frame.origin.y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (overlap > 0) {
						// Calculate the normal vector
						const nx = dx / distance;
						const ny = dy / distance;

						// Separate objects to avoid overlap
						const moveX = nx * overlap;
						const moveY = ny * overlap;

						currentIcon.velocityPoint.x += moveX;
						currentIcon.velocityPoint.y += moveY;
						otherIcon.velocityPoint.x -= moveX;
						otherIcon.velocityPoint.y -= moveY;

						// Apply damping to the velocities to simulate sliding on ice for objects
						currentIcon.velocityPoint.x =
							currentIcon.velocityPoint.x * dampening;
						currentIcon.velocityPoint.y =
							currentIcon.velocityPoint.y * dampening;

						// Apply damping to the velocities to simulate sliding on ice for objects
						otherIcon.velocityPoint.x =
							otherIcon.velocityPoint.x * dampening;
						otherIcon.velocityPoint.y =
							otherIcon.velocityPoint.y * dampening;
					}
				}
			}
		}
	}
}

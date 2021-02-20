/// Used to track time between render calls
var lastRender = 0;

/// The main game loop method that handles the render cycle
function gameLoop(timestamp) {
	var progress = timestamp - lastRender;

  	update(progress);
  	render();

  	lastRender = timestamp;
	window.requestAnimationFrame(gameLoop);
}

function update(progress) {

}

/// Main render method. This method manages calls to render each item.
function render() {
	const context = avatarCanvas.getContext('2d');
	context.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);
	renderIcons();
	renderPixels();
	renderFooter();
	renderTouchCircle();
}

function renderTouchCircle() {
	const context = avatarCanvas.getContext('2d');
	context.beginPath();
	context.arc(
		touchFrame.origin.x,
		touchFrame.origin.y,
		touchFrame.size.width/2,
		0, 2 * Math.PI, false);
	context.fillStyle = 'rgba(255, 255, 255, 0.5)';
	context.fill();
}

/// Render avatar pixels
function renderPixels() {
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
function renderFooter() {
	let context = avatarCanvas.getContext('2d');
	context.fillStyle = "#ffffff";
	context.fillRect(0, window.innerHeight - footerHeight,
		window.innerWidth, footerHeight);
	context.fillStyle = "#000000";
	context.fillRect(0, window.innerHeight - footerHeight,
		window.innerWidth, 5);
	context.font = "30px FFF Forward";
	context.textAlign = 'center';
	context.textBaseline = "middle";
	let textY = Math.ceil(window.innerHeight - (footerHeight/2) + 4)
	context.fillText("kwigbo.crypto",
		Math.ceil(window.innerWidth/2), textY);
}

/// Render the loading icons
function renderIcons() {
	let xpos = Math.ceil(window.innerWidth/2);
	let ypos = Math.ceil(window.innerHeight/2);

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
				let collision = currentIcon.frame.circleCollision(otherIcon.frame);
				if (collision) {
					performIconInteraction(currentIcon, otherIcon, 0);
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

function performIconInteraction(currentIcon, otherIcon, type) {
	switch(type) {
		case 0:
			let vCollision = new Point(
				otherIcon.frame.origin.x - currentIcon.frame.origin.x,
				otherIcon.frame.origin.y - currentIcon.frame.origin.y);

			var a = currentIcon.frame.origin.x - otherIcon.frame.origin.x;
			var b = currentIcon.frame.origin.y - otherIcon.frame.origin.y;
			var distance = Math.abs(Math.sqrt( a*a + b*b ));

			let vCollisionNorm = new Point(vCollision.x / distance, vCollision.y / distance);

			let vRelativeVelocity = new Point(
				currentIcon.velocityPoint.x - otherIcon.velocityPoint.x,
				currentIcon.velocityPoint.y - otherIcon.velocityPoint.y);

			let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

			currentIcon.velocityPoint.x -= (speed * vCollisionNorm.x);
			currentIcon.velocityPoint.y -= (speed * vCollisionNorm.y);
			otherIcon.velocityPoint.x += (speed * vCollisionNorm.x);
			otherIcon.velocityPoint.y += (speed * vCollisionNorm.y);
			currentIcon.move();
			otherIcon.move();
			break;
		case 1:
			currentIcon.repel(otherIcon.frame.origin.x, otherIcon.frame.origin.y);
			otherIcon.repel(currentIcon.frame.origin.x, currentIcon.frame.origin.y);
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

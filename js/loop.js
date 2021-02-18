var lastUpdate;

function gameLoop() {
	var now = window.Date.now();
	if (lastUpdate) {
		var elapsed = (now-lastUpdate) / 1000;
		lastUpdate = now;
		render();
	} else {
		lastUpdate = now;
	}
	window.requestAnimationFrame(gameLoop);
}

function render() {
	const context = avatarCanvas.getContext('2d');
	context.clearRect(0, 0, avatarCanvas.width, avatarCanvas.height);
	renderIcons();
	renderPixels();
	renderFooter();
}

function renderPixels() {
	for (var i = 0; i < pixels.length; i++) {
		let pixel = pixels[i];
		if (isTouchDown) {
			pixel.repel(touchX, touchY);
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

function renderIcons() {
	let xpos = Math.ceil(window.innerWidth/2);
	let ypos = Math.ceil(window.innerHeight/2);
	for (var i = 0; i < icons.length; i++) {
		let icon = icons[i];
		icon.move();
		icon.draw();
	}
}
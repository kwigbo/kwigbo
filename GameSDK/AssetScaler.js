class AssetScaler {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
	}

	scaleImage(image, scale, complete) {
		image.onload = function () {
			this.canvas.width = image.width * scale;
			this.canvas.height = image.height * scale;
			let tempContext = this.canvas.getContext("2d");
			tempContext.imageSmoothingEnabled = false;
			tempContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
			tempContext.drawImage(
				image,
				0,
				0,
				image.width,
				image.height,
				0,
				0,
				image.width * scale,
				image.height * scale
			);
			let scaledImage = new Image();
			scaledImage.src = this.canvas.toDataURL("image/png");
			complete(scaledImage);
		}.bind(this);
	}
}

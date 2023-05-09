/// Class used to define an image with assets layed out in a grid
class GridImage {
	/// Initialize a GridImage
	///
	/// - Parameters:
	///		- image: The image used as the base
	///		- gridSize: The size of the image in columns and rows
	///		- scale: What size the image should be scaled to. (Default 1)
	constructor(image, gridSize, scale) {
		this.image = image;
		this.scale = scale ? scale : 1;
		this.gridSize = gridSize;
	}
	/// Method used to load and scale the image to the specified size
	///
	/// - Parameters:
	///		- scaler: The scaler object used to scale the image.
	///		- complete: Function called when the image is scaled
	load(scaler, complete) {
		if (this.scale > 1) {
			scaler.scaleImage(
				this.image,
				this.scale,
				function (scaledImage) {
					this.image = scaledImage;
					this.updateImageDetails();
					complete();
				}.bind(this)
			);
		} else {
			this.image.onload = function () {
				this.updateImageDetails();
				complete();
			}.bind(this);
		}
	}
	/// Method used to update the details of the image after scale is set
	updateImageDetails() {
		this.frameSize = this.image.width / this.gridSize.columns;
		this.tileGrid = new GridArray(this.gridSize);
	}
}

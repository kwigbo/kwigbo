class TileSheet {
	constructor(image, tileSize, imageSize) {
		this.image = image;
		this.tileSize = tileSize;
		let columns = Math.floor(imageSize.width / this.tileSize);
		let rows = Math.floor(imageSize.height / this.tileSize);
		this.tileGrid = new GridArray(new GridSize(columns, rows));
	}
}

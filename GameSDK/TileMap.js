class TileMap {
	constructor(scale, canvas, size) {
		this.canvas = canvas;
		this.scale = scale;
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
		this.viewPort = new Frame(
			new Point(0, 0),
			new Size(this.canvas.width, this.canvas.height)
		);
		this.size = size;
		this.maxX = this.size.width - this.viewPort.size.width;
		this.maxY = this.size.height - this.viewPort.size.height;
	}

	resize(canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
		let currentPoint = this.viewPort.origin;
		this.viewPort = new Frame(
			currentPoint,
			new Size(this.canvas.width, this.canvas.height)
		);
	}

	scrollTo(point) {
		let offsetX = this.viewPort.origin.x;
		let offsetY = this.viewPort.origin.y;
		let halfWidth = Math.floor(this.viewPort.size.width / 2);
		let halfHeight = Math.floor(this.viewPort.size.height / 2);
		let newX = point.x;
		let newY = point.y;
		let minValueX = Math.max(0, newX - halfWidth);
		let minValueY = Math.max(0, newY - halfHeight);
		this.viewPort.origin.x = Math.min(minValueX, this.maxX);
		this.viewPort.origin.y = Math.min(minValueY, this.maxY);

		// let newX = this.currentPosition.x - offsetX;
		// let newY = this.currentPosition.y - offsetY;

		//this.x = x - this.w * 0.5;// Rigid scrolling
		//this.y = y - this.w * 0.5;
		//this.x += (x - this.x - this.w * 0.5) * 0.05;
		//this.y += (y - this.y - this.h * 0.5) * 0.05;
	}

	renderLayer(layer, tileSheet) {
		let scaledTileSize = tileSheet.tileSize * this.scale;
		var minColumn = Math.floor(this.viewPort.origin.x / scaledTileSize);
		var maxColumn = Math.ceil(
			(this.viewPort.origin.x + this.viewPort.size.width) / scaledTileSize
		);
		var minRow = Math.floor(this.viewPort.origin.y / scaledTileSize);
		var maxRow = Math.ceil(
			(this.viewPort.origin.y + this.viewPort.size.height) /
				scaledTileSize
		);
		if (minRow < 0) minRow = 0;
		if (maxRow > layer.size.rows) maxRow = layer.size.rows;
		if (minColumn < 0) minColumn = 0;
		if (maxRow > layer.size.columns) maxRow = layer.size.columns;
		for (let column = minColumn; column < maxColumn; column++) {
			for (let row = minRow; row < maxRow; row++) {
				let tileIndex = layer.getElementAt(
					new GridCoordinates(column, row)
				);
				let tileCoordinates =
					tileSheet.tileGrid.coordinatesForIndex(tileIndex);

				let xPos = Math.floor(
					column * scaledTileSize -
						this.viewPort.origin.x +
						this.canvas.width / 2 -
						this.viewPort.size.width / 2
				);
				let yPos = Math.floor(
					row * scaledTileSize -
						this.viewPort.origin.y +
						this.canvas.height / 2 -
						this.viewPort.size.height / 2
				);

				let drawPoint = new Point(Math.floor(xPos), Math.floor(yPos));
				this.drawTile(
					tileSheet,
					tileCoordinates,
					new Frame(
						drawPoint,
						new Size(scaledTileSize, scaledTileSize)
					)
				);
			}
		}
	}

	drawTile(tileSheet, tileCoordinates, drawFrame) {
		this.context.drawImage(
			tileSheet.image,
			tileCoordinates.column * tileSheet.tileSize,
			tileCoordinates.row * tileSheet.tileSize,
			tileSheet.tileSize,
			tileSheet.tileSize,
			drawFrame.origin.x,
			drawFrame.origin.y,
			drawFrame.size.width,
			drawFrame.size.height
		);
	}
}

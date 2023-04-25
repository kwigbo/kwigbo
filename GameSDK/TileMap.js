class TileMap {
	constructor(scale, canvas, size, tileSize) {
		this.scale = scale;
		this.canvas = canvas;
		this.size = size;
		this.tileSize = tileSize;
		this.scaledTileSize = this.tileSize * this.scale;
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
		this.viewPort = new Frame(
			new Point(0, 0),
			new Size(this.canvas.width, this.canvas.height)
		);

		let mapWidth = Math.ceil(size.columns * this.scaledTileSize);
		let mapHeight = Math.ceil(size.rows * this.scaledTileSize);
		this.maxX = mapWidth - this.viewPort.size.width;
		this.maxY = mapHeight - this.viewPort.size.height;
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

	loadMap() {}

	isWalkable(destinationFrame) {
		return true;
	}

	scrollTo(point, animated) {
		let currentX = this.viewPort.origin.x;
		let currentY = this.viewPort.origin.y;
		let halfWidth = Math.floor(this.viewPort.size.width / 2);
		let halfHeight = Math.floor(this.viewPort.size.height / 2);
		var xMove = point.x - currentX - halfWidth;
		var yMove = point.y - currentY - halfHeight;

		if (animated) {
			xMove = xMove * 0.05;
			yMove = yMove * 0.05;
		}

		if (Math.abs(xMove) < 0.5) {
			xMove = 0;
		}
		if (Math.abs(yMove) < 0.5) {
			yMove = 0;
		}

		let newX = this.viewPort.origin.x + xMove;
		newX = Math.min(Math.max(0, newX), this.maxX);
		let newY = this.viewPort.origin.y + yMove;
		newY = Math.min(Math.max(0, newY), this.maxY);

		this.viewPort.origin = new Point(newX, newY);
	}

	get minVisibleColumn() {
		var minColumn = Math.floor(
			this.viewPort.origin.x / this.scaledTileSize
		);
		if (minColumn < 0) minColumn = 0;
		return minColumn;
	}

	get maxVisibleColumn() {
		var maxColumn = Math.ceil(
			(this.viewPort.origin.x + this.viewPort.size.width) /
				this.scaledTileSize
		);
		if (maxColumn > this.size.columns) maxColumn = this.size.columns;
		return maxColumn;
	}

	get minVisibleRow() {
		var minRow = Math.floor(this.viewPort.origin.y / this.scaledTileSize);
		if (minRow < 0) minRow = 0;
		return minRow;
	}

	get maxVisibleRow() {
		var maxRow = Math.ceil(
			(this.viewPort.origin.y + this.viewPort.size.height) /
				this.scaledTileSize
		);
		if (maxRow > this.size.rows) maxRow = this.size.rows;
		return maxRow;
	}

	renderLayer(layer, tileSheet) {
		let minColumn = this.minVisibleColumn;
		let maxColumn = this.maxVisibleColumn;
		let minRow = this.minVisibleRow;
		let maxRow = this.maxVisibleRow;
		for (let column = minColumn; column < maxColumn; column++) {
			for (let row = minRow; row < maxRow; row++) {
				let tileIndex = layer.getElementAt(
					new GridCoordinates(column, row)
				);
				let tileCoordinates =
					tileSheet.tileGrid.coordinatesForIndex(tileIndex);

				let xPos = Math.floor(
					column * this.scaledTileSize -
						this.viewPort.origin.x +
						this.canvas.width / 2 -
						this.viewPort.size.width / 2
				);
				let yPos = Math.floor(
					row * this.scaledTileSize -
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
						new Size(this.scaledTileSize, this.scaledTileSize)
					)
				);
			}
		}
	}

	drawTile(tileSheet, tileCoordinates, drawFrame) {
		this.context.drawImage(
			tileSheet.image,
			tileCoordinates.column * this.tileSize,
			tileCoordinates.row * this.tileSize,
			this.tileSize,
			this.tileSize,
			drawFrame.origin.x,
			drawFrame.origin.y,
			drawFrame.size.width,
			drawFrame.size.height
		);
	}
}

import Frame from "./Geometry/Frame.js";
import Point from "./Geometry/Point.js";
import Size from "./Geometry/Size.js";
import GridCoordinates from "./GridUtil/GridCoordinates.js";

/// Class used to represent a scrolling tile map
export default class TileMap {
	/// Initialize a new tile map
	///
	/// - Parameters:
	///		- canvas: The canvas to draw to
	///		- gridSize: The GridSize of the tile map
	/// 	- tileSize: The size of the tiles in the map
	///		- viewPortSize: The size of the viewport for the map
	constructor(canvas, gridSize, tileSize, viewPortSize) {
		this.canvas = canvas;
		this.gridSize = gridSize;
		this.tileSize = tileSize;
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
		this.viewPortSize = viewPortSize
			? viewPortSize
			: new Size(this.canvas.width, this.canvas.height);
		this.viewPort = new Frame(
			new Point(
				this.canvas.width / 2 - this.viewPortSize.width / 2,
				this.canvas.height / 2 - this.viewPortSize.height / 2
			),
			new Size(this.viewPortSize.width, this.viewPortSize.height)
		);

		this.mapPosition = new Point(0, 0);

		this.mapWidth = Math.ceil(gridSize.columns * this.tileSize);
		this.mapHeight = Math.ceil(gridSize.rows * this.tileSize);
		this.maxX = this.mapWidth - this.viewPort.size.width;
		this.maxY = this.mapHeight - this.viewPort.size.height;
	}

	/// The frame for the camera/ visible map area
	get cameraFrame() {
		return new Frame(this.mapPosition, this.viewPort.size);
	}

	/// Method used to resize the tilemap
	///
	/// - Parameter canvas: The canvas to measure for resize
	resize(canvas) {
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;
		this.viewPort = new Frame(
			new Point(
				this.canvas.width / 2 - this.viewPortSize.width / 2,
				this.canvas.height / 2 - this.viewPortSize.height / 2
			),
			new Size(this.viewPortSize.width, this.viewPortSize.height)
		);
		this.maxX = this.mapWidth - this.viewPort.size.width;
		this.maxY = this.mapHeight - this.viewPort.size.height;
	}

	/// Method used to trigger the load of the map
	loadMap() {}

	/// Override to make tiles unwalkable
	///
	/// - Parameter coordinates: The coordinates to check walkability for
	/// - Returns: True if the coordinates are walkable
	isWalkable(coordinates) {
		return true;
	}

	/// Method used to scroll to a given point in the tile map
	///
	/// - Parameters:
	/// 	- point: The point to scroll to
	///		- animated: Should the scroll be animated?
	scrollTo(point, animated) {
		let currentX = this.mapPosition.x;
		let currentY = this.mapPosition.y;
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

		let newX = this.mapPosition.x + xMove;
		newX = Math.min(Math.max(0, newX), this.maxX);
		let newY = this.mapPosition.y + yMove;
		newY = Math.min(Math.max(0, newY), this.maxY);

		if (this.mapWidth <= this.viewPort.size.width) {
			newX = -(this.viewPort.size.width / 2 - this.mapWidth / 2);
		}
		if (this.mapHeight <= this.viewPort.size.height) {
			newY = -(this.viewPort.size.height / 2 - this.mapHeight / 2);
		}

		this.mapPosition = new Point(newX, newY);
	}

	/// Used to get the minimum visible column
	get minVisibleColumn() {
		var minColumn = Math.floor(this.mapPosition.x / this.tileSize);
		if (minColumn < 0) minColumn = 0;
		return minColumn;
	}

	/// Used to get the maxium visible column
	get maxVisibleColumn() {
		var maxColumn =
			Math.ceil(
				(this.mapPosition.x + this.viewPort.size.width) / this.tileSize
			) + 1;
		if (maxColumn > this.gridSize.columns)
			maxColumn = this.gridSize.columns;
		return maxColumn;
	}

	/// Used to get the minimum visible row
	get minVisibleRow() {
		var minRow = Math.floor(this.mapPosition.y / this.tileSize);
		if (minRow < 0) minRow = 0;
		return minRow;
	}

	/// Used to get the maxiumu visible row
	get maxVisibleRow() {
		var maxRow =
			Math.ceil(
				(this.mapPosition.y + this.viewPort.size.height) / this.tileSize
			) + 1;
		if (maxRow > this.gridSize.rows) maxRow = this.gridSize.rows;
		return maxRow;
	}

	/// Get the Point for a set of given GridCoordinates
	///
	/// - Parameter coordiantes: The coordinates to get the point for
	screenPointForCoordinates(coordiantes) {
		const realPoint = this.realPointForCoordinates(coordiantes);
		const frame = new Frame(realPoint, new Size(1, 1));
		const screenFrame = this.realFrameToScreenFrame(frame);
		return screenFrame.origin;
	}

	/// Get the Point for a set of given GridCoordinates
	/// This method uses world position and not viewport relative
	///
	/// - Parameter coordiantes: The coordinates to get the point for
	realPointForCoordinates(coordiantes) {
		let xPos = Math.floor(coordiantes.column * this.tileSize);
		let yPos = Math.floor(coordiantes.row * this.tileSize);
		return new Point(xPos, yPos);
	}

	/// Convert an on screen display frame to the real map frame
	///
	/// - Parameter frame: The frame that needs to be converted
	/// - Returns: The converted frame
	screenFrameToRealFrame(frame) {
		let mapX = this.mapPosition.x;
		let mapY = this.mapPosition.y;
		let viewPortHalfWidth = this.viewPort.size.width / 2;
		let viewPortHalfHeight = this.viewPort.size.height / 2;
		let newX =
			frame.origin.x +
			mapX -
			this.canvas.width / 2 +
			viewPortHalfWidth +
			frame.size.width / 2;
		let newY =
			frame.origin.y +
			mapY -
			this.canvas.height / 2 +
			viewPortHalfHeight +
			frame.size.height / 2;
		return new Frame(
			new Point(Math.floor(newX), Math.floor(newY)),
			frame.size
		);
	}

	/// Convert a real map frame to the on screen display frame
	///
	/// - Parameter frame: The frame that needs to be converted
	/// - Returns: The converted frame
	realFrameToScreenFrame(frame) {
		return new Frame(this.realPointToScreenPoint(frame.origin), frame.size);
	}

	/// Convert a real point to a screen relative point
	///
	/// - Parameter point: The point to convert
	/// - Returns: The converted point.
	realPointToScreenPoint(point) {
		let viewPortHalfWidth = this.viewPort.size.width / 2;
		let viewPortHalfHeight = this.viewPort.size.height / 2;

		const hOffset = this.mapPosition.x - this.viewPort.origin.x;
		const vOffset = this.mapPosition.y - this.viewPort.origin.y;

		let newX = point.x - hOffset;
		let newY = point.y - vOffset;
		return new Point(Math.floor(newX), Math.floor(newY));
	}

	/// Get the center Point for a set of given GridCoordinates
	///
	/// - Parameter coordiantes: The coordinates to get the point for
	centerPointForCoordinates(coordiantes) {
		const topLeftPoint = this.realPointForCoordinates(coordiantes);
		const halfTile = Math.floor(this.tileSize / 2);
		return new Point(topLeftPoint.x + halfTile, topLeftPoint.y + halfTile);
	}

	/// Get the coordinates for a given point
	///
	/// - Parameter point: The point to get the coordinates for
	/// - Returns: The coordinates for the given point.
	coordinatesForPoint(point) {
		return new GridCoordinates(
			Math.floor(point.x / this.tileSize),
			Math.floor(point.y / this.tileSize)
		);
	}

	/// Render a given gridArray in the visible area
	///
	/// - Parameters:
	///		- gridArray: Layer data to use to render a layer
	///		- tileSheetManager: The tile sheet manager to get the GridImage needed to render
	renderLayer(gridArray, tileSheetManager) {
		let minColumn = this.minVisibleColumn;
		let maxColumn = this.maxVisibleColumn;
		let minRow = this.minVisibleRow;
		let maxRow = this.maxVisibleRow;
		for (let column = minColumn; column < maxColumn; column++) {
			for (let row = minRow; row < maxRow; row++) {
				const currentCoordinates = new GridCoordinates(column, row);
				const tileGID = gridArray.getElementAt(currentCoordinates);
				const gridImage = tileSheetManager.tileSheetForGID(tileGID);
				if (gridImage) {
					const tileCoordinates =
						gridImage.coordinatesForGID(tileGID);
					const position =
						this.realPointForCoordinates(currentCoordinates);
					const drawPoint = new Point(position.x, position.y);
					this.drawTile(
						gridImage,
						tileCoordinates,
						new Frame(
							drawPoint,
							new Size(this.tileSize, this.tileSize)
						)
					);
				}
			}
		}
	}

	/// Render a given gridArray in the visible area
	///
	/// - Parameters:
	///		- gridArray: Layer data to use to render a layer
	///		- gridImage: The tile sheet needed to render
	renderGridImageLayer(gridArray, gridImage) {
		let minColumn = this.minVisibleColumn;
		let maxColumn = this.maxVisibleColumn;
		let minRow = this.minVisibleRow;
		let maxRow = this.maxVisibleRow;
		for (let column = minColumn; column < maxColumn; column++) {
			for (let row = minRow; row < maxRow; row++) {
				const currentCoordinates = new GridCoordinates(column, row);
				if (gridImage) {
					const tileIndex =
						gridArray.getElementAt(currentCoordinates);
					const tileCoordinates =
						gridImage.coordinatesForGID(tileIndex);
					const position =
						this.realPointForCoordinates(currentCoordinates);
					const drawPoint = new Point(position.x, position.y);
					this.drawTile(
						gridImage,
						tileCoordinates,
						new Frame(
							drawPoint,
							new Size(this.tileSize, this.tileSize)
						)
					);
				}
			}
		}
	}

	/// Method to draw an individual tile
	///
	/// - Parameters:
	///		- gridImage: The GridImage for the tile sheet in this layer
	///		- tileCoordinates: The coordinates of the tile to draw
	///		- drawFrame: The frame in which to draw the tile.
	drawTile(gridImage, tileCoordinates, drawFrame) {
		const screenFrame = this.realFrameToScreenFrame(drawFrame);
		this.context.drawImage(
			gridImage.image,
			tileCoordinates.column * this.tileSize,
			tileCoordinates.row * this.tileSize,
			this.tileSize,
			this.tileSize,
			screenFrame.origin.x,
			screenFrame.origin.y,
			screenFrame.size.width,
			screenFrame.size.height
		);
	}
}

import GridCoordinates from "../GameSDK/GridCoordinates.js";
import Point from "../GameSDK/Point.js";
import CowSprite from "./CowSprite.js";
import BabyCowSprite from "./BabyCowSprite.js";

export default class CowManager {
	constructor(canvas, layer, map, tileSize) {
		this.canvas = canvas;
		this.layer = layer;
		this.map = map;
		this.cows = [];
		this.tileSize = tileSize;
	}
	render() {
		this.cows.forEach(function (item, index) {
			item.render();
		});
	}
	checkForCollision(touchFrame) {
		for (let i = 0; i < this.cows.length; i++) {
			let cow = this.cows[i];
			if (cow.isOnscreen) {
				let frame = cow.frame;
				if (frame.collided(touchFrame)) {
					cow.touch();
					return true;
				}
			}
		}
		return false;
	}
	createCows(cowGridImages, babyCowGridImages) {
		this.cows = [];
		for (let column = 0; column < this.layer.size.columns; column++) {
			for (let row = 0; row < this.layer.size.rows; row++) {
				let tileIndex = parseInt(
					this.layer.getElementAt(new GridCoordinates(column, row))
				);
				if (tileIndex !== -1) {
					let startX = column * this.tileSize;
					let startY = row * this.tileSize;
					let startPoint = new Point(startX, startY);
					if (tileIndex === 5) {
						let babyCow = new BabyCowSprite(
							babyCowGridImages,
							this.canvas,
							this.map,
							startPoint
						);
						this.cows.push(babyCow);
					} else {
						let cow = new CowSprite(
							cowGridImages,
							this.canvas,
							this.map,
							startPoint
						);
						this.cows.push(cow);
					}
				}
			}
		}
	}
}

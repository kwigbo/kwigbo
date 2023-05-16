import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Point from "../GameSDK/Geometry/Point.js";
import CowSprite from "./CowSprite.js";
import BabyCowSprite from "./BabyCowSprite.js";

export default class CowManager {
	constructor(canvas, layer, map, tileSize) {
		this.canvas = canvas;
		this.layer = layer;
		this.map = map;
		this.cows = [];
		this.babyCows = [];
		this.tileSize = tileSize;
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
		for (let i = 0; i < this.babyCows.length; i++) {
			let cow = this.babyCows[i];
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
		this.babyCows = [];
		for (let column = 0; column < this.layer.size.columns; column++) {
			for (let row = 0; row < this.layer.size.rows; row++) {
				const gridCoordinates = new GridCoordinates(column, row);
				let tileIndex = parseInt(
					this.layer.getElementAt(gridCoordinates)
				);
				if (tileIndex !== -1) {
					let startPoint =
						this.map.centerPointForCoordinates(gridCoordinates);
					if (tileIndex === 5) {
						let babyCow = new BabyCowSprite(
							babyCowGridImages,
							this.canvas,
							this.map,
							startPoint
						);
						this.babyCows.push(babyCow);
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

import GridCoordinates from "../GameSDK/GridUtil/GridCoordinates.js";
import Point from "../GameSDK/Geometry/Point.js";
import CowSprite from "./CowSprite.js";
import BabyCowSprite from "./BabyCowSprite.js";

export default class CowManager {
	constructor(canvas, scale, spriteObjects, map, tileSize) {
		this.canvas = canvas;
		this.scale = scale;
		this.spriteObjects = spriteObjects;
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
		for (const index in this.spriteObjects) {
			const sprite = this.spriteObjects[index];
			const gid = sprite.gid;
			const point = new Point(
				Math.floor(sprite.x * this.scale),
				Math.floor(sprite.y * this.scale)
			);
			if (gid === 371) {
				let cow = new CowSprite(
					cowGridImages,
					this.canvas,
					this.map,
					point
				);
				this.cows.push(cow);
			} else if (gid === 435) {
				let babyCow = new BabyCowSprite(
					babyCowGridImages,
					this.canvas,
					this.map,
					point
				);
				this.babyCows.push(babyCow);
			}
		}
	}
}

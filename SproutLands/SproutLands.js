import TiledScene from "../GameSDK/Tiled/TiledScene.js";
import Size from "../GameSDK/Geometry/Size.js";
import GridSize from "../GameSDK/GridUtil/GridSize.js";
import Point from "../GameSDK/Geometry/Point.js";
import Sprite from "../GameSDK/Sprite.js";

import CowSprite from "./Sprites/CowSprite.js";
import BabyCowSprite from "./Sprites/BabyCowSprite.js";
import MainCharacter from "./Sprites/MainCharacter.js";
import ThetaChestSprite from "./Sprites/ThetaChestSprite.js";
import Goblin from "./Sprites/Goblin.js";

import ColorOverlayEffect from "../GameSDK/Tiled/Effects/ColorOverlayEffect.js";
import RainEffect from "../GameSDK/Tiled/Effects/RainEffect.js";

import ThetaInterface from "./Lib/ThetaInterface.js";

export default class SproutLands extends TiledScene {
	constructor(rootContainer) {
		super(rootContainer, "./Maps/MainMap.json");
		// const theta = new ThetaInterface();
		// ThetaChestSprite.loadSVGs();
		// this.balancesLoaded = false;
		// theta.getCurrentTreasure(
		// 	function (tfuel, tdrop) {
		// 		if (this.chestSprite) {
		// 			this.chestSprite.tfuelAmount = tfuel;
		// 			this.chestSprite.tdropAmount = tdrop;
		// 			this.balancesLoaded = true;
		// 		}
		// 	}.bind(this)
		// );
	}

	customSetupAfterLoad() {
		super.customSetupAfterLoad();
		const sprites = this.spriteManager.allSprites;
		for (const index in sprites) {
			const sprite = sprites[index];
			const properties = sprite.properties;
			if (properties && properties.type === "babyCow") {
				sprite.followSprite = this.character;
				// this.astar = sprite.astar;
				// this.astar.debug = true;
			}
		}

		this.spriteManager.ignoreListForSprite = function (bySprite) {
			const properties = bySprite.properties;
			let array = [];
			if (properties && properties.type) {
				switch (properties.type) {
					case "babyCow":
						array.push(this.character.id);
				}
			}
			if (this.portalIds) {
				array = array.concat(this.portalIds);
			}
			return array;
		}.bind(this);

		if (!this.chestSprite) {
			const chestDetails = {
				path: `${this.assetRootPath}Chest.png`,
				gridSize: new GridSize(6, 1),
			};
			this.assetManager.loadCustomSheet(
				chestDetails,
				1,
				function (sheet) {
					this.chestSprite = new ThetaChestSprite(
						sheet,
						this.canvas,
						null,
						new Point(10, 0),
						1,
					);
				}.bind(this),
			);
		}

		const urlParams = new URLSearchParams(
			window.location.search.toLowerCase(),
		);
		let isRaining = urlParams.get("raining") === "true";
		if (isRaining) {
			this.overlayEffects = [
				new ColorOverlayEffect(
					this.canvas,
					this.cameraFrame,
					"rgba(0, 0, 0, 0.25)",
				),
				new RainEffect(this.canvas, this.cameraFrame),
			];
		}
	}

	render() {
		super.render();
		if (this.chestSprite && this.balancesLoaded) {
			this.chestSprite.render();
		}
	}

	touch(isTouchDown) {
		const touchFrame = this.touchFrame;
		const collided = this.chestSprite.hitFrame.collided(touchFrame);
		if (isTouchDown && collided) {
			this.chestSprite.toggle();
		} else {
			super.touch(isTouchDown);
		}
	}

	get assetRootPath() {
		return "./AssetManager/Assets/";
	}

	get mapsPath() {
		return "./Maps/";
	}

	get scale() {
		return 4;
	}

	get viewPortSize() {
		return new Size(this.canvas.width, this.canvas.height);
		// return new Size(400, 400);
	}

	get character() {
		return this.loadedCharacter;
	}

	prepareForMapLoad() {
		super.prepareForMapLoad();
		this.loadedCharacter = null;
	}

	onCharacterMove(character) {
		const collidedSprites = this.spriteManager.checkForCollision(character);
		if (collidedSprites.length > 0) {
			for (const index in collidedSprites) {
				const sprite = collidedSprites[index];
				const properties = sprite.properties;
				if (properties && properties.type) {
					switch (properties.type) {
						case "portal":
							this.checkPortal(properties);
							break;
					}
				}
			}
		}
	}

	/// Check for
	checkPortal(properties) {
		const loadedMap = this.mapLoader.loadedMap;
		if (!loadedMap) {
			return;
		}
		const destination = properties.destination;
		if (destination) {
			let stoppedOnPortal = false;
			if (this.lastPortalPoint) {
				stoppedOnPortal = this.character.currentPosition.isEqual(
					this.lastPortalPoint,
				);
			}
			if (stoppedOnPortal) {
				this.transport(destination);
			} else {
				this.lastPortalPoint = this.character.currentPosition;
			}
		}
	}

	getSpriteForId(details, tileSheet, start) {
		if (!details) {
			return null;
		}
		const loadedMap = this.mapLoader.loadedMap;
		const type = details.properties.type;
		if (loadedMap) {
			switch (type) {
				case "babyCow":
					return new BabyCowSprite(
						tileSheet,
						this.canvas,
						loadedMap,
						start,
						this.scale,
					);
				case "goblin":
					let goblin = new Goblin(
						tileSheet,
						this.canvas,
						loadedMap,
						start,
						this.scale,
					);
					return goblin;
				case "character":
					if (!this.loadedCharacter) {
						this.loadedCharacter = new MainCharacter(
							tileSheet,
							this.canvas,
							loadedMap,
							start,
						);
						//this.loadedCharacter.debugFrameEnabled = true;
						this.loadedCharacter.positionUpdated =
							this.onCharacterMove.bind(this);
						return this.loadedCharacter;
					}
				case "cow":
					return new CowSprite(
						tileSheet,
						this.canvas,
						loadedMap,
						start,
					);
				case "portal":
					const portalSprite = new Sprite(
						tileSheet,
						new Size(16 * this.scale, 16 * this.scale),
						this.canvas,
						loadedMap,
						start,
					);
					if (!this.portalIds) {
						this.portalIds = [];
					}
					this.portalIds.push(portalSprite.id);
					return portalSprite;
			}
		}

		return null;
	}
}

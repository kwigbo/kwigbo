import TiledScene from "../GameSDK/Tiled/TiledScene.js";
import Size from "../GameSDK/Geometry/Size.js";
import Point from "../GameSDK/Geometry/Point.js";
import Sprite from "../GameSDK/Sprite.js";

import CowSprite from "./Sprites/CowSprite.js";
import BabyCowSprite from "./Sprites/BabyCowSprite.js";
import MainCharacter from "./Sprites/MainCharacter.js";

import AnimatedCircleMaskEffect from "../GameSDK/Tiled/EffectStates/AnimatedCircleMaskEffect.js";

export default class SproutLands extends TiledScene {
	constructor(rootContainer) {
		super(rootContainer, "./Maps/MainMap.json");
	}

	customSetupAfterLoad() {
		const sprites = this.spriteManager.allSprites;
		for (const index in sprites) {
			const sprite = sprites[index];
			const properties = sprite.properties;
			if (properties && properties.type === "babyCow") {
				//sprite.followSprite = this.character;
			}
		}
		this.checkAndTransitionIn();
	}

	checkAndTransitionIn() {
		if (!this.effect) {
			return;
		}
		const loadedMap = this.mapLoader.loadedMap;
		if (!loadedMap) {
			return;
		}
		const cameraFrame = loadedMap.realFrameToScreenFrame(
			loadedMap.cameraFrame
		);
		let startPoint = loadedMap.realPointToScreenPoint(
			this.character.currentPosition
		);
		startPoint = new Point(
			startPoint.x - cameraFrame.origin.x,
			startPoint.y - cameraFrame.origin.y
		);
		this.effect = new AnimatedCircleMaskEffect(
			this.canvas,
			startPoint,
			cameraFrame,
			true,
			function () {
				this.effect = null;
			}.bind(this)
		);
	}

	get assetRootPath() {
		return "./AssetManager/Assets/";
	}

	get scale() {
		return 4;
	}

	get viewPortSize() {
		// return new Size(this.canvas.width, this.canvas.height);
		return new Size(400, 400);
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
					this.lastPortalPoint
				);
			}
			if (stoppedOnPortal) {
				const cameraFrame = loadedMap.realFrameToScreenFrame(
					loadedMap.cameraFrame
				);
				let startPoint = loadedMap.realPointToScreenPoint(
					this.character.currentPosition
				);
				startPoint = new Point(
					startPoint.x - cameraFrame.origin.x,
					startPoint.y - cameraFrame.origin.y
				);
				this.effect = new AnimatedCircleMaskEffect(
					this.canvas,
					startPoint,
					cameraFrame,
					false,
					function () {
						this.prepareForMapLoad();
						this.mapLoader.loadMapJSON(`./Maps/${destination}`);
					}.bind(this)
				);
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
						start
					);
				case "character":
					if (!this.loadedCharacter) {
						this.loadedCharacter = new MainCharacter(
							tileSheet,
							this.canvas,
							loadedMap,
							start
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
						start
					);
				case "portal":
					const portalSprite = new Sprite(
						tileSheet,
						16 * 4,
						this.canvas,
						loadedMap,
						start
					);
					portalSprite.disableRender = true;
					return portalSprite;
			}
		}

		return null;
	}
}

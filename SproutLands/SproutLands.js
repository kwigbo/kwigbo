import TiledScene from "../GameSDK/Tiled/TiledScene.js";
import Size from "../GameSDK/Geometry/Size.js";

import CowSprite from "./Sprites/CowSprite.js";
import BabyCowSprite from "./Sprites/BabyCowSprite.js";
import MainCharacter from "./Sprites/MainCharacter.js";

export default class SproutLands extends TiledScene {
	constructor(rootContainer) {
		super(rootContainer, "./Maps/MainMap.json");
	}

	customSetupAfterLoad() {
		const babyCows = this.spriteManager.sprites["Baby Brown Cow"];
		for (const index in babyCows) {
			const babyCow = babyCows[index];
			babyCow.followSprite = this.character;
		}
	}

	get assetRootPath() {
		return "./AssetManager/Assets/";
	}

	get scale() {
		return 4;
	}

	get viewPortSize() {
		return new Size(400, 400);
	}

	getSpriteForId(spriteId, tileSheet, start) {
		const loadedMap = this.mapLoader.loadedMap;
		if (loadedMap) {
			switch (spriteId) {
				case "Baby Brown Cow":
					return new BabyCowSprite(
						tileSheet,
						this.canvas,
						loadedMap,
						start
					);
				case "Character":
					return new MainCharacter(
						tileSheet,
						this.canvas,
						loadedMap,
						start
					);
				case "Brown Cow":
					return new CowSprite(
						tileSheet,
						this.canvas,
						loadedMap,
						start
					);
			}
		}

		return null;
	}
}

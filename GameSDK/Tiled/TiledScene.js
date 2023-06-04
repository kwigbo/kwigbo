import Scene from "../Scene.js";
import TileMap from "../TileMap.js";
import GridSize from "../GridUtil/GridSize.js";
import Size from "../Geometry/Size.js";
import Point from "../Geometry/Point.js";
import Frame from "../Geometry/Frame.js";
import TiledMapLoader from "./TiledMapLoader.js";
import TiledAssetManager from "./TiledAssetManager.js";
import TiledSpriteManager from "./TiledSpriteManager.js";
import TiledTileMap from "./TiledTileMap.js";
import CircleMaskEffect from "./Effects/CircleMaskEffect.js";

/// Class used to represent a game based on Tiled created maps
export default class TiledScene extends Scene {
	/// Initialize the scene
	///
	/// - Parameters:
	///		- rootContainer: The root container used for display
	///		- startMapPath: Path the the original map to load.
	constructor(rootContainer, startMapPath) {
		super(rootContainer);
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id", "mainCanvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.rootContainer.appendChild(this.canvas);
		this.transitionEffect = null;
		this.overlayEffects = [];
		this.displayLoop.start(60);

		this.isLoading = true;
		this.touchEnabled = false;
		this.assetManager = new TiledAssetManager(
			this.onAssetsLoaded.bind(this),
			this.assetRootPath
		);
		this.spriteManager = new TiledSpriteManager();
		this.mapLoader = new TiledMapLoader(
			this.onMapLoaded.bind(this),
			this.scale,
			this.canvas,
			this.viewPortSize
		);
		this.mapLoader.loadMapJSON(startMapPath);
	}

	/// Used to manage input changes
	touch(isTouchDown) {
		const loadedMap = this.mapLoader.loadedMap;
		if (!this.touchEnabled || !loadedMap) {
			return this.touchFrame;
		}
		const touchFrame = this.currentTouchFrame;
		if (!this.spriteManager.touch(touchFrame, isTouchDown)) {
			if (isTouchDown) {
				const newPoint = touchFrame.origin;
				const walkTo = loadedMap.coordinatesForPoint(newPoint);
				const isCurrentCoordinates = walkTo.isEqual(
					this.character.currentCoordinates
				);
				if (!isCurrentCoordinates && loadedMap.isWalkable(walkTo)) {
					this.character.walkTo(walkTo);
				}
			}
		}
	}

	touchMoved(isTouchDown) {
		this.spriteManager.touchMoved(this.currentTouchFrame, isTouchDown);
	}

	get currentTouchFrame() {
		const loadedMap = this.mapLoader.loadedMap;
		if (!this.touchEnabled || !loadedMap) {
			return this.touchFrame;
		}
		const point = this.touchFrame.origin;
		let touchFrame = new Frame(
			new Point(point.x - 1, point.y - 1),
			new Size(2, 2)
		);
		return loadedMap.screenFrameToRealFrame(touchFrame);
	}

	prepareForMapLoad() {
		this.touchEnabled = false;
		this.isLoading = true;
	}

	// MARK: TiledScene Overridden Methods

	getSpriteForId(spriteId, tileSheet, start) {
		return null;
	}

	get assetRootPath() {
		return "./";
	}

	get mapsPath() {
		return "./";
	}

	get scale() {
		return 1;
	}

	get mainCharacterId() {
		return "Character";
	}

	get viewPortSize() {
		if (this.canvas) {
			return new Size(this.canvas.width, this.canvas.height);
		}
		// Sane default
		return new Size(100, 100);
	}

	get character() {
		return new Sprite();
	}

	customSetupAfterLoad() {}

	// MARK: Event Methods

	onAssetsLoaded() {
		const loadedMap = this.mapLoader.loadedMap;
		this.spriteManager.generateSprites(
			this.assetManager,
			loadedMap,
			this.scale,
			this.getSpriteForId.bind(this)
		);
		loadedMap.spriteManager = this.spriteManager;
		if (this.character) {
			loadedMap.scrollTo(this.character.currentPosition, false);
		}
		this.customSetupAfterLoad();
		this.touchEnabled = true;
		this.isLoading = false;
	}

	onMapLoaded() {
		const loadedMap = this.mapLoader.loadedMap;
		this.assetManager.loadTileSets(
			this.scale,
			loadedMap.tileSize,
			loadedMap.tileSetsJSON
		);
	}

	// MARK: Scene Overridden Methods

	resize() {
		super.resize();
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.mapLoader.loadedMap.resize(this.canvas);
	}

	touchStart(event) {
		super.touchStart(event);
		this.touch(true);
	}

	mouseDown(event) {
		super.mouseDown(event);
		this.touch(true);
	}

	touchEnd() {
		this.isTouchDown = false;
		this.touch(false);
	}

	mouseUp() {
		this.isTouchDown = false;
		this.touch(false);
	}

	mouseMove(event) {
		super.mouseMove(event);
		this.touchMoved(this.isTouchDown);
	}

	touchMove(event) {
		super.touchMove(event);
		this.touchMoved(this.isTouchDown);
	}

	render() {
		const loadedMap = this.mapLoader.loadedMap;

		const context = this.canvas.getContext("2d");
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		if (this.isLoading || !loadedMap || !this.character) {
			for (const index in this.overlayEffects) {
				const effect = this.overlayEffects[index];
				effect.render();
			}
			if (this.transitionEffect) {
				this.transitionEffect.render();
			}
			this.drawFrame(context, this.cameraFrame);
			return;
		}

		// Position the map
		loadedMap.scrollTo(this.character.currentPosition, true);

		const realCameraFrame = loadedMap.realFrameToScreenFrame(
			loadedMap.cameraFrame
		);
		context.save();
		this.clipFrame(context, realCameraFrame);

		const keys = Object.keys(loadedMap.layers);
		for (const index in keys) {
			const key = keys[index];
			const layer = loadedMap.layers[key].layer;
			if (key === TiledTileMap.SpritesLayer) {
				this.spriteManager.render();
			} else if (key !== TiledTileMap.WalkableLayer) {
				loadedMap.renderLayer(layer, this.assetManager);
			}
		}

		for (const index in this.overlayEffects) {
			const effect = this.overlayEffects[index];
			effect.render();
		}

		if (this.transitionEffect) {
			this.transitionEffect.render();
		}

		context.restore();
		this.drawFrame(context, this.cameraFrame);
	}

	get cameraFrame() {
		const x = this.canvas.width / 2 - this.viewPortSize.width / 2;
		const y = this.canvas.height / 2 - this.viewPortSize.height / 2;
		return new Frame(new Point(x, y), this.viewPortSize);
	}

	clipFrame(context, cameraFrame) {
		context.beginPath();
		context.rect(
			cameraFrame.origin.x,
			cameraFrame.origin.y,
			cameraFrame.size.width,
			cameraFrame.size.height
		);
		context.clip();
	}

	drawFrame(context, cameraFrame) {
		context.strokeStyle = "rgba(0, 0, 0, 0.5)";
		context.lineWidth = 10;
		context.strokeRect(
			cameraFrame.origin.x,
			cameraFrame.origin.y,
			cameraFrame.size.width,
			cameraFrame.size.height
		);
	}

	characterScreenPoint() {
		const loadedMap = this.mapLoader.loadedMap;
		if (!loadedMap) {
			return new Point(0, 0);
		}
		let point = loadedMap.realPointToScreenPoint(
			this.character.currentPosition
		);
		point = new Point(
			point.x - this.cameraFrame.origin.x,
			point.y - this.cameraFrame.origin.y
		);
		return point;
	}

	transport(destination, effectClass) {
		const EffectClass = effectClass ? effectClass : CircleMaskEffect;
		this.transitionEffect = new EffectClass(
			this.canvas,
			this.characterScreenPoint(),
			this.cameraFrame,
			function () {
				this.prepareForMapLoad();
				this.mapLoader.loadMapJSON(`${this.mapsPath}${destination}`);
				const waitTimer = setInterval(
					function () {
						if (!this.isLoading) {
							window.clearInterval(waitTimer);
							this.transitionEffect.reverseEffect(
								this.characterScreenPoint(),
								function () {
									this.transitionEffect = null;
								}.bind(this)
							);
						}
					}.bind(this),
					100
				);
			}.bind(this)
		);
	}
}

import Scene from "../GameSDK/Scene.js";
import TileMap from "../GameSDK/TileMap.js";
import GridSize from "../GameSDK/GridUtil/GridSize.js";
import Size from "../GameSDK/Geometry/Size.js";
import MainMap from "./Maps/MainMap.js";

export default class SproutLands extends Scene {
	constructor(rootContainer) {
		super(rootContainer);
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id", "mainCanvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.rootContainer.appendChild(this.canvas);

		// Preloader Container
		this.preloader = document.createElement("div");
		this.preloader.setAttribute("id", "preloader");
		this.preloader.setAttribute("class", "centeredContainer");

		// Spinner
		const spinner = document.createElement("div");
		spinner.setAttribute("class", "lds-circle");
		const innerDiv = document.createElement("div");
		spinner.appendChild(innerDiv);
		this.preloader.appendChild(spinner);

		this.rootContainer.appendChild(this.preloader);

		this.displayLoop.start(60);
		this.loadMap("./Maps/MainMap.json");
	}

	loadMap(path) {
		this.preloader.style.opacity = 1;
		this.canvas.style.opacity = 0;

		TileMap.loadMapsJSON(
			path,
			function (json) {
				let height = json.height;
				let width = json.width;
				let tileWidth = json.tilewidth;
				let gridSize = new GridSize(width, width);
				let scale = 4;
				let viewPortSize = new Size(
					this.canvas.width,
					this.canvas.height
				);
				this.map = new MainMap(
					this.canvas,
					gridSize,
					tileWidth * scale,
					viewPortSize
				);
				this.map.load(
					scale,
					json,
					this.loadMap.bind(this),
					function () {
						this.preloader.style.opacity = 0;
						this.canvas.style.opacity = 1;
					}.bind(this)
				);
			}.bind(this)
		);
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		if (this.map) {
			this.map.viewPortSize = new Size(
				this.canvas.width,
				this.canvas.height
			);
			this.map.resize(this.canvas);
		}
	}

	inputUpdated() {
		if (this.map) {
			this.map.updateTouchPoint(this.touchFrame.origin);
		}
	}

	touchStart(event) {
		super.touchStart(event);
		this.inputUpdated();
	}

	mouseDown(event) {
		super.mouseDown(event);
		this.inputUpdated();
	}

	render() {
		if (this.map) {
			this.map.render();
		}
	}
}

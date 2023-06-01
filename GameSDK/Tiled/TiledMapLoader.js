import TiledTileMap from "./TiledTileMap.js";

/// Class used to load a Tiled created map JSON
export default class TiledMapLoader {
	/// Initialize a new map loader
	///
	/// - mapLoaded: The method called when a map load is completed
	constructor(onMapLoaded, scale, canvas, viewPortSize) {
		this.onMapLoaded = onMapLoaded;
		this.loadedMap = null;
		this.canvas = canvas;
		this.scale = scale;
		this.viewPortSize = viewPortSize;
	}
	/// Method used to load a CSV layer map
	///
	/// - Parameters:
	///		- name: The name of the map to load
	/// 	- complete: The Method called when the map is loaded
	async loadMapJSON(path) {
		let response = await fetch(path);
		let json = await response.json();
		this.parseLoadedMap(json);
	}

	/// Used to take the Tiled map editor data and create a TileMap
	///
	/// - Parameter json: The JSON object used to represent the map
	parseLoadedMap(json) {
		this.loadedMap = new TiledTileMap(
			this.canvas,
			this.viewPortSize,
			json,
			this.scale
		);
		this.onMapLoaded();
	}
}

import TileMap from "../TileMap.js";
import GridArray from "../GridUtil/GridArray.js";
import GridSize from "../GridUtil/GridSize.js";

/// Class used to load a Tiled created map JSON
export default class TiledTileMap extends TileMap {
	/// Layer that defines all sprite locations
	static SpritesLayer = "Sprites";

	/// Layer that defines walkable location
	static WalkableLayer = "Walkable";

	/// Initialize a new tile map
	///
	/// - Parameters:
	///		- canvas: The canvas to draw to
	///		- viewPortSize: The size of the viewport for the map
	///		- json: The loaded JSON for understanding the map
	///		- scale: The scale to display the map at
	constructor(canvas, viewPortSize, json, scale) {
		let height = json.height;
		let width = json.width;
		let tileSize = json.tilewidth * scale;
		let gridSize = new GridSize(width, width);

		super(canvas, gridSize, tileSize, viewPortSize);
		this.json = json;
		this.tileSetsJSON = null;
		this.spriteObjects = null;
		this.layers = {};
		this.parseLayers();
	}

	/// Parse the layers out of the Tiled JSON
	parseLayers() {
		const jsonLayers = this.json.layers;
		this.tileSetsJSON = this.json.tilesets;
		for (const index in jsonLayers) {
			const layer = jsonLayers[index];
			const layerName = layer.name;
			if (layerName == TiledTileMap.SpritesLayer) {
				this.spriteObjects = layer.objects;
				this.layers[layerName] = {
					layer: this.createLayer(null, this.gridSize),
					name: layerName,
				};
			} else {
				this.layers[layerName] = {
					layer: this.createLayer(layer.data, this.gridSize),
					name: layerName,
				};
			}
		}
	}

	/// Check the walkable layer to see if tiles are walkable
	///
	/// - Parameter coordinates: The coordinates to check
	/// - Parameter bySprite: The sprite to check walkability for.
	/// - Returns: true if the tile is walkable
	isWalkable(coordinates, bySprite) {
		const walkableLayer = this.layers[TiledTileMap.WalkableLayer];
		const gid = walkableLayer.layer.getElementAt(coordinates);
		let spriteWalkable = true;
		if (this.spriteManager) {
			spriteWalkable = this.spriteManager.isWalkable(
				coordinates,
				bySprite
			);
		}
		return gid === 0 && spriteWalkable;
	}

	/// Create an individual GridArray layer
	///
	/// - Parameters:
	///		- dataArray: The array of values used to represent tiles in the layer
	///		- gridSize: The expected size of the layer
	///	- Returns: The GridArray representing the layer
	createLayer(dataArray, gridSize) {
		let layer = new GridArray(gridSize, 0);
		if (dataArray) {
			layer.overwriteElements(dataArray);
		}
		return layer;
	}
}

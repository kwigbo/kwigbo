class MainMap extends TileMap {
	constructor(scale, canvas, size) {
		let scaledTileSize = 16 * scale;
		let mapWidth = Math.ceil(25 * scaledTileSize);
		let mapHeight = Math.ceil(25 * scaledTileSize);
		super(scale, canvas, new Size(mapWidth, mapHeight));

		var layerOneArray = this.layerOneData.trim().split("\n");
		let newString = layerOneArray.join(",");
		layerOneArray = newString.split(",");
		this.layerOne = new GridArray(new GridSize(25, 25), 0);
		this.layerOne.overwriteElements(layerOneArray);

		var layerTwoArray = this.layerTwoData.trim().split("\n");
		let newTwoString = layerTwoArray.join(",");
		layerTwoArray = newTwoString.split(",");
		this.layerTwo = new GridArray(new GridSize(25, 25), 0);
		this.layerTwo.overwriteElements(layerTwoArray);

		let grassTilesImage = new Image();
		grassTilesImage.src = "./SproutLands/Assets/Dark Grass Tiles.png";
		this.grassTiles = new TileSheet(
			grassTilesImage,
			16,
			new Size(176, 112)
		);
	}

	renderMapBaseLayer() {
		this.renderLayer(this.layerOne, this.grassTiles);
		this.renderLayer(this.layerTwo, this.grassTiles);
	}

	layerOneData = `12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,69,60,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,58,69,12,67,12,12,66,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,69,58,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,60,69,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,66,12,69,69,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,58,69,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,69,60,12,66,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,66,12,12,69,69,58,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,69,58,69,58,12,69,69,12,12,12,12,69,12,12,12,69,12,12,12
12,12,12,12,12,12,12,12,69,69,12,69,69,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,58,12,12,12,69,12,12,69,69,12,69,12,12,12,69,12,12,69,12
12,12,12,12,12,12,12,12,12,12,12,69,12,69,58,12,12,12,58,12,69,12,12,12,12
12,12,12,12,12,12,12,58,12,12,12,12,12,12,69,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,69,12,12,12,12,58,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12
`;
	layerTwoData = `2,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,0
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
13,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,11
24,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,22`;
}

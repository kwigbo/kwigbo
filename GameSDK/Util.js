// Method used to convert RGB values to Hex string
//
// - r: The red value to convert
// - g: The green value to convert
// - b: The blue value to convert
// - Returns: The converted Hex string
function RGBToHex(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);

	if (r.length == 1) r = "0" + r;
	if (g.length == 1) g = "0" + g;
	if (b.length == 1) b = "0" + b;

	return "#" + r + g + b;
}

// Method to get a random integer
//
// - max: The max value for the random number
// - Returns: The converted Hex string
function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

// Method to get a random float
//
// - max: The max value for the random number
// - min: The min value for the random number
// - decimals: How many decimals to round to
// - Returns: The converted Hex string
function getRandomFloat(min, max, decimals) {
	return (Math.random() * (min - max) + 0.02).toFixed(decimals);
}

// Method used to scale a size to fit a max width
//
// - size: The Size object to use in calculation
// - maxWidth: The width to constrain the size to
// - Returns: The converted Hex string
function scaleSizeToFitWidth(size, maxWidth) {
	let scale = maxWidth / size.width;
	let newHeight = size.height * scale;
	return new Size(maxWidth, newHeight);
}

// Method used to scale a size to fit a max height
//
// - size: The Size object to use in calculation
// - maxHeight: The height to constrain the size to
function scaleSizeToFitHeight(size, maxHeight) {
	let scale = maxHeight / size.height;
	let newWidth = size.width * scale;
	return new Size(newWidth, maxHeight);
}

// Method used to scale a size to fit a max size
//
// - size: The Size object to use in calculation
// - displaySize: The Size object to constrain the size to
function scaleSizeToFit(size, displaySize) {
	if (displaySize.width > displaySize.height) {
		return scaleSizeToFitHeight(size, displaySize.height);
	} else {
		return scaleSizeToFitWidth(size, displaySize.width);
	}
}

// Get pixel data for a given image.
//
// - image: The image to get the pixel data for.
// - Returns: The string generated with the pixel data.
function getDataArrayString(image) {
	let w = image.width;
	let h = image.height;
	let canvas = document.createElement("canvas");
	canvas.style.display = "none";
	canvas.width = w;
	canvas.height = h;
	let context = canvas.getContext("2d");
	context.drawImage(image, 0, 0, w, h);
	var dataArray = [];
	for (var x = 0; x < w; x++) {
		for (var y = 0; y < h; y++) {
			let pixelData = context.getImageData(x, y, 1, 1);
			dataArray.push(pixelData.data);
		}
	}
	return dataArray;
}

// Chunk and array into an array of arrays.
// Example:
// let array = [1,2,3,4,5,6,7,8];
// let output = chunk(array, 4);
// Expected results: [[1, 2, 3, 4], [5, 6, 7, 8]]
//
// - array: The array to break into chunks.
// - size: The size of the chunks to break it into.
// - Returns: The new array chunked
function chunk(array, size) {
	const chunked = [];
	for (let i = 0; i < array.length; i++) {
		const last = chunked[chunked.length - 1];
		if (!last || last.length === size) {
			chunked.push([array[i]]);
		} else {
			last.push(array[i]);
		}
	}
	return chunked;
}

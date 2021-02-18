function Frame(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Frame.prototype.collided = function(frame) {
  let check1 = this.x < frame.x + frame.width;
  let check2 = this.x + this.width > frame.x;
  let check3 = this.y < frame.y + frame.height;
  let check4 = this.y + this.height > frame.y;
  return check1 && check2 && check3 && check4;
}

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

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

    return "#" + r + g + b;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomFloat(min, max, decimals) {
  return (Math.random() * (min - max) + 0.0200).toFixed(decimals)
}

// Method used to scale a size to fit a max width
//
// - width: The width to scale
// - height: The height to scale
// - maxWidth: The width to constrain the size to
function scaleSizeToFitWidth(width, height, newWidth) {
	let scale = newWidth / width
    let newHeight = height * scale
 	return [newWidth, newHeight];
}

function scaleSizeToFitHeight(width, height, newHeight) {
 	let scale = newHeight / height
    let newWidth = width * scale
 	return [newWidth, newHeight];
}

function scaleSizeToFit(width, height, displayWidth, displayHeight) {
	if (displayWidth > displayHeight) {
		return scaleSizeToFitHeight(width, height, displayHeight)
	} else {
		return scaleSizeToFitWidth(width, height, displayWidth)
	}
}

function getDataArrayString(image) {
	let w = image.width
	let h = image.height
	let canvas = document.createElement('canvas');
	canvas.style.display = "none";
	canvas.width = w;
	canvas.height = h;
	let context = canvas.getContext('2d');
	context.drawImage(image, 0, 0, w, h);
	var dataArray = [];
	for (var x = 0; x < w; x++) {
		for (var y = 0; y < h; y++) {
			let pixelData = context.getImageData(x, y, 1, 1);
			dataArray.push(pixelData.data);
		}
	}
	return dataArray
}


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

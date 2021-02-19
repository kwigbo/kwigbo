function Frame(point, size) {
  this.origin = point;
  this.size = size;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}

function Size(width, height) {
  this.width = width;
  this.height = height;
}

Frame.prototype.isEqual = function(frame) {
  let valuesEqual = (this.origin.x === frame.origin.x &&
      this.origin.y === frame.origin.y &&
      this.size.width === frame.size.width &&
      this.size.height === frame.size.height);
  return valuesEqual;
}

Frame.prototype.collided = function(frame) {
  let check1 = this.x < frame.x + frame.width;
  let check2 = this.x + this.width > frame.x;
  let check3 = this.y < frame.y + frame.height;
  let check4 = this.y + this.height > frame.y;
  return check1 && check2 && check3 && check4;
}

Frame.prototype.circleCollision = function(frame) {
  let radius = this.size.width/2;
  let centerX = this.origin.x + radius;
  let centerY = this.origin.y + radius;

  let frameRadius = frame.size.width/2;
  let frameCenterX = frame.origin.x + frameRadius;
  let frameCenterY = frame.origin.y + frameRadius;

  var a = centerX - frameCenterX;
  var b = centerY - frameCenterY;
  var distance = Math.abs(Math.sqrt( a*a + b*b ));
  let tollerance = 6;

  return (distance <= (radius + frameRadius) - tollerance);
}

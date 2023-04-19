class Frame {
  constructor(point, size) {
    this.origin = point;
    this.size = size;
  }

  isEqual(frame) {
    let valuesEqual =
      this.origin.x === frame.origin.x &&
      this.origin.y === frame.origin.y &&
      this.size.width === frame.size.width &&
      this.size.height === frame.size.height;
    return valuesEqual;
  }

  collided(frame) {
    let check1 = this.origin.x < frame.origin.x + frame.size.width;
    let check2 = this.origin.x + this.size.width > frame.origin.x;
    let check3 = this.origin.y < frame.origin.y + frame.size.height;
    let check4 = this.origin.y + this.size.height > frame.origin.y;
    return check1 && check2 && check3 && check4;
  }

  circleCollision(frame) {
    let radius = this.size.width / 2;
    let centerX = this.origin.x + radius;
    let centerY = this.origin.y + radius;

    let frameRadius = frame.size.width / 2;
    let frameCenterX = frame.origin.x + frameRadius;
    let frameCenterY = frame.origin.y + frameRadius;

    var a = centerX - frameCenterX;
    var b = centerY - frameCenterY;
    var distance = Math.abs(Math.sqrt(a * a + b * b));
    let tollerance = 6;

    return distance <= radius + frameRadius - tollerance;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Size {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
}

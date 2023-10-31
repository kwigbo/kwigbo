/// Object used to define a frame
export default class Frame {
  /// Initialize a new frmae with an origin point and size
  ///
  /// - Parameters:
  ///   - origin: The x and y values for the frame
  ///   - size: The width and height for the frame
  constructor(origin, size) {
    this.origin = origin;
    this.size = size;
  }

  get x() {
    return this.origin.x;
  }

  get y() {
    return this.origin.y;
  }

  get left() {
    return this.x;
  }

  get right() {
    return this.x + this.width;
  }

  get top() {
    return this.y;
  }

  get bottom() {
    return this.y + this.height;
  }

  get width() {
    return this.size.width;
  }

  get height() {
    return this.size.height;
  }

  /// Calculate the distance from the current frame to another
  ///
  /// - Parameter frame: The frame to get the distance to
  /// - Returns: The distance between the two frames
  distanceTo(frame) {
    return this.origin.distanceTo(frame.origin);
  }

  /// Test if another frame is equal to the current frame
  ///
  /// - Parameter frame: The frame to check for equality with
  /// - Returns: True if the frames are equal
  isEqual(frame) {
    return this.origin.isEqual(frame.origin) && this.size.isEqual(frame.size);
  }

  /// Test if one frame has collided with another
  ///
  /// - Parameter frame: The frame to check for collision with
  /// - Returns: True if the frames are colliding
  collided(frame) {
    let check1 = frame.x + frame.width >= this.x;
    let check2 = frame.x <= this.x + this.width;
    let check3 = frame.y + frame.height >= this.y;
    let check4 = frame.y <= this.y + this.height;
    return check1 && check2 && check3 && check4;
  }

  /// Test if one frame has fully contains another
  ///
  /// - Parameter frame: The frame to check if the current contains
  /// - Returns: True if the current frame contains the given
  contains(frame) {
    let check1 = frame.x >= this.x;
    let check2 = frame.x + frame.width <= this.x + this.width;
    let check3 = frame.y >= this.y;
    let check4 = frame.y + frame.height <= this.y + this.height;
    return check1 && check2 && check3 && check4;
  }

  /// Get the overlap area frame of two frame
  ///
  /// - Parameter frame: The frame to get the overlap for
  /// - Returns: The area for the overlapping area
  overlapArea(frame) {
    const xOverlap = Math.max(
      0,
      Math.min(this.right, frame.right) - Math.max(this.left, frame.left),
    );
    const yOverlap = Math.max(
      0,
      Math.min(this.bottom, frame.bottom) - Math.max(this.top, frame.top),
    );
    return xOverlap * yOverlap;
  }

  /// Test if a circle confined to the current frame collides with another
  /// Converts the frame to a circle using the width to get the radius
  ///
  /// - Parameter frame: The frame to check for collision with
  /// - Returns: True if the circles are colliding
  circleCollision(frame) {
    let radius = this.width / 2;
    let centerX = this.x + radius;
    let centerY = this.y + radius;

    let frameRadius = frame.width / 2;
    let frameCenterX = frame.x + frameRadius;
    let frameCenterY = frame.y + frameRadius;

    var a = centerX - frameCenterX;
    var b = centerY - frameCenterY;
    var distance = Math.abs(Math.sqrt(a * a + b * b));
    let tollerance = 4;

    return distance <= radius + frameRadius - tollerance;
  }
}

import Direction from "../Direction.js";

/// Class used to define a point
export default class Point {
  /// Create a new point object
  ///
  /// - Parameters:
  ///   - x: The x position of the point
  ///   - y: The y position of the point
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /// Calculate the distance from the current point to another
  ///
  /// - Parameter point: The point to get the distance to
  /// - Returns: The distance between the two points
  distanceTo(point) {
    var a = this.x - point.x;
    var b = this.y - point.y;
    return Math.sqrt(a * a + b * b);
  }

  /// Test if another point is equal to the current point
  ///
  /// - Parameter point: The point to check for equality with
  /// - Returns: True if the points are equal
  isEqual(point) {
    return this.x === point.x && this.y === point.y;
  }

  /// Get the direction to the next point
  ///
  /// - Parameter point: The point to get the direction to.
  directionTo(point, offset) {
    const realOffset = offset ? offset : 0;
    if (point) {
      if (point.y < this.y - realOffset) {
        return Direction.Up;
      }
      if (point.y > this.y + realOffset) {
        return Direction.Down;
      }
      if (point.x > this.x + realOffset) {
        return Direction.Right;
      }
      if (point.x < this.x - realOffset) {
        return Direction.Left;
      }
    }
    return Direction.Down;
  }
}

/// Class used to define a size
export default class Size {
  /// Create a new size object
  ///
  /// - Parameters:
  ///   - width: The width of the size
  ///   - height: The height of the size
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  /// Get the diagonal length of the size
  diagonalLength() {
    return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
  }

  /// Test if another size is equal to the current size
  ///
  /// - Parameter size: The size to check for equality with
  /// - Returns: True if the sizes are equal
  isEqual(size) {
    return this.width === size.width && this.height === size.height;
  }
}

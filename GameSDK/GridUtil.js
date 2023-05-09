// Class to define possible movement directions
class Direction {
    static Down = new Direction(0);
    static Up = new Direction(1);
    static Left = new Direction(2);
    static Right = new Direction(3);

    /// Initialize a direction with a raw value
    ///
    /// - Parameter rawValue: The int value for the direction
    constructor(rawValue) {
        this.rawValue = rawValue;
    }

    // Get the direction opposite the given direction
    ///
    /// - Parameter direction: The direction to get the opposite of
    /// - Returns: The opposite of the given direction
    static opposite(direction) {
        switch (direction) {
            case Direction.Up:
                return Direction.Down;
            case Direction.Down:
                return Direction.Up;
            case Direction.Left:
                return Direction.Right;
            case Direction.Right:
                return Direction.Left;
        }
    }
}

/// Class to define a grid size
class GridSize {
    /// Create a grid size object
    ///
    /// - Parameters:
    ///     - columns: The number of columns in the grid
    ///     - rows: The number of rows in the grid
    constructor(columns, rows) {
        this.columns = columns;
        this.rows = rows;
    }
}

/// Class used to represent a position in a grid
class GridCoordinates {
    /// Zero coordinate
    static zero = new GridCoordinates(0, 0);

    /// Create a new `GridCoordinates`
    ///
    /// - Parameter column: The column for the coordinates
    /// - Parameter row: The row for the coordinates
    constructor(column, row) {
        this.column = column;
        this.row = row;
    }

    /// Are the coordinates valid within a given `GridSize`
    ///
    /// - Parameter gridSize: The GridSize to test for validity in
    isValidIn(gridSize) {
        return (
            this.column >= 0 &&
            this.column < gridSize.columns &&
            this.row >= 0 &&
            this.row < gridSize.rows
        );
    }
}

/// Class used to represent a two dimensional array
class GridArray {
    /// Initialize a GridArray with a `GridSize`
    ///
    /// - Parameter size: The size of the GridArray
    /// - Parameter generator: The function used to generate fill objects
    constructor(size, generator) {
        this.size = size;
        let total = this.size.columns * this.size.rows;
        this.elements = new Array(total);
        this.elements.fill(generator);
        Object.seal(this.elements);
    }

    /// Function to set coordinates for an index
    ///
    /// - Parameter index: The index to get the coordinates for
    /// - Returns: The GridCoordinates for the given index.
    coordinatesForIndex(index) {
        let realIndex = parseInt(index);
        let row = Math.floor(realIndex / this.size.columns);
        let column = Math.floor(realIndex % this.size.columns);
        return new GridCoordinates(column, row);
    }

    /// Function to set the underlying array.
    ///
    /// - Parameter elements: The array of elements to set as the base for this structure
    overwriteElements(elements) {
        if (this.elements.length === elements.length) {
            this.elements = elements;
        } else {
            console.log(
                "Overwrite failed! Given elements length does not match."
            );
            console.log(this.elements.length);
            console.log(elements.length);
        }
    }

    /// Find random coordinates within the grid array
    ///
    /// - Returns: The random `GridCoordinates`
    randomCoordinates() {
        return GridCoordinates(
            getRandomInt(size.columns),
            getRandomInt(size.rows)
        );
    }

    /// Get an element at a specific `GridCoordinates`
    ///
    /// - Parameter coordinates: The `GridCoordinates` to get the element for
    ///
    /// - Returns: The element at the given `GridCoordinates`
    getElementAt(coordinates) {
        let realIndex =
            coordinates.row * this.size.columns + coordinates.column;
        return this.elements[realIndex];
    }

    /// Set an element at a specific `GridCoordinates`
    ///
    /// - Parameter element: The element to add the the grid array
    /// - Parameter coordinates: The `GridCoordinates` to sent the element for
    setElementAt(element, coordinates) {
        let realIndex =
            coordinates.row * this.size.columns + coordinates.column;
        this.elements[realIndex] = element;
    }

    /// Remove an element at a specified `GridCoordinates` from the grid array
    ///
    /// - Parameter coordinates: The `GridCoordinates` at which to remove an element
    removeElementAt(coordinates) {
        let realIndex =
            coordinates.row * this.size.columns + coordinates.column;
        this.elements[realIndex] = undefined;
    }

    /// Exchange the elements at two `GridCoordinates`
    ///
    /// - Parameter startCoordinates: The first coordinates to swap
    /// - Parameter endCoordinates: The sencond coordinates to swap
    exchangeElementAt(startCoordinates, withCoordinates) {
        let startIndex =
            startCoordinates.row * this.size.columns + startCoordinates.column;
        let endIndex =
            endCoordinates.row * this.size.columns + endCoordinates.column;
        swap(this.elements, this.elements[startIndex], this.elements[endIndex]);
    }
}

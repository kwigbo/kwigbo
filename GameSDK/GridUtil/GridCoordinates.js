/// Class used to represent a position in a grid
export default class GridCoordinates {
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

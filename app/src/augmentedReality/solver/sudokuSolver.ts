// cicular linked list element with links up, down, left and right
class Data {
  left: Data;
  right: Data;
  up: Data;
  down: Data;
  column: Column | null;
  guess: Guess | null;
  constructor(column: Column = null, guess: Guess = null) {
    this.column = column;
    this.guess = guess;
    // start of pointing at ourself
    this.left = this;
    this.right = this;
    this.up = this;
    this.down = this;
  }
  insertRight(node: Data) {
    node.left = this;
    node.right = this.right;
    this.right.left = node;
    this.right = node;
  }
  insertLeft(node: Data) {
    node.right = this;
    node.left = this.left;
    this.left.right = node;
    this.left = node;
  }
  insertUp(node: Data) {
    node.down = this;
    node.up = this.up;
    this.up.down = node;
    this.up = node;
  }
  insertDown(node: Data) {
    node.up = this;
    node.down = this.down;
    this.down.up = node;
    this.down = node;
  }
}

class Column extends Data {
  size: number;
  constructor() {
    super();
    this.size = 0;
  }
}

class Guess {
  x: number;
  y: number;
  entry: number;
  // flag to indicate if this was a known value - used when displaying the solution
  isKnown: boolean = false;
  constructor(x: number, y: number, entry: number) {
    this.x = x;
    this.y = y;
    this.entry = entry;
  }
}

export default class SudokuSolver {
  columnRoot: Column; // root column object
  columnLookup: Column[] = [];
  rowLookup: Data[] = [];
  solution: Data[] = []; // the solution

  // Setup the circular lists for the X algorithm to work on
  public constructor() {
    // construct the rows and columns
    // https://en.wikipedia.org/wiki/Exact_cover#Sudoku and https://www.stolaf.edu//people/hansonr/sudoku/exactcovermatrix.htm
    // https://www.kth.se/social/files/58861771f276547fe1dbf8d1/HLaestanderMHarrysson_dkand14.pdf

    // create a doubly linked list of column headers
    this.columnRoot = new Column();
    for (let col = 0; col < 81 * 4; col++) {
      const column = new Column();
      this.columnRoot.insertRight(column);
      // stash the column in a quick lookup
      this.columnLookup.push(column);
    }
    // create a doubly linked list of rows and populate the columns for each row
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        for (let entry = 0; entry < 9; entry++) {
          const guess = new Guess(x, y, entry + 1);
          // create a node for the cell entry
          const entryColIdx = y * 9 + x;
          const entryColumn = this.columnLookup[entryColIdx];
          const entryConstraint = new Data(entryColumn, guess);
          this.rowLookup[(y * 9 + x) * 9 + entry] = entryConstraint;
          // put the entry node in the corresponding column
          entryColumn.insertDown(entryConstraint);
          entryColumn.size++;

          // create a node for the row constraint
          const rowColIdx = 81 + y * 9 + entry;
          const rowColumn = this.columnLookup[rowColIdx];
          const rowConstraint = new Data(rowColumn, guess);
          // and add it to the row
          entryConstraint.insertRight(rowConstraint);
          // and to the column for this constraint
          rowColumn.insertDown(rowConstraint);
          rowColumn.size++;

          // create a node for the column constraint
          const colColIdx = 81 * 2 + x * 9 + entry;
          const colCol = this.columnLookup[colColIdx];
          const columnConstraint = new Data(colCol, guess);
          // and add it to the row
          rowConstraint.insertRight(columnConstraint);
          // and to the column for this constraint
          colCol.insertDown(columnConstraint);
          colCol.size++;

          // create a node for the box constraint
          const boxX = Math.floor(x / 3);
          const boxY = Math.floor(y / 3);
          const boxColumnIndex = 81 * 3 + (boxY * 3 + boxX) * 9 + entry;
          const boxColumn = this.columnLookup[boxColumnIndex];
          const boxConstraint = new Data(boxColumn, guess);
          // add it the row
          columnConstraint.insertRight(boxConstraint);
          // add it to the column
          boxColumn.insertDown(boxConstraint);
          boxColumn.size++;
        }
      }
    }
  }

  // set a number on the puzzle covering any of the constraints that it satisfies
  setNumber(x: number, y: number, entry: number) {
    // find the column
    const row = this.rowLookup[(y * 9 + x) * 9 + entry];
    row.guess.isKnown = true;
    this.solution.push(row);
    this.cover(row.column);
    for (let right = row.right; right !== row; right = right.right) {
      this.cover(right.column);
    }
  }

  // get the column with the smallest number of rows - this should give us the quickest solution
  getSmallestColumn() {
    let smallestSize = (this.columnRoot.right as Column).size;
    let smallestColumn = this.columnRoot.right as Column;
    let col = this.columnRoot.right as Column;
    while (col !== this.columnRoot) {
      if (col.size < smallestSize) {
        smallestSize = col.size;
        smallestColumn = col;
      }
      col = col.right as Column;
    }
    return smallestColumn;
  }

  // search for a solution
  search(depth: number = 0): boolean {
    // give up if weve gone to deep - there probably isn't a solution
    if (depth > 100) {
      throw new Error("too deep - giving up");
    }
    // we have no more columns - we have succeeded - send back the results
    if (this.columnRoot.right === this.columnRoot) {
      return true;
    }
    // pick the column with the fewest rows
    let column = this.getSmallestColumn();
    this.cover(column);
    for (let row = column.down; row !== column; row = row.down) {
      this.solution.push(row);
      for (let right = row.right; right !== row; right = right.right) {
        this.cover(right.column);
      }
      if (this.search(depth + 1)) {
        return true;
      }
      // need to backtrack
      for (let left = row.left; left !== row; left = left.left) {
        this.uncover(left.column);
      }
      this.solution.pop();
    }
    // we've failed
    this.uncover(column);
    return false;
  }

  // cover a column - basically unlink the column from the list and unlink any rows from other columns
  cover(column: Column) {
    column.right.left = column.left;
    column.left.right = column.right;
    for (let row = column.down; row !== column; row = row.down) {
      for (let right = row.right; right !== row; right = right.right) {
        right.down.up = right.up;
        right.up.down = right.down;
        right.column.size--;
      }
    }
  }

  // uncover a column - put the rows back along with the column
  uncover(column: Column) {
    for (let row = column.up; row !== column; row = row.up) {
      for (let left = row.left; left !== row; left = left.left) {
        left.down.up = left;
        left.up.down = left;
        left.column.size++;
      }
    }
    column.right.left = column;
    column.left.right = column;
  }
}

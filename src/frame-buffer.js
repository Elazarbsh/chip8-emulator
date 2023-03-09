

export class FrameBuffer {


  constructor(rows = 32, cols = 64){
    this.rows = rows;
    this.cols = cols;
    this.display = Array.from(Array(this.rows), () => new Array(this.cols).fill(0));

  }

  get rowCount(){
    return this.rows;
  }

  get colCount(){
    return this.cols;
  }

  clearScreen() {
    this.display = Array.from(Array(this.rows), () => new Array(this.cols).fill(0));
  }

  setPixelOn(row, col) {
    this.validateCoordinates(row, col);
    this.display[row][col] = 1;
  }

  setPixelOff(row, col) {
    this.validateCoordinates(row, col);
    this.display[row][col] = 0;
  }

  getPixelAt(row, col) {
    this.validateCoordinates(row, col);
    return this.display[row][col];
  }

  validateCoordinates(row, col){
    if (row < 0 || row >= this.rowCount || col < 0 || col >= this.colCount) {
      throw new Error(`Invalid row or column index. The specified row or column index is out of range. row:${row}, col:${col}`);
    }
  }
}




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

  setPixelOn(x, y) {
    this.validateCoordinates(x, y);
    this.display[y][x] = 1;
  }

  setPixelOff(x, y) {
    this.validateCoordinates(x, y);
    this.display[y][x] = 0;
  }

  getPixelAt(x, y) {
    this.validateCoordinates(x, y);
    return this.display[y][x];
  }

  validateCoordinates(row, col){
    if (row < 0 || row >= this.rowCount || col < 0 || col >= this.colCount) {
      throw new Error(`Invalid row or column index. The specified row or column index is out of range. row:${row}, col:${col}`);
    }
  }
}


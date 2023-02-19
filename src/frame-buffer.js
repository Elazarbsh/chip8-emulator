

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
    this.display[y][x] = 1;
  }

  setPixelOff(x, y) {
    this.display[y][x] = 0;
  }

  getPixelAt(x, y) {
    return this.display[y][x];
  }
}


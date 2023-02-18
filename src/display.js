

export class Display {

  rows = 32;
  cols = 64;
  display = Array.from(Array(this.rows), () => new Array(this.cols).fill(0));

  constructor(){

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

  updateCanvas() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    const pixelWidth = canvas.width / this.cols;
    const pixelHeight = canvas.height / this.rows;

    // ctx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.display[i][j] == 1) {
          ctx.fillStyle = 'white';
        } else {
          ctx.fillStyle = 'black';
        }
        ctx.fillRect(j * pixelWidth, i * pixelHeight, pixelWidth, pixelHeight);
      }
    }
  }
}


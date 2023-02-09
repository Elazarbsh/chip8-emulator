
const rows = 32;
const cols = 64;

let display = Array.from(Array(rows), () => new Array(cols).fill(0));

export function clearScreen() {
    display = Array.from(Array(rows), () => new Array(cols).fill(0));
}

export function setPixelOn(x, y){
    display[y][x] = 1;
}

export function setPixelOff(x, y){
    display[y][x] = 0;
}

export function getPixelAt(x, y){
    return display[y][x];
}

export function updateCanvas() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    const pixelWidth = canvas.width / cols;
    const pixelHeight = canvas.height / rows;
  
    // ctx.fillStyle = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
  
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (display[i][j] == 1) {
          ctx.fillStyle = 'white';
        } else {
          ctx.fillStyle = 'black';
        }
        ctx.fillRect(j * pixelWidth, i * pixelHeight, pixelWidth, pixelHeight);
      }
    }
  }
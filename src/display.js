export class Display {
    
    constructor(frameBuffer) {
        this.frameBuffer = frameBuffer;
    }

    update() {
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        const pixelWidth = canvas.width / this.frameBuffer.colCount;
        const pixelHeight = canvas.height / this.frameBuffer.rowCount;

        for (let i = 0; i < this.frameBuffer.rowCount; i++) {
            for (let j = 0; j < this.frameBuffer.colCount; j++) {
                if (this.frameBuffer.getPixelAt(i, j) == 1) {
                    ctx.fillStyle = 'white';
                } else {
                    ctx.fillStyle = 'black';
                }
                ctx.fillRect(j * pixelWidth, i * pixelHeight, pixelWidth, pixelHeight);
            }
        }
    }
}
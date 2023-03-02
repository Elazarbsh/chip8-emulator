import { Chip8 } from "./src/chip8.js";

function uint8ArrayToHex(arr) {
  return [...arr].map(x => x.toString(16).padStart(2, '0')).join(' ');
}

const chip8 = new Chip8();

document.getElementById('rom-selector').addEventListener('change', function() {
  const rom = this.value;
  fetch(`roms/${rom}`)
  .then((res) => {
    if(!res.ok){
      throw new Error('ROM not found');
    }
    return res.arrayBuffer();
  }).then((buffer) => {
    chip8.stop();
    const program = new Uint8Array(buffer);
    chip8.loadFontToMemory();
    chip8.loadProgramToMemory(program);
    chip8.start();
  }).catch((error) => {
    console.log(`${error}`);
    chip8.stop();
  });
});


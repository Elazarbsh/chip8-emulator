import { Chip8 } from "./src/chip8.js";

function uint8ArrayToHex(arr) {
  return [...arr].map(x => x.toString(16).padStart(2, '0')).join(' ');
}

fetch('/roms/PONG')
  .then((res) => {
    return res.arrayBuffer();
  }).then((buffer) => {
    const chip8 = new Chip8();
    console.log(buffer.byteLength);
    const program = new Uint8Array(buffer);
    console.log(program);
    const hexString = uint8ArrayToHex(program);
    console.log(hexString);
    chip8.loadFontToMemory();
    chip8.loadProgramToMemory(program);
    chip8.start();
  });

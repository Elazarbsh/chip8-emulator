import { CPU } from "./src/CPU.js";


function uint8ArrayToHex(arr) {
  return [...arr].map(x => x.toString(16).padStart(2, '0')).join(' ');
}

fetch('/roms/PONG')
  .then((res) => {
    return res.arrayBuffer();
  }).then((buffer) => {
    const cpu = new CPU();
    console.log(buffer.byteLength);
    const program = new Uint8Array(buffer);
    console.log(program);
    const hexString = uint8ArrayToHex(program);
    console.log(hexString);
    cpu.loadFontToMemory();
    cpu.loadProgramToMemory(program);
    cpu.start();
  });

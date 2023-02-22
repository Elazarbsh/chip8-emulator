import { FrameBuffer } from "./frame-buffer.js";
import { Keyboard } from "./keyboard.js";
import { Memory } from "./memory.js";
import { Stack } from "./stack.js";
import { Display } from "./display.js";
import { RegisterFile } from "./register-file.js";
import { CPU } from "./CPU.js";
import { FONT } from "../data/font.js";
import { PROGRAM_ADDRESS, FONT_ADDRESS } from "../data/addresses.js";
import { CLOCK_SPEED } from "../data/frequencies.js";
import { DISPLAY_ROWS, DISPLAY_COLS, MEMORY_SIZE, REGISTER_COUNT } from "../data/constants.js";

export class Chip8{

    frameBuffer = new FrameBuffer(DISPLAY_ROWS, DISPLAY_COLS);
    keyboard = new Keyboard();
    memory = new Memory(MEMORY_SIZE);
    stack = new Stack();
    display = new Display(this.frameBuffer);
    registers = new RegisterFile(REGISTER_COUNT);
    cpu = new CPU(this.memory, this.stack, this.registers, this.frameBuffer, this.display, this.keyboard);

    loadFontToMemory() {
        let address = FONT_ADDRESS;
        for (const char in FONT) {
            this.memory.load(FONT[char], address);
            address += FONT[char].length;
        }
    }

    loadProgramToMemory(program) {
        this.memory.load(program, PROGRAM_ADDRESS);
    }

    start(){
        this.cycleInterval = setInterval(this.cpu.cycle.bind(this.cpu), CLOCK_SPEED);        
    }

    pasue(){
        clearInterval(this.cycleInterval);
    }

    next(){
        this.cpu.cycle();
    }

}
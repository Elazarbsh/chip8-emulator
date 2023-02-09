import * as Display from "./display.js";
import * as Keyboard from "./keyboard.js";


const rows = 32;
const cols = 64;
const memorySize = 4096;
const delayTimerFrequency = 1000 / 60;
const soundTimerFrequency = 1000 / 60;
let registers = new Uint8Array(16);
let stack = new Uint16Array(16);
let memory = new Uint8Array(memorySize);
let I = 0x50;
let SP = 0;
let PC = 0x200;
let delayTimer = 0;
let soundTimer = 0;


const font = {
    0: [0xF0, 0x90, 0x90, 0x90, 0xF0],
    1: [0x20, 0x60, 0x20, 0x20, 0x70],
    2: [0xF0, 0x10, 0xF0, 0x80, 0xF0],
    3: [0xF0, 0x10, 0xF0, 0x10, 0xF0],
    4: [0x90, 0x90, 0xF0, 0x10, 0x10],
    5: [0xF0, 0x80, 0xF0, 0x10, 0xF0],
    6: [0xF0, 0x80, 0xF0, 0x90, 0xF0],
    7: [0xF0, 0x10, 0x20, 0x40, 0x40],
    8: [0xF0, 0x90, 0xF0, 0x90, 0xF0],
    9: [0xF0, 0x90, 0xF0, 0x10, 0xF0],
    0xA: [0xF0, 0x90, 0xF0, 0x90, 0x90],
    0xB: [0xE0, 0x90, 0xE0, 0x90, 0xE0],
    0xC: [0xF0, 0x80, 0x80, 0x80, 0xF0],
    0xD: [0xE0, 0x90, 0x90, 0x90, 0xE0],
    0xE: [0xF0, 0x80, 0xF0, 0x80, 0xF0],
    0xF: [0xF0, 0x80, 0xF0, 0x80, 0x80],
}


export function start() {
    let cycleInterval = setInterval(cycle, 1000 / 700);
    let delayTimerInterval = setInterval(updateDelayTimer, delayTimerFrequency);
    let soundTimerInterval = setInterval(updateSoundTimer, soundTimerFrequency);
}

export function restart() {
    registers = new Uint8Array(16);
    stack = new Uint16Array(16);
    memory = new Uint8Array(memorySize);
    I = 0x50;
    SP = 0;
    PC = 0x200;
    delayTimer = 0;
    soundTimer = 0;
}

export function loadFontToMemory() {
    let address = 0x050;
    for (const char in font) {
        for (const byte of font[char]) {
            memory[address] = byte;
            address++;
        }
    }
}

export function loadProgramToMemory(program) {
    let address = 0x200;
    for (const byte of program) {
        memory[address] = byte;
        address++;
    }
}

function cycle() {
    const instruction = fetchCommand();
    console.log("fetched: " + instruction.toString(16).padStart(4, '0'));
    decode(instruction);
}

function updateDelayTimer() {
    if (delayTimer > 0) {
        delayTimer--;
    }
}

function updateSoundTimer() {
    if (soundTimer > 0) {
        soundTimer--;
    }
}

function fetchCommand() {
    const b1 = memory[PC];
    const b2 = memory[PC + 1];
    PC += 2;
    return b1 << 8 | b2;
}


function decode(instruction) {
    const opcode = instruction & 0xF000;
    const func = instruction & 0x000F;
    const vx = (instruction & 0x0F00) >> 8;
    const vy = (instruction & 0x00F0) >> 4;
    const n = instruction & 0x000F;
    const nn = instruction & 0x00FF;
    const nnn = instruction & 0x0FFF;

    switch (opcode) {
        case 0x0000:
            switch (instruction) {
                case 0x00E0:
                    cls();
                    break;
                case 0x00EE:
                    ret();
                    break;
                default:
                    console.log(instruction + " is not implemented");
            }
            break;
        case 0x1000:
            jump(nnn);
            break;
        case 0x2000:
            call(nnn);
            break;
        case 0x3000:
            skipEqi(vx, nn);
            break;
        case 0x4000:
            skipNeqi(vx, nn);
            break;
        case 0x5000:
            skipEq(vx, vy);
            break;
        case 0x6000:
            loadi(vx, nn);
            break;
        case 0x7000:
            addi(vx, nn);
            break;
        case 0x8000:
            switch (func) {
                case 0x0000:
                    load(vx, vy);
                    break;
                case 0x0001:
                    or(vx, vy);
                    break;
                case 0x0002:
                    and(vx, vy);
                    break;
                case 0x0003:
                    xor(vx, vy);
                    break;
                case 0x0004:
                    add(vx, vy);
                    break;
                case 0x0005:
                    sub(vx, vy);
                    break;
                case 0x0006:
                    shiftRight(vx);
                    break;
                case 0x0007:
                    subReverse(vx, vy);
                    break;
                case 0x000E:
                    shiftLeft(vx);
                    break;
                default:
                    console.log(instruction + " is not implemented");
            }
            break;
        case 0x9000:
            skipNeq(vx, vy);
            break;
        case 0xA000:
            loadIndex(nnn);
            break;
        case 0xB000:
            jumpOffset(nnn);
            break;
        case 0xC000:
            rnd(vx, nn);
            break;
        case 0xD000:
            draw(vx, vy, n);
            Display.updateCanvas();
            break;

        case 0xE000:
            switch (instruction & 0x00FF) {
                case 0x009E:
                    skipPressed(vx);
                    break;
                case 0x00A1:
                    skipNotPressed(vx)
                    break;
                default:
                    console.log(instruction + " is not implemented");
            }
            break;
        case 0xF000:
            switch (instruction & 0x00FF) {
                case 0x0007:
                    loadVxDt(vx);
                    break;
                case 0x000A:
                    getKey(vx);
                    break;
                case 0x0015:
                    loadDtVx(vx);
                    break;
                case 0x0018:
                    loadStVx(vx);
                    break;
                case 0x001E:
                    addIndex(vx);
                    break;
                case 0x0029:
                    indexTofontCharacter(vx);
                    break;
                case 0x0033:
                    toDecimal(vx);
                    break;
                case 0x0055:
                    saveRegisters(vx);
                    break;
                case 0x0065:
                    loadRegisters(vx);
                    break;
            }
            break;

        default:
            console.log(instruction + " is not implemented");
    }
}

// 00E0
// Clear the display.
function cls() {
    Display.clearScreen();
}

// 00EE
// Return from a subroutine.
function ret() {
    if (SP > 0) {
        SP--;
    }
    PC = stack[SP];
}

// 1NNN
// Jump to location nnn.
function jump(nnn) {
    PC = nnn;
}

// 2NNN
// Call subroutine at nnn.
function call(nnn) {
    stack[SP] = PC;
    SP++;
    PC = nnn;
}

// 3XNN
// Skip next instruction if Vx = nn.
function skipEqi(vx, nn) {
    if (registers[vx] == nn) {
        PC += 2;
    }
}

// 4XNN
// Skip next instruction if Vx != nn.
function skipNeqi(vx, nn) {
    if (registers[vx] != nn) {
        PC += 2;
    }
}

// 5XY0
// Skip next instruction if Vx = Vy.
function skipEq(vx, vy) {
    if (registers[vx] == registers[vy]) {
        PC += 2;
    }
}

// 6XNN
// Set Vx = nn.
function loadi(vx, nn) {
    registers[vx] = nn;
}

// 7XNN
// Set Vx = Vx + nn.
function addi(vx, nn) {
    registers[vx] += nn;
}

// 8XY0
// Set Vx = Vy.
function load(vx, vy) {
    registers[vx] = registers[vy];
}

// 8XY1
// Set Vx = Vx OR Vy.
function or(vx, vy) {
    registers[vx] = registers[vx] | registers[vy];
}

// 8XY2
// Set Vx = Vx AND Vy.
function and(vx, vy) {
    registers[vx] = registers[vx] & registers[vy];
}

// 8XY3
// Set Vx = Vx XOR Vy.
function xor(vx, vy) {
    registers[vx] = registers[vx] ^ registers[vy];
}

// 8XY4
// Set Vx = Vx + Vy, set VF = carry.
function add(vx, vy) {
    if (registers[vx] + registers[vy] > 255) {
        registers[0xF] = 1;
    }
    registers[vx] += registers[vy];
}

// 8XY5
// Set Vx = Vx - Vy, set VF = NOT borrow.
function sub(vx, vy) {
    if (registers[vx] > registers[vy]) {
        registers[0xF] = 1;
    } else {
        registers[0xF] = 0;
    }
    registers[vx] = registers[vx] - registers[vy];
}

// 8XY6
// Set Vx = Vx SHR 1.
function shiftRight(vx) {
    registers[0xF] = registers[vx] & 0x01;
    registers[vx] = registers[vx] >> 1;
}

// 8XY7
// Set Vx = Vy - Vx, set VF = NOT borrow.
function subReverse(vx, vy) {
    if (registers[vy] > registers[vx]) {
        registers[0xF] = 1;
    }
    else {
        registers[0xF] = 0;
    }
    registers[vx] = registers[vy] - registers[vx];
}

// 8XYE
// Set Vx = Vx SHL 1.
function shiftLeft(vx) {
    registers[0xF] = registers[vx] & 0x01;
    registers[vx] = registers[vx] << 1;
}


// 9XY0
// Skip next instruction if Vx != Vy.
function skipNeq(vx, vy) {
    if (registers[vx] != registers[vy]) {
        PC += 2;
    }
}

// ANNN
// Set I = nnn.
function loadIndex(nnn) {
    I = nnn;
}

// BNNN
// Jump to location nnn + V0.
function jumpOffset(nnn) {
    PC = registers[0] + nnn;
}

// CXNN
// Set Vx = random byte AND nn.
function rnd(vx, nn) {
    registers[vx] = Math.floor(Math.random() * 256) & nn;
}

// DXYN
// Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
function draw(vx, vy, n) {
    registers[0xF] = 0;
    let yCoordinate = registers[vy] % rows;

    for (let i = 0; i < n; i++) {
        if (yCoordinate >= rows) {
            break;
        }
        let xCoordinate = registers[vx] % cols;

        const fontByte = memory[I + i];
        for (let j = 128; j >= 1; j /= 2) {
            if (xCoordinate >= cols) {
                break;
            }
            const currentBit = fontByte & j;
            if (currentBit != 0 && Display.getPixelAt(xCoordinate, yCoordinate) != 0) {
                Display.setPixelOff(xCoordinate, yCoordinate);
                registers[0xF] = 1;
            } else if (currentBit != 0 && Display.getPixelAt(xCoordinate, yCoordinate) == 0) {
                Display.setPixelOn(xCoordinate, yCoordinate);
            }
            xCoordinate++;
        }
        yCoordinate++;
    }
}


// EX9E
//Skip next instruction if key with the value of Vx is pressed.
function skipPressed(vx) {
    if (Keyboard.isKeyPressed(registers[vx])) {
        PC += 2;
    }
}

// EXA1
// Skip next instruction if key with the value of Vx is not pressed.
function skipNotPressed(vx) {
    if (!Keyboard.isKeyPressed(registers[vx])) {
        PC += 2;
    }
}

// FX07 
// Set Vx = delay timer value.
function loadVxDt(vx) {
    registers[vx] = delayTimer;
}

// FX15
// Set delay timer = Vx.
function loadDtVx(vx) {
    delayTimer = registers[vx];
}

// FX18
// Set sound timer = Vx.
function loadStVx(vx) {
    soundTimer = registers[vx];
}

// FX0A
// Wait for a key press, store the value of the key in Vx.
function getKey(vx) {
    const keyPressed = Keyboard.getAnyKeyPressed;
    if (keyPressed >= 0) {
        PC -= 2;
    } else {
        registers[vx] = keyPressed;
    }
}

// FX1E
// Set I = I + Vx.
function addIndex(vx) {
    I = I + registers[vx];
}

// FX29
// Set I = location of sprite for digit Vx.
function indexTofontCharacter(vx) {
    I = 0x50 + (registers[vx] * 5);
}

// FX33
// Store BCD representation of Vx in memory locations I, I+1, and I+2.
function toDecimal(vx) {
    const digits = registers[vx].toString().padStart(3, '0').split('').map(Number);
    for (let i = 0; i <= 2; i++) {
        memory[I + i] = digits[i];
    }
}

// FX55 
// Store registers V0 through Vx in memory starting at location I.
function saveRegisters(vx) {
    for (let i = 0; i <= vx; i++) {
        memory[I + i] = registers[i];
    }
}

// FX65
// Read registers V0 through Vx from memory starting at location I.
function loadRegisters(vx) {
    for (let i = 0; i <= vx; i++) {
        registers[i] = memory[I + i];
    }
}
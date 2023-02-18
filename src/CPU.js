import { Display } from "./display.js";
import { Keyboard } from "./keyboard.js";

export class CPU {
    rows = 32;
    cols = 64;
    memorySize = 4096;
    delayTimerFrequency = 1000 / 60;
    soundTimerFrequency = 1000 / 60;
    registers = new Uint8Array(16);
    stack = new Uint16Array(16);
    memory = new Uint8Array(this.memorySize);
    I = 0x50;
    SP = 0;
    PC = 0x200;
    delayTimer = 0;
    soundTimer = 0;

    font = {
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

    display = new Display();
    keyboard = new Keyboard();

    start() {
        let cycleInterval = setInterval(this.cycle.bind(this), 1000 / 700);
        let delayTimerInterval = setInterval(this.updateDelayTimer.bind(this), this.delayTimerFrequency);
        let soundTimerInterval = setInterval(this.updateSoundTimer.bind(this), this.soundTimerFrequency);
    }

    bla(){
        console.log(this);
    }

    restart() {
        this.registers = new Uint8Array(16);
        this.stack = new Uint16Array(16);
        this.memory = new Uint8Array(memorySize);
        I = 0x50;
        this.SP = 0;
        this.PC = 0x200;
        this.delayTimer = 0;
        this.soundTimer = 0;
    }

    loadFontToMemory() {
        let address = 0x050;
        for (const char in this.font) {
            for (const byte of this.font[char]) {
                this.memory[address] = byte;
                address++;
            }
        }
    }

    loadProgramToMemory(program) {
        let address = 0x200;
        for (const byte of program) {
            this.memory[address] = byte;
            address++;
        }
    }

    fetchCommand() {
        const b1 = this.memory[this.PC];
        const b2 = this.memory[this.PC + 1];
        this.PC += 2;
        return b1 << 8 | b2;
    }

    cycle() {
        const instruction = this.fetchCommand();
        console.log("fetched: " + instruction.toString(16).padStart(4, '0'));
        this.decode(instruction);
    }

    updateDelayTimer() {
        if (this.delayTimer > 0) {
            this.delayTimer--;
        }
    }

    updateSoundTimer() {
        if (this.soundTimer > 0) {
            this.soundTimer--;
        }
    }




    decode(instruction) {
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
                        this.cls();
                        break;
                    case 0x00EE:
                        this.ret();
                        break;
                    default:
                        console.log(instruction + " is not implemented");
                }
                break;
            case 0x1000:
                this.jump(nnn);
                break;
            case 0x2000:
                this.call(nnn);
                break;
            case 0x3000:
                this.skipEqi(vx, nn);
                break;
            case 0x4000:
                this.skipNeqi(vx, nn);
                break;
            case 0x5000:
                this.skipEq(vx, vy);
                break;
            case 0x6000:
                this.loadi(vx, nn);
                break;
            case 0x7000:
                this.addi(vx, nn);
                break;
            case 0x8000:
                switch (func) {
                    case 0x0000:
                        this.load(vx, vy);
                        break;
                    case 0x0001:
                        this.or(vx, vy);
                        break;
                    case 0x0002:
                        this.and(vx, vy);
                        break;
                    case 0x0003:
                        this.xor(vx, vy);
                        break;
                    case 0x0004:
                        this.add(vx, vy);
                        break;
                    case 0x0005:
                        this.sub(vx, vy);
                        break;
                    case 0x0006:
                        this.shiftRight(vx);
                        break;
                    case 0x0007:
                        this.subReverse(vx, vy);
                        break;
                    case 0x000E:
                        this.shiftLeft(vx);
                        break;
                    default:
                        console.log(instruction + " is not implemented");
                }
                break;
            case 0x9000:
                this.skipNeq(vx, vy);
                break;
            case 0xA000:
                this.loadIndex(nnn);
                break;
            case 0xB000:
                this.jumpOffset(nnn);
                break;
            case 0xC000:
                this.rnd(vx, nn);
                break;
            case 0xD000:
                this.draw(vx, vy, n);
                this.display.updateCanvas();
                break;

            case 0xE000:
                switch (instruction & 0x00FF) {
                    case 0x009E:
                        this.skipPressed(vx);
                        break;
                    case 0x00A1:
                        this.skipNotPressed(vx)
                        break;
                    default:
                        console.log(instruction + " is not implemented");
                }
                break;
            case 0xF000:
                switch (instruction & 0x00FF) {
                    case 0x0007:
                        this.loadVxDt(vx);
                        break;
                    case 0x000A:
                        this.getKey(vx);
                        break;
                    case 0x0015:
                        this.loadDtVx(vx);
                        break;
                    case 0x0018:
                        this.loadStVx(vx);
                        break;
                    case 0x001E:
                        this.addIndex(vx);
                        break;
                    case 0x0029:
                        this.indexTofontCharacter(vx);
                        break;
                    case 0x0033:
                        this.toDecimal(vx);
                        break;
                    case 0x0055:
                        this.saveRegisters(vx);
                        break;
                    case 0x0065:
                        this.loadRegisters(vx);
                        break;
                }
                break;

            default:
                console.log(instruction + " is not implemented");
        }
    }

    // 00E0
    // Clear the display.
    cls() {
        display.clearScreen();
    }

    // 00EE
    // Return from a subroutine.
    ret() {
        if (this.SP > 0) {
            this.SP--;
        }
        this.PC = this.stack[this.SP];
    }

    // 1NNN
    // Jump to location nnn.
    jump(nnn) {
        this.PC = nnn;
    }

    // 2NNN
    // Call subroutine at nnn.
    call(nnn) {
        this.stack[this.SP] = this.PC;
        this.SP++;
        this.PC = nnn;
    }

    // 3XNN
    // Skip next instruction if Vx = nn.
    skipEqi(vx, nn) {
        if (this.registers[vx] == nn) {
            this.PC += 2;
        }
    }

    // 4XNN
    // Skip next instruction if Vx != nn.
    skipNeqi(vx, nn) {
        if (this.registers[vx] != nn) {
            this.PC += 2;
        }
    }

    // 5XY0
    // Skip next instruction if Vx = Vy.
    skipEq(vx, vy) {
        if (this.registers[vx] == this.registers[vy]) {
            this.PC += 2;
        }
    }

    // 6XNN
    // Set Vx = nn.
    loadi(vx, nn) {
        this.registers[vx] = nn;
    }

    // 7XNN
    // Set Vx = Vx + nn.
    addi(vx, nn) {
        this.registers[vx] += nn;
    }

    // 8XY0
    // Set Vx = Vy.
    load(vx, vy) {
        this.registers[vx] = this.registers[vy];
    }

    // 8XY1
    // Set Vx = Vx OR Vy.
    or(vx, vy) {
        this.registers[vx] = this.registers[vx] | this.registers[vy];
    }

    // 8XY2
    // Set Vx = Vx AND Vy.
    and(vx, vy) {
        this.registers[vx] = this.registers[vx] & this.registers[vy];
    }

    // 8XY3
    // Set Vx = Vx XOR Vy.
    xor(vx, vy) {
        this.registers[vx] = this.registers[vx] ^ this.registers[vy];
    }

    // 8XY4
    // Set Vx = Vx + Vy, set VF = carry.
    add(vx, vy) {
        if (this.registers[vx] + this.registers[vy] > 255) {
            this.registers[0xF] = 1;
        }
        this.registers[vx] += this.registers[vy];
    }

    // 8XY5
    // Set Vx = Vx - Vy, set VF = NOT borrow.
    sub(vx, vy) {
        if (this.registers[vx] > this.registers[vy]) {
            this.registers[0xF] = 1;
        } else {
            this.registers[0xF] = 0;
        }
        this.registers[vx] = this.registers[vx] - this.registers[vy];
    }

    // 8XY6
    // Set Vx = Vx SHR 1.
    shiftRight(vx) {
        this.registers[0xF] = this.registers[vx] & 0x01;
        this.registers[vx] = this.registers[vx] >> 1;
    }

    // 8XY7
    // Set Vx = Vy - Vx, set VF = NOT borrow.
    subReverse(vx, vy) {
        if (this.registers[vy] > this.registers[vx]) {
            this.registers[0xF] = 1;
        }
        else {
            this.registers[0xF] = 0;
        }
        this.registers[vx] = this.registers[vy] - this.registers[vx];
    }

    // 8XYE
    // Set Vx = Vx SHL 1.
    shiftLeft(vx) {
        this.registers[0xF] = this.registers[vx] & 0x01;
        this.registers[vx] = this.registers[vx] << 1;
    }


    // 9XY0
    // Skip next instruction if Vx != Vy.
    skipNeq(vx, vy) {
        if (this.registers[vx] != this.registers[vy]) {
            this.PC += 2;
        }
    }

    // ANNN
    // Set I = nnn.
    loadIndex(nnn) {
        this.I = nnn;
    }

    // BNNN
    // Jump to location nnn + V0.
    jumpOffset(nnn) {
        this.PC = this.registers[0] + nnn;
    }

    // CXNN
    // Set Vx = random byte AND nn.
    rnd(vx, nn) {
        this.registers[vx] = Math.floor(Math.random() * 256) & nn;
    }

    // DXYN
    // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
    draw(vx, vy, n) {
        this.registers[0xF] = 0;
        let yCoordinate = this.registers[vy] % this.rows;

        for (let i = 0; i < n; i++) {
            if (yCoordinate >= this.rows) {
                break;
            }
            let xCoordinate = this.registers[vx] % this.cols;

            const fontByte = this.memory[this.I + i];
            for (let j = 128; j >= 1; j /= 2) {
                if (xCoordinate >= this.cols) {
                    break;
                }
                const currentBit = fontByte & j;
                if (currentBit != 0 && this.display.getPixelAt(xCoordinate, yCoordinate) != 0) {
                    this.display.setPixelOff(xCoordinate, yCoordinate);
                    this.registers[0xF] = 1;
                } else if (currentBit != 0 && this.display.getPixelAt(xCoordinate, yCoordinate) == 0) {
                    this.display.setPixelOn(xCoordinate, yCoordinate);
                }
                xCoordinate++;
            }
            yCoordinate++;
        }
    }


    // EX9E
    //Skip next instruction if key with the value of Vx is pressed.
    skipPressed(vx) {
        if (keyboard.isKeyPressed(this.registers[vx])) {
            this.PC += 2;
        }
    }

    // EXA1
    // Skip next instruction if key with the value of Vx is not pressed.
    skipNotPressed(vx) {
        if (!this.keyboard.isKeyPressed(this.registers[vx])) {
            this.PC += 2;
        }
    }

    // FX07 
    // Set Vx = delay timer value.
    loadVxDt(vx) {
        this.registers[vx] = this.delayTimer;
    }

    // FX15
    // Set delay timer = Vx.
    loadDtVx(vx) {
        this.delayTimer = this.registers[vx];
    }

    // FX18
    // Set sound timer = Vx.
    loadStVx(vx) {
        this.soundTimer = this.registers[vx];
    }

    // FX0A
    // Wait for a key press, store the value of the key in Vx.
    getKey(vx) {
        const keyPressed = keyboard.getAnyKeyPressed;
        if (keyPressed >= 0) {
            this.PC -= 2;
        } else {
            this.registers[vx] = keyPressed;
        }
    }

    // FX1E
    // Set I = I + Vx.
    addIndex(vx) {
        this.I = this.I + this.registers[vx];
    }

    // FX29
    // Set I = location of sprite for digit Vx.
    indexTofontCharacter(vx) {
        this.I = 0x50 + (this.registers[vx] * 5);
    }

    // FX33
    // Store BCD representation of Vx in memory locations I, I+1, and I+2.
    toDecimal(vx) {
        const digits = this.registers[vx].toString().padStart(3, '0').split('').map(Number);
        for (let i = 0; i <= 2; i++) {
            this.memory[this.I + i] = digits[i];
        }
    }

    // FX55 
    // Store registers V0 through Vx in memory starting at location I.
    saveRegisters(vx) {
        for (let i = 0; i <= vx; i++) {
            this.memory[this.I + i] = this.registers[i];
        }
    }

    // FX65
    // Read registers V0 through Vx from memory starting at location I.
    loadRegisters(vx) {
        for (let i = 0; i <= vx; i++) {
            this.registers[i] = this.memory[this.I + i];
        }
    }

}






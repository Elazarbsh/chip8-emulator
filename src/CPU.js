import { DELAY_TIMER_FREQ, SOUND_TIMER_FREQ } from "../data/frequencies.js";
import { PROGRAM_ADDRESS, FONT_ADDRESS } from "../data/addresses.js";

export class CPU {
    I = FONT_ADDRESS;
    PC = PROGRAM_ADDRESS;
    delayTimer = 0;
    soundTimer = 0;

    constructor(memory, stack, registers, frameBuffer, display, keyboard){
        this.memory = memory;
        this.stack = stack;
        this.registers = registers;
        this.frameBuffer = frameBuffer;
        this.display = display;
        this.keyboard = keyboard;
        this.delayTimerInterval = setInterval(this.updateDelayTimer.bind(this), DELAY_TIMER_FREQ);
        this.soundTimerInterval = setInterval(this.updateSoundTimer.bind(this), SOUND_TIMER_FREQ);
    }

    startTimers(){
        this.delayTimerInterval = setInterval(this.updateDelayTimer.bind(this), DELAY_TIMER_FREQ);
        this.soundTimerInterval = setInterval(this.updateSoundTimer.bind(this), SOUND_TIMER_FREQ);
    }

    stopTimers(){
        clearInterval(this.delayTimerInterval);
        clearInterval(this.soundTimer);
    }

    reset() {
        I = FONT_ADDRESS;
        this.PC = PROGRAM_ADDRESS;
        this.delayTimer = 0;
        this.soundTimer = 0;
    }

    cycle() {
        const instruction = this.memory.fetchInstruction(this.PC);
        this.PC += 2;
        const decodedInstruction = this.decode(instruction);
        console.log("fetched: " + instruction.toString(16).padStart(4, '0'));
        this.execute(decodedInstruction);
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

    decode(rawInstruction) {
        return {
            raw: rawInstruction,
            opcode: rawInstruction & 0xF000,
            func: rawInstruction & 0x000F,
            vx: (rawInstruction & 0x0F00) >> 8,
            vy: (rawInstruction & 0x00F0) >> 4,
            n: rawInstruction & 0x000F,
            nn: rawInstruction & 0x00FF,
            nnn: rawInstruction & 0x0FFF,
        }
    }

    execute(instruction) {
        const opcode = instruction.opcode;
        const func = instruction.func;
        const vx = instruction.vx;
        const vy = instruction.vy;
        const n = instruction.n;
        const nn = instruction.nn;
        const nnn = instruction.nnn;

        switch (opcode) {
            case 0x0000:
                switch (instruction.raw) {
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
                this.display.update();
                break;

            case 0xE000:
                switch (instruction.raw & 0x00FF) {
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
                switch (instruction.raw & 0x00FF) {
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
        frameBuffer.clearScreen();
    }

    // 00EE
    // Return from a subroutine.
    ret() {
        this.PC = this.stack.pop();
    }

    // 1NNN
    // Jump to location nnn.
    jump(nnn) {
        this.PC = nnn;
    }

    // 2NNN
    // Call subroutine at nnn.
    call(nnn) {
        this.stack.push(this.PC);
        this.PC = nnn;
    }

    // 3XNN
    // Skip next instruction if Vx = nn.
    skipEqi(vx, nn) {
        if (this.registers.getRegister(vx) == nn) {
            this.PC += 2;
        }
    }

    // 4XNN
    // Skip next instruction if Vx != nn.
    skipNeqi(vx, nn) {
        if (this.registers.getRegister(vx) != nn) {
            this.PC += 2;
        }
    }

    // 5XY0
    // Skip next instruction if Vx = Vy.
    skipEq(vx, vy) {
        if (this.registers.getRegister(vx) == this.registers.getRegister(vy)) {
            this.PC += 2;
        }
    }

    // 6XNN
    // Set Vx = nn.
    loadi(vx, nn) {
        this.registers.setRegister(vx, nn);
    }

    // 7XNN
    // Set Vx = Vx + nn.
    addi(vx, nn) {
        this.registers.addToReg(vx, nn);
    }

    // 8XY0
    // Set Vx = Vy.
    load(vx, vy) {
        this.registers.copyReg(vx, vy);
    }

    // 8XY1
    // Set Vx = Vx OR Vy.
    or(vx, vy) {
        this.registers.setRegister(vx, this.registers.getRegister(vx) | this.registers.getRegister(vy));
    }

    // 8XY2
    // Set Vx = Vx AND Vy.
    and(vx, vy) {
        this.registers.setRegister(vx, this.registers.getRegister(vx) & this.registers.getRegister(vy));
    }

    // 8XY3
    // Set Vx = Vx XOR Vy.
    xor(vx, vy) {
        this.registers.setRegister(vx,this.registers.getRegister(vx) ^ this.registers.getRegister(vy));
    }

    // 8XY4
    // Set Vx = Vx + Vy, set VF = carry.
    add(vx, vy) {
        if (this.registers.getRegister(vx) + this.registers.getRegister(vy) > 255) {
            this.registers.setRegister(0xF,1);
        }
        this.registers.addToReg(vx, this.registers.getRegister(vy));
    }

    // 8XY5
    // Set Vx = Vx - Vy, set VF = NOT borrow.
    sub(vx, vy) {
        if (this.registers.getRegister(vx) > this.registers.getRegister(vy)) {
            this.registers.setRegister(0xF, 1);
        } else {
            this.registers.setRegister(0xF, 0);
        }
        this.registers.setRegister(vx, this.registers.getRegister(vx) - this.registers.getRegister(vy));
    }

    // 8XY6
    // Set Vx = Vx SHR 1.
    shiftRight(vx) {
        this.registers.setRegister(0xF, this.registers.getRegister(vx) & 0x01);
        this.registers.setRegister(vx, this.registers.getRegister(vx) >> 1);
    }

    // 8XY7
    // Set Vx = Vy - Vx, set VF = NOT borrow.
    subReverse(vx, vy) {
        if (this.registers.getRegister(vy) > this.registers.getRegister(vx)) {
            this.registers.setRegister(0xF, 1);
        }
        else {
            this.registers.setRegister(0xF, 0);
        }
        this.registers.setRegister(vx, this.registers.getRegister(vy) - this.registers.getRegister(vx));
    }

    // 8XYE
    // Set Vx = Vx SHL 1.
    shiftLeft(vx) {
        this.registers.setRegister(0xF, this.registers.getRegister(vx) & 0x01);
        this.registers.setRegister(vx, this.registers.getRegister(vx) << 1);
    }


    // 9XY0
    // Skip next instruction if Vx != Vy.
    skipNeq(vx, vy) {
        if (this.registers.getRegister(vx) != this.registers.getRegister(vy)) {
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
        this.PC = this.registers.getRegister(0) + nnn;
    }

    // CXNN
    // Set Vx = random byte AND nn.
    rnd(vx, nn) {
        this.registers.setRegister(vx, Math.floor(Math.random() * 256) & nn);
    }

    // DXYN
    // Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision.
    draw(vx, vy, n) {
        this.registers.setRegister(0xF, 0);
        let yCoordinate = this.registers.getRegister(vy) % this.frameBuffer.rowCount;

        for (let i = 0; i < n; i++) {
            if (yCoordinate >= this.frameBuffer.rowCount) {
                break;
            }
            let xCoordinate = this.registers.getRegister(vx) % this.frameBuffer.colCount;

            const fontByte = this.memory.read(this.I + i);
            for (let j = 128; j >= 1; j /= 2) {
                if (xCoordinate >= this.frameBuffer.colCount) {
                    break;
                }
                const currentBit = fontByte & j;
                if (currentBit != 0 && this.frameBuffer.getPixelAt(xCoordinate, yCoordinate) != 0) {
                    this.frameBuffer.setPixelOff(xCoordinate, yCoordinate);
                    this.registers.setRegister(0xF, 1);
                } else if (currentBit != 0 && this.frameBuffer.getPixelAt(xCoordinate, yCoordinate) == 0) {
                    this.frameBuffer.setPixelOn(xCoordinate, yCoordinate);
                }
                xCoordinate++;
            }
            yCoordinate++;
        }
    }


    // EX9E
    //Skip next instruction if key with the value of Vx is pressed.
    skipPressed(vx) {
        if (this.keyboard.isKeyPressed(this.registers.getRegister(vx))) {
            this.PC += 2;
        }
    }

    // EXA1
    // Skip next instruction if key with the value of Vx is not pressed.
    skipNotPressed(vx) {
        if (!this.keyboard.isKeyPressed(this.registers.getRegister(vx))) {
            this.PC += 2;
        }
    }

    // FX07 
    // Set Vx = delay timer value.
    loadVxDt(vx) {
        this.registers.setRegister(vx, this.delayTimer);
    }

    // FX15
    // Set delay timer = Vx.
    loadDtVx(vx) {
        this.delayTimer = this.registers.getRegister(vx);
    }

    // FX18
    // Set sound timer = Vx.
    loadStVx(vx) {
        this.soundTimer = this.registers.getRegister(vx);
    }

    // FX0A
    // Wait for a key press, store the value of the key in Vx.
    getKey(vx) {
        const keyPressed = this.keyboard.getAnyKeyPressed;
        if (keyPressed >= 0) {
            this.PC -= 2;
        } else {
            this.registers.setRegister(vx, keyPressed);
        }
    }

    // FX1E
    // Set I = I + Vx.
    addIndex(vx) {
        this.I = this.I + this.registers.getRegister(vx);
    }

    // FX29
    // Set I = location of sprite for digit Vx.
    indexTofontCharacter(vx) {
        this.I = 0x50 + (this.registers.getRegister(vx) * 5);
    }

    // FX33
    // Store BCD representation of Vx in memory locations I, I+1, and I+2.
    toDecimal(vx) {
        const digits = this.registers.getRegister(vx).toString().padStart(3, '0').split('').map(Number);
        for (let i = 0; i <= 2; i++) {
            this.memory.write(this.I + i, digits[i]);
        }
    }

    // FX55 
    // Store registers V0 through Vx in memory starting at location I.
    saveRegisters(vx) {
        for (let i = 0; i <= vx; i++) {
            this.memory.read(this.I + i) = this.registers.getRegister(i);
        }
    }

    // FX65
    // Read registers V0 through Vx from memory starting at location I.
    loadRegisters(vx) {
        for (let i = 0; i <= vx; i++) {
            this.registers.setRegister(i, this.memory.read(this.I + i));
        }
    }

}







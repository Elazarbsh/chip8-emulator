export class Memory {

    constructor(memorySize = 4096) {
        this.memorySize = memorySize;
        this.memory = new Uint8Array(this.memorySize);
    }

    reset() {
        this.memory = new Uint8Array(this.memorySize);
    }

    read(address) {
        this.validateAddress(address);
        return this.memory[address];
    }

    write(address, data) {
        this.validateAddress(address);
        this.memory[address] = data;
    }

    fetchInstruction(address) {
        this.validateAddress(address);
        const b1 = this.read(address);
        const b2 = this.read(address + 1);
        return b1 << 8 | b2;
    }

    load(program, address) {
        if (address + program.length > this.memorySize) {
            throw new Error('Program too large to fit in memory');
        }
        for (const byte of program) {
            this.write(address, byte);
            address++;
        }
    }

    validateAddress(address) {
        if (address < 0 || address >= this.memorySize) {
            throw new Error('Invalid memory address ' + address);
        }
    }
}
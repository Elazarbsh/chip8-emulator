export class Memory {

    constructor(memorySize = 4096) {
        this.memorySize = memorySize;
        this.memory = new Uint8Array(this.memorySize);
    }

    reset(){
        this.memory = new Uint8Array(this.memorySize);
    }

    read(address) {
        return this.memory[address];
    }

    write(address, data) {
        this.memory[address] = data;
    }

    fetchInstruction(address){
        const b1 = this.read(address);
        const b2 = this.read(address + 1);
        return b1 << 8 | b2;
    }

    load(program, address) {
        for (const byte of program) {
            this.write(address, byte);
            address++;
        }
    }
}
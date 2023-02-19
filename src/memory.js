export class Memory{
    memorySize = 4096;
    memory = new Uint8Array(this.memorySize);

    constructor(memorySize){
        this.memorySize = memorySize;
    }

    read(address){
        return this.memory[address];
    }

    write(address, data){
        this.memory[address] = data;
    }

    load(program, address) {
        for (const byte of program) {
            this.write(address, byte);
            address++;
        }
    }
}
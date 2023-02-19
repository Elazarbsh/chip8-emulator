
export class RegisterFile{
    numOfRegisters = 16;
    registers = new Uint8Array(16);

    constructor(numOfRegisters){
        this.numOfRegisters = numOfRegisters;
    }
    getRegister(regIndex){
        return this.registers[regIndex];
    }

    setRegister(regIndex, value){
        this.registers[regIndex] = value;
    }

}
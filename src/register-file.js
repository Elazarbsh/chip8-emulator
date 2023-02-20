
export class RegisterFile{

    constructor(numOfRegisters = 16){
        this.numOfRegisters = numOfRegisters;
        this.registers = new Uint8Array(numOfRegisters);
    }

    getRegister(regIndex){
        return this.registers[regIndex];
    }

    addToReg(regIndex, value){
        this.registers[regIndex] += value;
    }

    copyReg(target, source){
        this.registers[target] = this.registers[source];
    }

    setRegister(regIndex, value){
        this.registers[regIndex] = value;
    }

}
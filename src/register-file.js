
export class RegisterFile{

    constructor(registerCount = 16){
        this.registerCount = registerCount;
        this.registers = new Uint8Array(registerCount);
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
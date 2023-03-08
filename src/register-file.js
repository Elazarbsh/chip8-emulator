
export class RegisterFile {

    constructor(registerCount = 16) {
        this.registerCount = registerCount;
        this.registers = new Uint8Array(registerCount);
    }

    reset() {
        this.registers = new Uint8Array(this.registerCount);
    }

    getRegister(regIndex) {
        this.validateRegIndex(regIndex);
        return this.registers[regIndex];
    }

    addToReg(regIndex, value) {
        this.validateRegIndex(regIndex);
        this.registers[regIndex] += value;
    }

    copyReg(target, source) {
        this.validateRegIndex(target);
        this.validateRegIndex(source);
        this.registers[target] = this.registers[source];
    }

    setRegister(regIndex, value) {
        this.validateRegIndex(regIndex);
        this.registers[regIndex] = value;
    }

    validateRegIndex(regIndex) {
        if (regIndex < 0 || regIndex >= this.registerCount) {
            throw new Error('Invalid register index. The specified register index is not valid');
        }
    }
}
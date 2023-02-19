export class Stack{
    stack = new Uint16Array(16);
    SP = 0;

    push(value){
        this.stack[this.SP] = value;
        this.SP++;
    }

    pop(){
        if (this.SP > 0) {
            this.SP--;
        }
        return this.stack[this.SP];
    }
}
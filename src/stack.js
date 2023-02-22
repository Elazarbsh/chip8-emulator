export class Stack{
    SP = 0;
    
    constructor(size = 16){
        this.size = size;
        this.stack = new Uint16Array(size);
    }

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
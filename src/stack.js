export class Stack{
    SP = 0;

    constructor(size = 16){
        this.size = size;
        this.stack = new Uint16Array(size);
    }

    reset(){
        this.stack = new Uint16Array(this.size);
        this.SP = 0;
    }

    push(value){
        if(this.SP >= this.size){
            throw new Error('Stack overflow. The stack is already full and cannot accept any more values.');
        }
        this.stack[this.SP] = value;
        this.SP++;
        
    }

    pop(){
        if(this.SP <= 0){
            throw new Error('pop called on empty stack');
        }
        if (this.SP > 0) {
            this.SP--;
        }
        return this.stack[this.SP];
    }
}
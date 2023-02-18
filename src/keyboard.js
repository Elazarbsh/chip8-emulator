
export class Keyboard {
    keymap = {
        49: 0x1, // 1 1
        50: 0x2, // 2 2
        51: 0x3, // 3 3
        52: 0xc, // 4 C
        81: 0x4, // Q 4
        87: 0x5, // W 5
        69: 0x6, // E 6
        82: 0xD, // R D
        65: 0x7, // A 7
        83: 0x8, // S 8
        68: 0x9, // D 9
        70: 0xE, // F E
        90: 0xA, // Z A
        88: 0x0, // X 0
        67: 0xB, // C B
        86: 0xF  // V F
    };

    constructor() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    keyState = new Array(16);



    onKeyDown(e) {
        const key = e.keyCode;
        if (!(key in this.keymap)) {
            return;
        }
        this.keyState[this.keymap[key]] = true;
        console.log(this.keymap[key] + " pressed down");
    }

    onKeyUp(e) {
        const key = e.keyCode;
        if (!(key in this.keymap)) {
            return;
        }
        this.keyState[this.keymap[key]] = false;
        console.log(this.keymap[key] + " pressed up");
    }

    isKeyPressed(chip8KeyCode) {
        return this.keyState[chip8KeyCode];
    }

    getAnyKeyPressed() {
        return this.keyState.indexOf(true);
    }

}



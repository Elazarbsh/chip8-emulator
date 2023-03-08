
export class InputBuffer {

    keyState = new Array(16);

    setKeyPressedFalse(chip8KeyCode){
        this.keyState[chip8KeyCode] = false;
    }

    setKeyPressedTrue(chip8KeyCode){
        this.keyState[chip8KeyCode] = true;
    }

    isKeyPressed(chip8KeyCode) {
        return this.keyState[chip8KeyCode];
    }

    getAnyKeyPressed() {
        return this.keyState.indexOf(true);
    }
}



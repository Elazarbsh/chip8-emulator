
export class InputBuffer {

    keyState = new Array(16).fill(false);

    setKeyPressedFalse(chip8KeyCode) {
        this.validateKey(chip8KeyCode);
        this.keyState[chip8KeyCode] = false;
    }

    setKeyPressedTrue(chip8KeyCode) {
        this.validateKey(chip8KeyCode);
        this.keyState[chip8KeyCode] = true;
    }

    isKeyPressed(chip8KeyCode) {
        this.validateKey(chip8KeyCode);
        return this.keyState[chip8KeyCode];
    }

    getAnyKeyPressed() {
        return this.keyState.indexOf(true);
    }

    validateKey(chip8KeyCode) {
        if (chip8KeyCode < 0 || chip8KeyCode > 15) {
            throw new Error(
                `Chip8 key code must be between 0 and 15, got ${chip8KeyCode}`
            );
        }
    }
}



const keymap = {
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

const keyState = new Array(16);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);


function onKeyDown(e){
    const key = e.keyCode;
    if(!(key in keymap)){
        return;
    }
    keyState[keymap[key]] = true;
    console.log(keymap[key] + " pressed down");
}

function onKeyUp(e){
    const key = e.keyCode;
    if(!(key in keymap)){
        return;
    }
    keyState[keymap[key]] = false;
    console.log(keymap[key] + " pressed up");
}

export function isKeyPressed(chip8KeyCode){
    return keyState[chip8KeyCode];
}

export function getAnyKeyPressed(){
    return keyState.indexOf(true);
}
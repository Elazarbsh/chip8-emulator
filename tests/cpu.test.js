
import { beforeEach, it, expect, describe, vi } from "vitest";

import { Memory } from "../src/memory.js";
import { Stack } from "../src/stack.js";
import { RegisterFile } from "../src/register-file.js";
import { FrameBuffer } from "../src/frame-buffer.js";
import { Display } from "../src/display.js";
import { Keyboard } from "../src/keyboard.js";
import { CPU } from "../src/CPU.js";

vi.mock('../src/stack.js');
vi.mock('../src/register-file.js');
vi.mock('../src/frame-buffer.js');
vi.mock('../src/display.js');
vi.mock('../src/keyboard.js');
vi.mock('../src/memory.js', () => {
    console.log('creating mock object');
    const Memory = vi.fn(() => ({
        fetchInstruction: vi.fn((address) => {
            console.log("calling fetch instruction");
            return 0x00E0;
        }),
        read: (address) => { return 10 },
    }))
    return { Memory }
});

let cpu;
let memory;
let stack;
let registerFile;
let frameBuffer;
let display;
let keyboard;

beforeEach(() => {
    vi.clearAllMocks();
    memory = new Memory();
    stack = new Stack();
    registerFile = new RegisterFile();
    frameBuffer = new FrameBuffer();
    display = new Display(frameBuffer);
    keyboard = new Keyboard();
    cpu = new CPU(memory, stack, registerFile, frameBuffer, display, keyboard);
});

describe('cpu cycle', () => {
    it('should fetch one instruction per cycle', () => {
        memory.fetchInstruction.mockReturnValueOnce(0x00e0);
        cpu.cycle();
        expect(frameBuffer.clearScreen).toBeCalledTimes(1);
    });
});

describe('0x00E0 - clear screen', () => {
    it('should call the frame buffer clear method', () => {
        memory.fetchInstruction.mockReturnValueOnce(0x00e0);
        cpu.cycle();
        expect(frameBuffer.clearScreen).toBeCalledTimes(1);
    });
});

describe('0x00EE - return from subroutine', () => {
    it('should return from a subroutine', () => {
        memory.fetchInstruction.mockReturnValueOnce(0x00ee);
        cpu.cycle();
        expect(stack.pop).toBeCalledTimes(1);
    });
});

describe('0x2NNN - call subroutine', () => {
    it('should call a subroutine', () => {
        memory.fetchInstruction.mockReturnValueOnce(0x2400);
        cpu.cycle();
        expect(stack.push).toBeCalledTimes(1);
    });
});

describe('0x6XNN - load register', () => {
    it('should set reg x with the value nn', () => {
        memory.fetchInstruction.mockReturnValueOnce(0x6238);
        cpu.cycle();
        expect(registerFile.setRegister).toBeCalledWith(0x2, 0x38);
    });
});

describe('0x7XNN - add to reg', () => {
    it('should add the value nn to register x', () => {
        memory.fetchInstruction.mockReturnValueOnce(0x7238);
        cpu.cycle();
        expect(registerFile.addToReg).toBeCalledWith(0x2, 0x38);
    });
});

describe('0x8XY0 - load reg', () => {
    it('should copy the value of reg y to register x', () => {
        memory.fetchInstruction.mockReturnValueOnce(0x8230);
        cpu.cycle();
        expect(registerFile.copyReg).toBeCalledWith(0x2, 0x3);
    });
});


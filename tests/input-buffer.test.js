import { beforeEach, it, expect, describe } from "vitest";
import { InputBuffer } from "../src/input-buffer";

let inputBuffer;

beforeEach(() => {
    inputBuffer = new InputBuffer();
});

describe('InputBuffer', () => {
    it("should initially set all key states to false", () => {
        for (let i = 0; i < 16; i++) {
            expect(inputBuffer.isKeyPressed(i)).toBe(false);
        }
    });

    it("should return the index of any key that is currently pressed when getAnyKeyPressed is called", () => {
        inputBuffer.setKeyPressedTrue(2);
        expect(inputBuffer.getAnyKeyPressed()).toBe(2);
        inputBuffer.setKeyPressedTrue(4);
        expect([2, 4]).toContain(inputBuffer.getAnyKeyPressed());
    });
    
    describe("setKeyPressedFalse", () => {
        it("should set the specified key state to true when setKeyPressedTrue is called", () => {
            inputBuffer.setKeyPressedTrue(5);
            expect(inputBuffer.isKeyPressed(5)).toBe(true);
        });

        it("should set the specified key state to false when setKeyPressedFalse is called", () => {
            inputBuffer.setKeyPressedTrue(3);
            inputBuffer.setKeyPressedFalse(3);
            expect(inputBuffer.isKeyPressed(3)).toBe(false);
        });

        it("should throw an OutOfRangeError if chip8KeyCode is less than 0", () => {
            expect(() => inputBuffer.setKeyPressedFalse(-1)).toThrow(/Chip8 key code must be between 0 and 15/);
        });

        it("should throw an OutOfRangeError if chip8KeyCode is greater than 15", () => {
            expect(() => inputBuffer.setKeyPressedFalse(16)).toThrow(/Chip8 key code must be between 0 and 15/);
        });
    });
});





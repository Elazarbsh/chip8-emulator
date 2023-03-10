import { beforeEach, it, expect, describe } from "vitest";
import { FrameBuffer } from "../src/frame-buffer";

let frameBuffer;

beforeEach(() => {
    frameBuffer = new FrameBuffer(32, 64);
});

describe('frame buffer', () => {
    it("should create a FrameBuffer with the correct number of rows and columns", () => {
        expect(frameBuffer.rowCount).toBe(32);
        expect(frameBuffer.colCount).toBe(64);
    });

    it("should clear the screen when clearScreen is called", () => {
        const frameBuffer = new FrameBuffer(2, 2);
        frameBuffer.setPixelOn(0, 0);
        frameBuffer.setPixelOn(1, 0);
        frameBuffer.setPixelOn(0, 1);
        frameBuffer.setPixelOn(1, 1);
        frameBuffer.clearScreen();
        expect(frameBuffer.getPixelAt(0, 0)).toBe(0);
        expect(frameBuffer.getPixelAt(1, 0)).toBe(0);
        expect(frameBuffer.getPixelAt(0, 1)).toBe(0);
        expect(frameBuffer.getPixelAt(1, 1)).toBe(0);

    });

    describe('set pixels', () => {
        it("should turn on the pixel at the specified position when setPixelOn is called", () => {
            frameBuffer.setPixelOn(10, 20);
            expect(frameBuffer.getPixelAt(10, 20)).toBe(1);
        });

        it("should turn off the pixel at the specified position when setPixelOff is called", () => {
            frameBuffer.setPixelOn(10, 20);
            frameBuffer.setPixelOff(10, 20);
            expect(frameBuffer.getPixelAt(10, 20)).toBe(0);
        });

        it("should throw an error when trying to set a row pixel out of bounds", () => {
            expect(() => frameBuffer.setPixelOn(100, 0)).toThrow(/Invalid row or column index/);
        });

        it("should throw an error when trying to set a col pixel out of bounds", () => {
            expect(() => frameBuffer.setPixelOff(0, 100)).toThrow(/Invalid row or column index/);
        });
    });

    describe('get pixels', () => {
        it("should return the correct value when getPixelAt is called", () => {
            frameBuffer.setPixelOn(10, 20);
            expect(frameBuffer.getPixelAt(10, 20)).toBe(1);
            frameBuffer.setPixelOff(10, 20);
            expect(frameBuffer.getPixelAt(10, 20)).toBe(0);
        });

        it("should throw an error if row index is out of bounds", () => {
            expect(() => frameBuffer.getPixelAt(100, 0)).toThrow(/Invalid row or column index/);
        });

        it("should throw an error if col index is out of bounds", () => {
            expect(() => frameBuffer.getPixelAt(0, 100)).toThrow(/Invalid row or column index/);
        });
    });
});


import { beforeEach, it, expect, describe } from "vitest";
import { Memory } from "../src/memory";

let memory;

beforeEach(() => {
    memory = new Memory(16);
});

describe("reset", () => {
    it("should reset the memory array", () => {
        const memory = new Memory(2);
        memory.write(0, 10);
        memory.write(1, 20);
        memory.reset();
        expect(memory.read(0)).toEqual(0);
        expect(memory.read(1)).toEqual(0);
    });
});

describe("read/write", () => {
    it("should write data to the specified address", () => {
        memory.write(0, 10);
        expect(memory.read(0)).toBe(10);
    });

    it("should read data from the specified address", () => {
        memory.write(0, 20);
        expect(memory.read(0)).toBe(20);
    });

    it("should throw an error if the address is out of range for read", () => {
        expect(() => memory.read(20)).toThrow(/Invalid memory address/);
    });

    it("should throw an error if the address is out of range for write", () => {
        expect(() => memory.write(20, 10)).toThrow(/Invalid memory address/);
    });

});

describe("fetchInstruction", () => {
    it("should fetch a 2-byte instruction from the specified address", () => {
        memory.write(0, 0x12);
        memory.write(1, 0xAB);
        expect(memory.fetchInstruction(0)).toBe(0x12AB);
    });

    it("should throw an error if the address is out of range for fetchInstruction", () => {
        expect(() => memory.fetchInstruction(20)).toThrow(/Invalid memory address/);
    });
});

describe("load", () => {
    it("should load a program into memory at the specified address", () => {
        const program = [1, 2, 3];
        memory.load(program, 4);
        expect(memory.read(4)).toBe(1);
        expect(memory.read(5)).toBe(2);
        expect(memory.read(6)).toBe(3);
    });

    it("should throw an error if the program overflows the memory", () => {
        const program = new Array(20).fill(0);
        expect(() => memory.load(program, 0)).toThrow(/Program too large/);
    });

    // it("should throw an error if the program contains a value outside of the valid range", () => {
    //     const program = [0xA1, 0xB2, 0x123];
    //     expect(() => memory.load(program, 0)).toThrow();
    // });
});







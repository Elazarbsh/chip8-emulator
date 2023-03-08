import { beforeEach, it, expect, describe } from "vitest";
import { RegisterFile } from "../src/register-file";

let rf;

beforeEach(() => {
    rf = new RegisterFile(16);
});

describe('getRegister', () => {
    it("should throw an error if the register index is out of range for getRegister", () => {
        const rf = new RegisterFile(4);
        expect(() => rf.getRegister(5)).toThrow(/Invalid register index/);
    });
});


describe('setRegister', () => {
    it("should set the value of the specified register", () => {
        rf.setRegister(0, 10)
        expect(rf.getRegister(0)).toBe(10);
    });

    it("should throw an error if the register index is out of range for setRegister", () => {
        const rf = new RegisterFile(4);
        expect(() => rf.setRegister(5, 10)).toThrow(/Invalid register index/);
    });
});

describe('addToReg', () => {
    it("should add the value to the specified register", () => {
        rf.setRegister(2, 20);
        rf.addToReg(2, 5);
        expect(rf.getRegister(2)).toBe(25);
    });

    it("should throw an error if the register index is out of range for addToReg", () => {
        const rf = new RegisterFile(4);
        expect(() => rf.addToReg(5, 5)).toThrow(/Invalid register index/);
    });
});

describe('copyReg', () => {
    it("should copy the value from the source register to the target register", () => {
        rf.setRegister(0, 2);
        rf.copyReg(1, 0);
        expect(rf.getRegister(1)).toBe(2);
    });

    it("should throw an error if the register index is out of range for copyReg target", () => {
        const rf = new RegisterFile(4);
        expect(() => rf.copyReg(5, 0)).toThrow(/Invalid register index/);
    });

    it("should throw an error if the register index is out of range for copyReg source", () => {
        const rf = new RegisterFile(4);
        expect(() => rf.copyReg(0, 5)).toThrow(/Invalid register index/);
    });
});

describe('reset', () => {
    it("should set all registers to 0", () => {
        const rf = new RegisterFile(3);
        rf.setRegister(0, 10);
        rf.setRegister(1, 20);
        rf.setRegister(2, 30);
        rf.reset();
        expect(rf.getRegister(0)).toBe(0);
        expect(rf.getRegister(1)).toBe(0);
        expect(rf.getRegister(2)).toBe(0);
    });
});










import { describe, expect, it } from "vitest";
import { Stack } from "../src/stack.js";


describe('push', () => {
    it("should push to the stack", () => {
        const stack = new Stack(1);
        stack.push(1);
        const result = stack.pop();
        expect(result).toBe(1);
    });

    it('should throw an error if the stack is full', () => {
        const stack = new Stack(1);
        stack.push(1);
        expect(() => stack.push(2)).toThrow();
    });
});

describe('pop', () => {
    it('should remove and return the last value added to the stack', () => {
        const stack = new Stack(2);
        stack.push(1);
        stack.push(2);
        expect(stack.pop()).toEqual(2);
        expect(stack.pop()).toEqual(1);
    });

    it('should throw an error when the stack is empty', () => {
        const stack = new Stack(1);
        expect(() => stack.pop()).toThrow();
    });

});

describe('reset', () => {
    it('should reset the stack to its initial state', () => {
        const stack = new Stack(3);
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.reset();
        expect(() => stack.pop()).toThrow();
    });
});










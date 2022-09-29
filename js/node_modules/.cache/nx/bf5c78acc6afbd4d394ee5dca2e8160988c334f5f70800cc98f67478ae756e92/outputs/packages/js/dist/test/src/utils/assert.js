"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionError = void 0;
/**
 * Error indicating that an assertion failed.
 * @group Errors
 */
class AssertionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AssertionError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AssertionError = AssertionError;
/**
 * Assserts that the provided condition is true.
 * @internal
 */
function assert(condition, message) {
    if (!condition) {
        throw new AssertionError(message !== null && message !== void 0 ? message : 'Assertion failed');
    }
}
exports.default = assert;
/**
 * Asserts that both values are strictly equal.
 * @internal
 */
assert.equal = function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new AssertionError((message !== null && message !== void 0 ? message : '') + ` ${actual} !== ${expected}`);
    }
};
//# sourceMappingURL=assert.js.map
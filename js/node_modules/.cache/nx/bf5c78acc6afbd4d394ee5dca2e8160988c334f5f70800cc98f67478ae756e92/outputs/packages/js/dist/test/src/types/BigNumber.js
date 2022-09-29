"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertBigNumber = exports.isBigNumber = exports.toOptionBigNumber = exports.toBigNumber = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("../utils");
const toBigNumber = (value, endian) => {
    return new bn_js_1.default(value, endian);
};
exports.toBigNumber = toBigNumber;
const toOptionBigNumber = (value) => {
    return value === null ? null : (0, exports.toBigNumber)(value);
};
exports.toOptionBigNumber = toOptionBigNumber;
const isBigNumber = (value) => {
    return (value === null || value === void 0 ? void 0 : value.__opaque__) === 'BigNumber';
};
exports.isBigNumber = isBigNumber;
function assertBigNumber(value) {
    (0, utils_1.assert)((0, exports.isBigNumber)(value), 'Expected BigNumber type');
}
exports.assertBigNumber = assertBigNumber;
//# sourceMappingURL=BigNumber.js.map
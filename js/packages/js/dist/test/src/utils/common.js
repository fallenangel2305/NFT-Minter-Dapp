"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = exports.getExtension = exports.getContentType = exports.randomStr = exports.zipMap = exports.chunk = exports.tryOrNull = exports.tryOr = exports.padEmptyChars = exports.removeEmptyChars = void 0;
const mime_1 = __importDefault(require("mime"));
// eslint-disable-next-line no-control-regex
const removeEmptyChars = (value) => value.replace(/\u0000/g, '');
exports.removeEmptyChars = removeEmptyChars;
const padEmptyChars = (value, chars) => value.padEnd(chars, '\u0000');
exports.padEmptyChars = padEmptyChars;
const tryOr = (callback, defaultValue) => {
    try {
        return callback();
    }
    catch (error) {
        return defaultValue;
    }
};
exports.tryOr = tryOr;
const tryOrNull = (cb) => (0, exports.tryOr)(cb, null);
exports.tryOrNull = tryOrNull;
const chunk = (array, chunkSize) => array.reduce((accumulator, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (!accumulator[chunkIndex]) {
        accumulator[chunkIndex] = [];
    }
    accumulator[chunkIndex].push(item);
    return accumulator;
}, []);
exports.chunk = chunk;
const zipMap = (left, right, fn) => left.map((t, index) => { var _a; return fn(t, (_a = right === null || right === void 0 ? void 0 : right[index]) !== null && _a !== void 0 ? _a : null, index); });
exports.zipMap = zipMap;
const randomStr = (length = 20, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = '';
    const alphabetLength = alphabet.length;
    for (var i = 0; i < length; i++) {
        result += alphabet.charAt(Math.floor(Math.random() * alphabetLength));
    }
    return result;
};
exports.randomStr = randomStr;
const getContentType = (fileName) => mime_1.default.getType(fileName);
exports.getContentType = getContentType;
const getExtension = (fileName) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex < 0 ? null : fileName.slice(lastDotIndex + 1);
};
exports.getExtension = getExtension;
const walk = (parent, cb, options) => {
    var _a;
    const recursiveWalk = (child) => (0, exports.walk)(child, cb, options);
    if (parent && Array.isArray(parent)) {
        parent.forEach((child, index) => {
            cb(recursiveWalk, child, index, parent);
        });
    }
    else if (parent && typeof parent === 'object') {
        const keys = Object.keys(parent);
        if ((_a = options === null || options === void 0 ? void 0 : options.sortObjectKeys) !== null && _a !== void 0 ? _a : true) {
            keys.sort();
        }
        keys.forEach((key) => {
            const child = parent[key];
            cb(recursiveWalk, child, key, parent);
        });
    }
};
exports.walk = walk;
//# sourceMappingURL=common.js.map
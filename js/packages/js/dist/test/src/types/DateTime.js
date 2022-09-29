"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateTime = exports.assertDateTime = exports.isDateTime = exports.toOptionDateTime = exports.now = exports.toDateTime = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("../utils");
const toDateTime = (value) => {
    if (typeof value === 'string' || isDateObject(value)) {
        const date = new Date(value);
        const timestamp = Math.floor(date.getTime() / 1000);
        return new bn_js_1.default(timestamp);
    }
    return new bn_js_1.default(value);
};
exports.toDateTime = toDateTime;
const now = () => (0, exports.toDateTime)(new Date());
exports.now = now;
const toOptionDateTime = (value) => {
    return value === null ? null : (0, exports.toDateTime)(value);
};
exports.toOptionDateTime = toOptionDateTime;
const isDateTime = (value) => {
    return (value === null || value === void 0 ? void 0 : value.__opaque__) === 'DateTime';
};
exports.isDateTime = isDateTime;
function assertDateTime(value) {
    (0, utils_1.assert)((0, exports.isDateTime)(value), 'Expected DateTime type');
}
exports.assertDateTime = assertDateTime;
const isDateObject = (value) => {
    return Object.prototype.toString.call(value) === '[object Date]';
};
const formatDateTime = (value, 
// @ts-ignore
locales = 'en-US', 
// @ts-ignore
options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
}) => {
    const date = new Date(value.toNumber() * 1000);
    return date.toLocaleDateString(locales, options);
};
exports.formatDateTime = formatDateTime;
//# sourceMappingURL=DateTime.js.map
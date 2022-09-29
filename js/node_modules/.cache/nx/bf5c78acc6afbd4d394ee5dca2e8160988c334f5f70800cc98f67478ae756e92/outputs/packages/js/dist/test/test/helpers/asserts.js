"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertThrows = exports.spokSameAmount = exports.spokSameBignum = exports.spokSamePubkey = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const types_1 = require("../../src/types");
function spokSamePubkey(a) {
    const keyStr = typeof a === 'string' ? a : a === null || a === void 0 ? void 0 : a.toString();
    const key = typeof a === 'string' ? new web3_js_1.PublicKey(a) : a;
    const same = (b) => b != null && !!(key === null || key === void 0 ? void 0 : key.equals(b));
    same.$spec = `spokSamePubkey(${keyStr})`;
    same.$description = `${keyStr} equal`;
    return same;
}
exports.spokSamePubkey = spokSamePubkey;
function spokSameBignum(a) {
    const same = (b) => {
        if (a == null)
            return b == null;
        return b != null && new bn_js_1.default(a).eq(new bn_js_1.default(b));
    };
    same.$spec = `spokSameBignum(${a})`;
    same.$description = `${a} equal`;
    return same;
}
exports.spokSameBignum = spokSameBignum;
function spokSameAmount(a) {
    const same = (b) => {
        return !!b && (0, types_1.sameAmounts)(a, b);
    };
    same.$spec = `spokSameAmount(${a})`;
    same.$description = `${a} equal`;
    return same;
}
exports.spokSameAmount = spokSameAmount;
function assertThrows(t, fnOrPromise, match) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof fnOrPromise === 'function') {
                yield fnOrPromise();
            }
            else {
                yield fnOrPromise;
            }
            t.fail(`expected to throw ${match.toString()}`);
        }
        catch (error) {
            const message = (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : '';
            if (message.match(match)) {
                t.pass(`throws ${match.toString()}`);
            }
            else {
                t.fail(`expected to throw ${match.toString()}, got ${message}`);
            }
        }
    });
}
exports.assertThrows = assertThrows;
//# sourceMappingURL=asserts.js.map
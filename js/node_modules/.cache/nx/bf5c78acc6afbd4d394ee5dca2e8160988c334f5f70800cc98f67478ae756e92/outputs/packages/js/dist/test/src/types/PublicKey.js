"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicKey = void 0;
const web3_js_1 = require("@solana/web3.js");
const toPublicKey = (value) => {
    if (typeof value === 'object' && 'publicKey' in value) {
        return value.publicKey;
    }
    if (typeof value === 'object' && 'address' in value) {
        return value.address;
    }
    return new web3_js_1.PublicKey(value);
};
exports.toPublicKey = toPublicKey;
//# sourceMappingURL=PublicKey.js.map
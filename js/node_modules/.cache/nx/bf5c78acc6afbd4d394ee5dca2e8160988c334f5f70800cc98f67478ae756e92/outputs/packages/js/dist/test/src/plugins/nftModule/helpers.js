"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMintAddress = void 0;
const types_1 = require("../../types");
const toMintAddress = (value) => {
    return typeof value === 'object' && 'mintAddress' in value
        ? value.mintAddress
        : (0, types_1.toPublicKey)(value);
};
exports.toMintAddress = toMintAddress;
//# sourceMappingURL=helpers.js.map
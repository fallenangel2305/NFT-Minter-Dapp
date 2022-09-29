"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSftWithToken = exports.assertSftWithToken = exports.isSftWithToken = exports.toSft = exports.assertSft = exports.isSft = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
/** @group Model Helpers */
const isSft = (value) => typeof value === 'object' && value.model === 'sft';
exports.isSft = isSft;
/** @group Model Helpers */
function assertSft(value) {
    (0, utils_1.assert)((0, exports.isSft)(value), `Expected Sft model`);
}
exports.assertSft = assertSft;
/** @group Model Helpers */
const toSft = (metadata, mint) => {
    const { address, mintAddress } = metadata, shared = __rest(metadata, ["address", "mintAddress"]);
    (0, utils_1.assert)(mintAddress.equals(mint.address), 'The provided mint does not match the mint address in the metadata');
    const currency = Object.assign(Object.assign({}, mint.currency), { symbol: metadata.symbol || 'Token' });
    return Object.assign(Object.assign({}, shared), { model: 'sft', address: mintAddress, metadataAddress: address, mint: Object.assign(Object.assign({}, mint), { currency, supply: (0, types_1.amount)(mint.supply.basisPoints, currency) }) });
};
exports.toSft = toSft;
/** @group Model Helpers */
const isSftWithToken = (value) => (0, exports.isSft)(value) && 'token' in value;
exports.isSftWithToken = isSftWithToken;
/** @group Model Helpers */
function assertSftWithToken(value) {
    (0, utils_1.assert)((0, exports.isSftWithToken)(value), `Expected Sft model with token`);
}
exports.assertSftWithToken = assertSftWithToken;
/** @group Model Helpers */
const toSftWithToken = (metadata, mint, token) => {
    const sft = (0, exports.toSft)(metadata, mint);
    const currency = sft.mint.currency;
    return Object.assign(Object.assign({}, sft), { token: Object.assign(Object.assign({}, token), { amount: (0, types_1.amount)(token.amount.basisPoints, currency), delegateAmount: (0, types_1.amount)(token.delegateAmount.basisPoints, currency) }) });
};
exports.toSftWithToken = toSftWithToken;
//# sourceMappingURL=Sft.js.map
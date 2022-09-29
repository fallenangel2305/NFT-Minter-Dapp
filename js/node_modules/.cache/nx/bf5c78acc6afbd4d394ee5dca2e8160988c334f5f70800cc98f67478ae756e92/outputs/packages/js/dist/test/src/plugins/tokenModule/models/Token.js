"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTokenWithMint = exports.assertTokenWithMint = exports.isTokenWithMint = exports.toToken = exports.assertToken = exports.isToken = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const pdas_1 = require("../pdas");
/** @group Model Helpers */
const isToken = (value) => typeof value === 'object' && value.model === 'token';
exports.isToken = isToken;
/** @group Model Helpers */
function assertToken(value) {
    (0, utils_1.assert)((0, exports.isToken)(value), `Expected Token model`);
}
exports.assertToken = assertToken;
/** @group Model Helpers */
const toToken = (account) => {
    const associatedTokenAddress = (0, pdas_1.findAssociatedTokenAccountPda)(account.data.mint, account.data.owner);
    const isAssociatedToken = associatedTokenAddress.equals(account.publicKey);
    return {
        model: 'token',
        address: isAssociatedToken ? associatedTokenAddress : account.publicKey,
        isAssociatedToken,
        mintAddress: account.data.mint,
        ownerAddress: account.data.owner,
        amount: (0, types_1.token)(account.data.amount.toString()),
        closeAuthorityAddress: account.data.closeAuthorityOption
            ? account.data.closeAuthority
            : null,
        delegateAddress: account.data.delegateOption ? account.data.delegate : null,
        delegateAmount: (0, types_1.token)(account.data.delegatedAmount.toString()),
        state: account.data.state,
    };
};
exports.toToken = toToken;
/** @group Model Helpers */
const isTokenWithMint = (value) => typeof value === 'object' && value.model === 'tokenWithMint';
exports.isTokenWithMint = isTokenWithMint;
/** @group Model Helpers */
function assertTokenWithMint(value) {
    (0, utils_1.assert)((0, exports.isTokenWithMint)(value), `Expected TokenWithMint model`);
}
exports.assertTokenWithMint = assertTokenWithMint;
/** @group Model Helpers */
const toTokenWithMint = (tokenAccount, mintModel) => {
    const token = (0, exports.toToken)(tokenAccount);
    return Object.assign(Object.assign({}, token), { model: 'tokenWithMint', mint: mintModel, amount: (0, types_1.amount)(token.amount.basisPoints, mintModel.currency), delegateAmount: (0, types_1.amount)(token.delegateAmount.basisPoints, mintModel.currency) });
};
exports.toTokenWithMint = toTokenWithMint;
//# sourceMappingURL=Token.js.map
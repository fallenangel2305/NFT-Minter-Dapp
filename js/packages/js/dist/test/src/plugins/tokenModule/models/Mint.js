"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMint = exports.assertMint = exports.isMint = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const constants_1 = require("../constants");
/** @group Model Helpers */
const isMint = (value) => typeof value === 'object' && value.model === 'mint';
exports.isMint = isMint;
/** @group Model Helpers */
function assertMint(value) {
    (0, utils_1.assert)((0, exports.isMint)(value), `Expected Mint model`);
}
exports.assertMint = assertMint;
/** @group Model Helpers */
const toMint = (account) => {
    const isWrappedSol = account.publicKey.equals(constants_1.WRAPPED_SOL_MINT);
    const currency = {
        symbol: isWrappedSol ? 'SOL' : 'Token',
        decimals: account.data.decimals,
        namespace: 'spl-token',
    };
    return {
        model: 'mint',
        address: account.publicKey,
        mintAuthorityAddress: account.data.mintAuthorityOption
            ? account.data.mintAuthority
            : null,
        freezeAuthorityAddress: account.data.freezeAuthorityOption
            ? account.data.freezeAuthority
            : null,
        decimals: account.data.decimals,
        supply: (0, types_1.amount)(account.data.supply.toString(), currency),
        isWrappedSol,
        currency,
    };
};
exports.toMint = toMint;
//# sourceMappingURL=Mint.js.map
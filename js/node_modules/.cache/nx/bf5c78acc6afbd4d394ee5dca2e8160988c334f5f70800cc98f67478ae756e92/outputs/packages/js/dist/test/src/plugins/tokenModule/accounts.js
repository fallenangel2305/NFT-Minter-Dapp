"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTokenAccount = exports.parseTokenAccount = exports.toMintAccount = exports.parseMintAccount = void 0;
const types_1 = require("../../types");
const spl_token_1 = require("@solana/spl-token");
const mintAccountParser = {
    name: 'MintAccount',
    deserialize: (data, offset) => {
        const span = spl_token_1.MintLayout.getSpan(data, offset);
        const decoded = spl_token_1.MintLayout.decode(data, offset);
        return [decoded, span];
    },
};
/** @group Account Helpers */
exports.parseMintAccount = (0, types_1.getAccountParsingFunction)(mintAccountParser);
/** @group Account Helpers */
exports.toMintAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mintAccountParser);
const tokenAccountParser = {
    name: 'TokenAccount',
    deserialize: (data, offset) => {
        const span = spl_token_1.AccountLayout.getSpan(data, offset);
        const decoded = spl_token_1.AccountLayout.decode(data, offset);
        return [decoded, span];
    },
};
/** @group Account Helpers */
exports.parseTokenAccount = (0, types_1.getAccountParsingFunction)(tokenAccountParser);
/** @group Account Helpers */
exports.toTokenAccount = (0, types_1.getAccountParsingAndAssertingFunction)(tokenAccountParser);
//# sourceMappingURL=accounts.js.map
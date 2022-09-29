"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenProgram = void 0;
const spl_token_1 = require("@solana/spl-token");
const gpaBuilders_1 = require("./gpaBuilders");
/** @group Programs */
exports.TokenProgram = {
    publicKey: spl_token_1.TOKEN_PROGRAM_ID,
    mintAccounts(metaplex) {
        return new gpaBuilders_1.MintGpaBuilder(metaplex, this.publicKey);
    },
    tokenAccounts(metaplex) {
        return new gpaBuilders_1.TokenGpaBuilder(metaplex, this.publicKey);
    },
};
//# sourceMappingURL=program.js.map
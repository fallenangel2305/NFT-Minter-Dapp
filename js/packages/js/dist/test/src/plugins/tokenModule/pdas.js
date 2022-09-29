"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAssociatedTokenAccountPda = void 0;
const types_1 = require("../../types");
const program_1 = require("./program");
const spl_token_1 = require("@solana/spl-token");
/** @group Pdas */
const findAssociatedTokenAccountPda = (mint, owner, tokenProgramId = program_1.TokenProgram.publicKey, associatedTokenProgramId = spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID) => {
    return types_1.Pda.find(associatedTokenProgramId, [
        owner.toBuffer(),
        tokenProgramId.toBuffer(),
        mint.toBuffer(),
    ]);
};
exports.findAssociatedTokenAccountPda = findAssociatedTokenAccountPda;
//# sourceMappingURL=pdas.js.map
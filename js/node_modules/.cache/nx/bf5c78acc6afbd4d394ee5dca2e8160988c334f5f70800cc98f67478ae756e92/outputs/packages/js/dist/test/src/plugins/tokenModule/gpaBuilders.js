"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGpaBuilder = exports.MintGpaBuilder = void 0;
const spl_token_1 = require("@solana/spl-token");
const utils_1 = require("../../utils");
/** @internal */
class MintGpaBuilder extends utils_1.GpaBuilder {
    constructor(metaplex, programId) {
        super(metaplex, programId !== null && programId !== void 0 ? programId : spl_token_1.TOKEN_PROGRAM_ID);
        this.whereSize(spl_token_1.MINT_SIZE);
    }
    whereDoesntHaveMintAuthority() {
        return this.where(0, 0);
    }
    whereHasMintAuthority() {
        return this.where(0, 1);
    }
    whereMintAuthority(mintAuthority) {
        return this.whereHasMintAuthority().where(4, mintAuthority);
    }
    whereSupply(supply) {
        return this.where(36, supply);
    }
}
exports.MintGpaBuilder = MintGpaBuilder;
/** @internal */
class TokenGpaBuilder extends utils_1.GpaBuilder {
    constructor(metaplex, programId) {
        super(metaplex, programId !== null && programId !== void 0 ? programId : spl_token_1.TOKEN_PROGRAM_ID);
        this.whereSize(spl_token_1.ACCOUNT_SIZE);
    }
    selectMint() {
        return this.slice(0, 32);
    }
    whereMint(mint) {
        return this.where(0, mint);
    }
    selectOwner() {
        return this.slice(32, 32);
    }
    whereOwner(owner) {
        return this.where(32, owner);
    }
    selectAmount() {
        return this.slice(64, 8);
    }
    whereAmount(amount) {
        return this.where(64, amount);
    }
    whereDoesntHaveDelegate() {
        return this.where(72, 0);
    }
    whereHasDelegate() {
        return this.where(72, 1);
    }
    whereDelegate(delegate) {
        return this.whereHasDelegate().where(76, delegate);
    }
}
exports.TokenGpaBuilder = TokenGpaBuilder;
//# sourceMappingURL=gpaBuilders.js.map
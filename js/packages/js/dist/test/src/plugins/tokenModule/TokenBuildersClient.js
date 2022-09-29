"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBuildersClient = void 0;
const operations_1 = require("./operations");
/**
 * This client allows you to access the underlying Transaction Builders
 * for the write operations of the Token module.
 *
 * @see {@link TokenClient}
 * @group Module Builders
 * */
class TokenBuildersClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    // -----------------
    // Create
    // -----------------
    /** {@inheritDoc createMintBuilder} */
    createMint(input) {
        return (0, operations_1.createMintBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc createTokenBuilder} */
    createToken(input) {
        return (0, operations_1.createTokenBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc createTokenIfMissingBuilder} @internal */
    createTokenIfMissing(input) {
        return (0, operations_1.createTokenIfMissingBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc createTokenWithMintBuilder} */
    createTokenWithMint(input) {
        return (0, operations_1.createTokenWithMintBuilder)(this.metaplex, input);
    }
    // -----------------
    // Update
    // -----------------
    /** {@inheritDoc mintTokensBuilder} */
    mint(input) {
        return (0, operations_1.mintTokensBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc sendTokensBuilder} */
    send(input) {
        return (0, operations_1.sendTokensBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc freezeTokensBuilder} */
    freeze(input) {
        return (0, operations_1.freezeTokensBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc thawTokensBuilder} */
    thaw(input) {
        return (0, operations_1.thawTokensBuilder)(this.metaplex, input);
    }
    // -----------------
    // Delegate
    // -----------------
    /** {@inheritDoc approveTokenDelegateAuthorityBuilder} */
    approveDelegateAuthority(input) {
        return (0, operations_1.approveTokenDelegateAuthorityBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc revokeTokenDelegateAuthorityBuilder} */
    revokeDelegateAuthority(input) {
        return (0, operations_1.revokeTokenDelegateAuthorityBuilder)(this.metaplex, input);
    }
}
exports.TokenBuildersClient = TokenBuildersClient;
//# sourceMappingURL=TokenBuildersClient.js.map
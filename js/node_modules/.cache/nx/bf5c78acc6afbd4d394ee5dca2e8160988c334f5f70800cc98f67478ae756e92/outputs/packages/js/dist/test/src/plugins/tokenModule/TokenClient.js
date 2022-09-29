"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenClient = void 0;
const operations_1 = require("./operations");
const TokenBuildersClient_1 = require("./TokenBuildersClient");
/**
 * This is a client for the Token module.
 *
 * It enables us to interact with the SPL Token program in order to
 * create, send, freeze, thaw, and mint tokens.
 *
 * You may access this client via the `tokens()` method of your `Metaplex` instance.
 *
 * ```ts
 * const tokenClient = metaplex.tokens();
 * ```
 *
 * @example
 * You can create a new mint account with an associated token account like so.
 * The owner of this token account will, by default, be the current identity
 * of the metaplex instance.
 *
 * ```ts
 * const { token } = await metaplex.tokens().createTokenWithMint().run();
 * ```
 *
 * @group Modules
 */
class TokenClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    /**
     * You may use the `builders()` client to access the
     * underlying Transaction Builders of this module.
     *
     * ```ts
     * const buildersClient = metaplex.tokens().builders();
     * ```
     */
    builders() {
        return new TokenBuildersClient_1.TokenBuildersClient(this.metaplex);
    }
    // -----------------
    // Queries
    // -----------------
    /** {@inheritDoc findMintByAddressOperation} */
    findMintByAddress(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findMintByAddressOperation)(input));
    }
    /** {@inheritDoc findTokenByAddressOperation} */
    findTokenByAddress(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findTokenByAddressOperation)(input));
    }
    /** {@inheritDoc findTokenWithMintByAddressOperation} */
    findTokenWithMintByAddress(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findTokenWithMintByAddressOperation)(input));
    }
    /** {@inheritDoc findTokenWithMintByMintOperation} */
    findTokenWithMintByMint(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findTokenWithMintByMintOperation)(input));
    }
    // -----------------
    // Create
    // -----------------
    /** {@inheritDoc createMintOperation} */
    createMint(input) {
        return this.metaplex.operations().getTask((0, operations_1.createMintOperation)(input !== null && input !== void 0 ? input : {}));
    }
    /**
     * Create a new Token account from the provided input
     * and returns the newly created `Token` model.
     */
    /** {@inheritDoc createTokenOperation} */
    createToken(input) {
        return this.metaplex.operations().getTask((0, operations_1.createTokenOperation)(input));
    }
    /** {@inheritDoc createTokenWithMintOperation} */
    createTokenWithMint(input = {}) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.createTokenWithMintOperation)(input));
    }
    // -----------------
    // Update
    // -----------------
    /** {@inheritDoc mintTokensOperation} */
    mint(input) {
        return this.metaplex.operations().getTask((0, operations_1.mintTokensOperation)(input));
    }
    /** {@inheritDoc sendTokensOperation} */
    send(input) {
        return this.metaplex.operations().getTask((0, operations_1.sendTokensOperation)(input));
    }
    /** {@inheritDoc freezeTokensOperation} */
    freeze(input) {
        return this.metaplex.operations().getTask((0, operations_1.freezeTokensOperation)(input));
    }
    /** {@inheritDoc thawTokensOperation} */
    thaw(input) {
        return this.metaplex.operations().getTask((0, operations_1.thawTokensOperation)(input));
    }
    // -----------------
    // Delegate
    // -----------------
    /** {@inheritDoc approveTokenDelegateAuthorityOperation} */
    approveDelegateAuthority(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.approveTokenDelegateAuthorityOperation)(input));
    }
    /** {@inheritDoc revokeTokenDelegateAuthorityOperation} */
    revokeDelegateAuthority(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.revokeTokenDelegateAuthorityOperation)(input));
    }
}
exports.TokenClient = TokenClient;
//# sourceMappingURL=TokenClient.js.map
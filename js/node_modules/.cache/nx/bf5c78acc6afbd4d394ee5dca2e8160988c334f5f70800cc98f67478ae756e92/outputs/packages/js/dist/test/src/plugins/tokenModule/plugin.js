"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenModule = void 0;
const spl_token_1 = require("@solana/spl-token");
const operations_1 = require("./operations");
const TokenClient_1 = require("./TokenClient");
/**
 * @group Plugins
 */
/** @group Plugins */
const tokenModule = () => ({
    install(metaplex) {
        // Program.
        metaplex.programs().register({
            name: 'TokenProgram',
            address: spl_token_1.TOKEN_PROGRAM_ID,
        });
        // Operations.
        const op = metaplex.operations();
        op.register(operations_1.approveTokenDelegateAuthorityOperation, operations_1.approveTokenDelegateAuthorityOperationHandler);
        op.register(operations_1.createMintOperation, operations_1.createMintOperationHandler);
        op.register(operations_1.createTokenOperation, operations_1.createTokenOperationHandler);
        op.register(operations_1.createTokenWithMintOperation, operations_1.createTokenWithMintOperationHandler);
        op.register(operations_1.findMintByAddressOperation, operations_1.findMintByAddressOperationHandler);
        op.register(operations_1.findTokenByAddressOperation, operations_1.findTokenByAddressOperationHandler);
        op.register(operations_1.findTokenWithMintByAddressOperation, operations_1.findTokenWithMintByAddressOperationHandler);
        op.register(operations_1.findTokenWithMintByMintOperation, operations_1.findTokenWithMintByMintOperationHandler);
        op.register(operations_1.freezeTokensOperation, operations_1.freezeTokensOperationHandler);
        op.register(operations_1.mintTokensOperation, operations_1.mintTokensOperationHandler);
        op.register(operations_1.revokeTokenDelegateAuthorityOperation, operations_1.revokeTokenDelegateAuthorityOperationHandler);
        op.register(operations_1.sendTokensOperation, operations_1.sendTokensOperationHandler);
        op.register(operations_1.thawTokensOperation, operations_1.thawTokensOperationHandler);
        metaplex.tokens = function () {
            return new TokenClient_1.TokenClient(this);
        };
    },
});
exports.tokenModule = tokenModule;
//# sourceMappingURL=plugin.js.map
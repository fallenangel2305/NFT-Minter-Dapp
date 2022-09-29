"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revokeTokenDelegateAuthorityBuilder = exports.revokeTokenDelegateAuthorityOperationHandler = exports.revokeTokenDelegateAuthorityOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const spl_token_1 = require("@solana/spl-token");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'RevokeTokenDelegateAuthorityOperation';
/**
 * Revokes the current delegate authority for a token account.
 *
 * ```ts
 * await metaplex
 *   .tokens()
 *   .revokeDelegateAuthority({ mintAddress })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.revokeTokenDelegateAuthorityOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.revokeTokenDelegateAuthorityOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.revokeTokenDelegateAuthorityBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Revokes the current delegate authority for a token account.
 *
 * ```ts
 * await metaplex
 *   .tokens()
 *   .builders()
 *   .revokeDelegateAuthority({ mintAddress });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const revokeTokenDelegateAuthorityBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, owner = metaplex.identity(), tokenAddress, multiSigners = [], tokenProgram = program_1.TokenProgram.publicKey, } = params;
    const [ownerPublicKey, signers] = (0, types_1.isSigner)(owner)
        ? [owner.publicKey, [owner]]
        : [owner, multiSigners];
    const tokenAccount = tokenAddress !== null && tokenAddress !== void 0 ? tokenAddress : (0, pdas_1.findAssociatedTokenAccountPda)(mintAddress, ownerPublicKey);
    return utils_1.TransactionBuilder.make().add({
        instruction: (0, spl_token_1.createRevokeInstruction)(tokenAccount, ownerPublicKey, multiSigners, tokenProgram),
        signers,
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'revokeDelegateAuthority',
    });
};
exports.revokeTokenDelegateAuthorityBuilder = revokeTokenDelegateAuthorityBuilder;
//# sourceMappingURL=revokeTokenDelegateAuthority.js.map
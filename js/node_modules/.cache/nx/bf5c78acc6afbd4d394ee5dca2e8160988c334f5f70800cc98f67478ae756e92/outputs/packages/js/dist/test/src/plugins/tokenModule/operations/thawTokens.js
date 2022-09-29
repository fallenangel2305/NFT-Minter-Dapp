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
exports.thawTokensBuilder = exports.thawTokensOperationHandler = exports.thawTokensOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const spl_token_1 = require("@solana/spl-token");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'ThawTokensOperation';
/**
 * Thaws a token account.
 *
 * ```ts
 * await metaplex.tokens().thaw({ mintAddress, freezeAuthority }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.thawTokensOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.thawTokensOperationHandler = {
    handle(operation, metaplex) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, exports.thawTokensBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Thaws a token account.
 *
 * ```ts
 * const transactionBuilder = metaplex.tokens().builders().thaw({ mintAddress, freezeAuthority });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const thawTokensBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, tokenOwner = metaplex.identity().publicKey, tokenAddress, multiSigners = [], freezeAuthority, tokenProgram = program_1.TokenProgram.publicKey, } = params;
    const [authorityPublicKey, signers] = (0, types_1.isSigner)(freezeAuthority)
        ? [freezeAuthority.publicKey, [freezeAuthority]]
        : [freezeAuthority, multiSigners];
    const tokenAddressOrAta = tokenAddress !== null && tokenAddress !== void 0 ? tokenAddress : (0, pdas_1.findAssociatedTokenAccountPda)(mintAddress, tokenOwner);
    return utils_1.TransactionBuilder.make().add({
        instruction: (0, spl_token_1.createThawAccountInstruction)(tokenAddressOrAta, mintAddress, authorityPublicKey, multiSigners, tokenProgram),
        signers,
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'thawTokens',
    });
};
exports.thawTokensBuilder = thawTokensBuilder;
//# sourceMappingURL=thawTokens.js.map
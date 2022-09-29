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
exports.mintTokensBuilder = exports.mintTokensOperationHandler = exports.mintTokensOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const spl_token_1 = require("@solana/spl-token");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'MintTokensOperation';
/**
 * Mint tokens to an account.
 *
 * ```ts
 * await metaplex
 *   .tokens()
 *   .mint({
 *     mintAddress,
 *     toOwner,
 *     amount: token(100),
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.mintTokensOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.mintTokensOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mintAddress, toOwner = metaplex.identity().publicKey, toToken, } = operation.input;
            const destination = toToken !== null && toToken !== void 0 ? toToken : (0, pdas_1.findAssociatedTokenAccountPda)(mintAddress, toOwner);
            const destinationAddress = (0, types_1.toPublicKey)(destination);
            const destinationAccountExists = yield metaplex
                .rpc()
                .accountExists(destinationAddress);
            scope.throwIfCanceled();
            const builder = yield (0, exports.mintTokensBuilder)(metaplex, Object.assign(Object.assign({}, operation.input), { toTokenExists: destinationAccountExists }));
            scope.throwIfCanceled();
            return builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Mint tokens to an account.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .tokens()
 *   .builders()
 *   .mint({
 *     mintAddress,
 *     toOwner,
 *     amount: token(100),
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const mintTokensBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { mintAddress, amount, toOwner = metaplex.identity().publicKey, toToken, toTokenExists = true, mintAuthority = metaplex.identity(), multiSigners = [], payer = metaplex.identity(), tokenProgram = program_1.TokenProgram.publicKey, } = params;
    const [mintAuthorityPublicKey, signers] = (0, types_1.isSigner)(mintAuthority)
        ? [mintAuthority.publicKey, [mintAuthority]]
        : [mintAuthority, multiSigners];
    const destination = toToken !== null && toToken !== void 0 ? toToken : (0, pdas_1.findAssociatedTokenAccountPda)(mintAddress, toOwner);
    return (utils_1.TransactionBuilder.make()
        // Create token account if missing.
        .add(yield metaplex
        .tokens()
        .builders()
        .createTokenIfMissing(Object.assign(Object.assign({}, params), { mint: mintAddress, owner: toOwner, token: toToken, tokenExists: toTokenExists, payer, tokenVariable: 'toToken' })))
        // Mint tokens.
        .add({
        instruction: (0, spl_token_1.createMintToInstruction)(mintAddress, (0, types_1.toPublicKey)(destination), mintAuthorityPublicKey, amount.basisPoints.toNumber(), multiSigners, tokenProgram),
        signers,
        key: (_a = params.mintTokensInstructionKey) !== null && _a !== void 0 ? _a : 'mintTokens',
    }));
});
exports.mintTokensBuilder = mintTokensBuilder;
//# sourceMappingURL=mintTokens.js.map
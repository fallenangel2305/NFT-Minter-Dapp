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
exports.sendTokensBuilder = exports.sendTokensOperationHandler = exports.sendTokensOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const spl_token_1 = require("@solana/spl-token");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'SendTokensOperation';
/**
 * Send tokens from one account to another.
 *
 * ```ts
 * await metaplex
 *   .tokens()
 *   .send({
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
exports.sendTokensOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.sendTokensOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mintAddress, toOwner = metaplex.identity().publicKey, toToken, } = operation.input;
            const destination = toToken !== null && toToken !== void 0 ? toToken : (0, pdas_1.findAssociatedTokenAccountPda)(mintAddress, toOwner);
            const destinationAddress = (0, types_1.toPublicKey)(destination);
            const destinationAccountExists = yield metaplex
                .rpc()
                .accountExists(destinationAddress);
            scope.throwIfCanceled();
            const builder = yield (0, exports.sendTokensBuilder)(metaplex, Object.assign(Object.assign({}, operation.input), { toTokenExists: destinationAccountExists }));
            scope.throwIfCanceled();
            return builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Send tokens from one account to another.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .tokens()
 *   .builders()
 *   .send({
 *     mintAddress,
 *     toOwner,
 *     amount: token(100),
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const sendTokensBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { mintAddress, amount, toOwner = metaplex.identity().publicKey, toToken, toTokenExists = true, fromOwner = metaplex.identity(), fromToken, fromMultiSigners = [], delegateAuthority, payer = metaplex.identity(), tokenProgram = program_1.TokenProgram.publicKey, } = params;
    const [fromOwnerPublicKey, signers] = (0, types_1.isSigner)(fromOwner)
        ? [fromOwner.publicKey, [fromOwner]]
        : [fromOwner, [delegateAuthority, ...fromMultiSigners].filter(types_1.isSigner)];
    const source = fromToken !== null && fromToken !== void 0 ? fromToken : (0, pdas_1.findAssociatedTokenAccountPda)(mintAddress, fromOwnerPublicKey);
    const destination = toToken !== null && toToken !== void 0 ? toToken : (0, pdas_1.findAssociatedTokenAccountPda)(mintAddress, toOwner);
    return (utils_1.TransactionBuilder.make()
        // Create token account if missing.
        .add(yield metaplex
        .tokens()
        .builders()
        .createTokenIfMissing(Object.assign(Object.assign({}, params), { mint: mintAddress, owner: toOwner, token: toToken, tokenExists: toTokenExists, payer, tokenVariable: 'toToken' })))
        // Transfer tokens.
        .add({
        instruction: (0, spl_token_1.createTransferInstruction)(source, (0, types_1.toPublicKey)(destination), delegateAuthority ? delegateAuthority.publicKey : fromOwnerPublicKey, amount.basisPoints.toNumber(), fromMultiSigners, tokenProgram),
        signers,
        key: (_a = params.transferTokensInstructionKey) !== null && _a !== void 0 ? _a : 'transferTokens',
    }));
});
exports.sendTokensBuilder = sendTokensBuilder;
//# sourceMappingURL=sendTokens.js.map
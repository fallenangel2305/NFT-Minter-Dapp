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
exports.createTokenIfMissingBuilder = exports.createTokenBuilder = exports.createTokenOperationHandler = exports.createTokenOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const spl_token_1 = require("@solana/spl-token");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'CreateTokenOperation';
/**
 * Creates a new token account.
 *
 * ```ts
 * const { token } = await metaplex.tokens().createToken({ mint }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createTokenOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createTokenOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = yield (0, exports.createTokenBuilder)(metaplex, operation.input);
            scope.throwIfCanceled();
            const output = yield builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
            scope.throwIfCanceled();
            const token = yield metaplex
                .tokens()
                .findTokenByAddress({ address: output.tokenAddress })
                .run(scope);
            return Object.assign(Object.assign({}, output), { token });
        });
    },
};
/**
 * Creates a new token account.
 *
 * ```ts
 * const transactionBuilder = await metaplex.tokens().builders().createToken({ mint });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createTokenBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { mint, owner = metaplex.identity().publicKey, token, payer = metaplex.identity(), tokenProgram = program_1.TokenProgram.publicKey, associatedTokenProgram = spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, } = params;
    const isAssociatedToken = token === undefined;
    const builder = utils_1.TransactionBuilder.make().setFeePayer(payer);
    if (isAssociatedToken) {
        const associatedTokenAddress = (0, pdas_1.findAssociatedTokenAccountPda)(mint, owner, tokenProgram, associatedTokenProgram);
        return (builder
            .setContext({ tokenAddress: associatedTokenAddress })
            // Create an associated token account.
            .add({
            instruction: (0, spl_token_1.createAssociatedTokenAccountInstruction)(payer.publicKey, associatedTokenAddress, owner, mint, tokenProgram, associatedTokenProgram),
            signers: [payer],
            key: (_a = params.createAssociatedTokenAccountInstructionKey) !== null && _a !== void 0 ? _a : 'createAssociatedTokenAccount',
        }));
    }
    return (builder
        .setFeePayer(payer)
        .setContext({ tokenAddress: token.publicKey })
        // Create an empty account for the Token.
        .add(yield metaplex
        .system()
        .builders()
        .createAccount({
        payer,
        newAccount: token,
        space: spl_token_1.ACCOUNT_SIZE,
        program: tokenProgram,
        instructionKey: (_b = params.createAccountInstructionKey) !== null && _b !== void 0 ? _b : 'createAccount',
    }))
        // Initialize the Token.
        .add({
        instruction: (0, spl_token_1.createInitializeAccountInstruction)(token.publicKey, mint, owner, tokenProgram),
        signers: [token],
        key: (_c = params.initializeTokenInstructionKey) !== null && _c !== void 0 ? _c : 'initializeToken',
    }));
});
exports.createTokenBuilder = createTokenBuilder;
/**
 * @group Transaction Builders
 * @category Constructors
 * @internal
 */
const createTokenIfMissingBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { mint, owner = metaplex.identity().publicKey, token, tokenExists = true, payer = metaplex.identity(), tokenVariable = 'token', } = params;
    const destination = token !== null && token !== void 0 ? token : (0, pdas_1.findAssociatedTokenAccountPda)(mint, owner);
    const destinationAddress = (0, types_1.toPublicKey)(destination);
    const builder = utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({ tokenAddress: destinationAddress });
    if (tokenExists) {
        return builder;
    }
    // When creating a token account, ensure it is passed as a Signer.
    if (token && !(0, types_1.isSigner)(token)) {
        throw new errors_1.ExpectedSignerError(tokenVariable, 'PublicKey', {
            problemSuffix: `The provided "${tokenVariable}" account ` +
                `at address [${destinationAddress}] does not exist. ` +
                `Therefore, it needs to be created and passed as a Signer.`,
            solution: `If you want to create the "${tokenVariable}" account, then please pass it as a Signer. ` +
                `Alternatively, you can pass the owner account as a PublicKey instead to ` +
                `use (or create) an associated token account.`,
        });
    }
    return builder.add(yield metaplex
        .tokens()
        .builders()
        .createToken(Object.assign(Object.assign({}, params), { mint,
        owner,
        token,
        payer })));
});
exports.createTokenIfMissingBuilder = createTokenIfMissingBuilder;
//# sourceMappingURL=createToken.js.map
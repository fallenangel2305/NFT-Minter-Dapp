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
exports.createTokenWithMintBuilder = exports.createTokenWithMintOperationHandler = exports.createTokenWithMintOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const web3_js_1 = require("@solana/web3.js");
const errors_1 = require("../errors");
// -----------------
// Operation
// -----------------
const Key = 'CreateTokenWithMintOperation';
/**
 * Creates both mint and token accounts in the same transaction.
 *
 * ```ts
 * const { token } = await metaplex.tokens().createTokenWithMint().run();
 * const mint = token.mint;
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createTokenWithMintOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createTokenWithMintOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = yield (0, exports.createTokenWithMintBuilder)(metaplex, operation.input);
            scope.throwIfCanceled();
            const output = yield builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
            scope.throwIfCanceled();
            const token = yield metaplex
                .tokens()
                .findTokenWithMintByMint({
                mint: output.mintSigner.publicKey,
                address: output.tokenAddress,
                addressType: 'token',
            })
                .run(scope);
            return Object.assign(Object.assign({}, output), { token });
        });
    },
};
/**
 * Creates both mint and token accounts in the same transaction.
 *
 * ```ts
 * const transactionBuilder = await metaplex.tokens().builders().createTokenWithMint();
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createTokenWithMintBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { decimals = 0, initialSupply, mint = web3_js_1.Keypair.generate(), mintAuthority = metaplex.identity(), freezeAuthority = metaplex.identity().publicKey, owner = metaplex.identity().publicKey, token, payer = metaplex.identity(), tokenProgram, associatedTokenProgram, } = params;
    const createMintBuilder = yield metaplex
        .tokens()
        .builders()
        .createMint({
        decimals,
        mint,
        payer,
        mintAuthority: (0, types_1.toPublicKey)(mintAuthority),
        freezeAuthority,
        tokenProgram,
        createAccountInstructionKey: (_a = params.createMintAccountInstructionKey) !== null && _a !== void 0 ? _a : 'createMintAccount',
        initializeMintInstructionKey: (_b = params.initializeMintInstructionKey) !== null && _b !== void 0 ? _b : 'initializeMint',
    });
    const createTokenBuilder = yield metaplex
        .tokens()
        .builders()
        .createToken({
        mint: mint.publicKey,
        owner,
        token,
        payer,
        tokenProgram,
        associatedTokenProgram,
        createAssociatedTokenAccountInstructionKey: (_c = params.createAssociatedTokenAccountInstructionKey) !== null && _c !== void 0 ? _c : 'createAssociatedTokenAccount',
        createAccountInstructionKey: (_d = params.createTokenAccountInstructionKey) !== null && _d !== void 0 ? _d : 'createTokenAccount',
        initializeTokenInstructionKey: (_e = params.initializeTokenInstructionKey) !== null && _e !== void 0 ? _e : 'initializeToken',
    });
    const { tokenAddress } = createTokenBuilder.getContext();
    const builder = utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({ mintSigner: mint, tokenAddress })
        // Create the Mint account.
        .add(createMintBuilder)
        // Create the Token account.
        .add(createTokenBuilder);
    // Potentially mint the initial supply to the token account.
    if (!!initialSupply) {
        if (!(0, types_1.isSigner)(mintAuthority)) {
            throw new errors_1.MintAuthorityMustBeSignerToMintInitialSupplyError();
        }
        builder.add(yield metaplex
            .tokens()
            .builders()
            .mint({
            mintAddress: mint.publicKey,
            toToken: tokenAddress,
            amount: initialSupply,
            mintAuthority,
            tokenProgram,
            mintTokensInstructionKey: (_f = params.mintTokensInstructionKey) !== null && _f !== void 0 ? _f : 'mintTokens',
        }));
    }
    return builder;
});
exports.createTokenWithMintBuilder = createTokenWithMintBuilder;
//# sourceMappingURL=createTokenWithMint.js.map
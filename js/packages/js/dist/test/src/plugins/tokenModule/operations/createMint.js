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
exports.createMintBuilder = exports.createMintOperationHandler = exports.createMintOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'CreateMintOperation';
/**
 * Creates a new mint account.
 *
 * ```ts
 * const { mint } = await metaplex.tokens().createMint().run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createMintOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createMintOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = yield (0, exports.createMintBuilder)(metaplex, operation.input);
            scope.throwIfCanceled();
            const output = yield builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
            scope.throwIfCanceled();
            const mint = yield metaplex
                .tokens()
                .findMintByAddress({ address: output.mintSigner.publicKey })
                .run(scope);
            return Object.assign(Object.assign({}, output), { mint });
        });
    },
};
/**
 * Creates a new mint account.
 *
 * ```ts
 * const transactionBuilder = await metaplex.tokens().builders().createMint();
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createMintBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { decimals = 0, mint = web3_js_1.Keypair.generate(), payer = metaplex.identity(), mintAuthority = metaplex.identity().publicKey, freezeAuthority = mintAuthority, tokenProgram = program_1.TokenProgram.publicKey, } = params;
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({ mintSigner: mint })
        // Create an empty account for the mint.
        .add(yield metaplex
        .system()
        .builders()
        .createAccount({
        payer,
        newAccount: mint,
        space: spl_token_1.MINT_SIZE,
        program: tokenProgram,
        instructionKey: (_a = params.createAccountInstructionKey) !== null && _a !== void 0 ? _a : 'createAccount',
    }))
        // Initialize the mint.
        .add({
        instruction: (0, spl_token_1.createInitializeMintInstruction)(mint.publicKey, decimals, mintAuthority, freezeAuthority, tokenProgram),
        signers: [mint],
        key: (_b = params.initializeMintInstructionKey) !== null && _b !== void 0 ? _b : 'initializeMint',
    }));
});
exports.createMintBuilder = createMintBuilder;
//# sourceMappingURL=createMint.js.map
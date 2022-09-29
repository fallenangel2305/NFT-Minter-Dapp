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
exports.createAccountBuilder = exports.createAccountOperationHandler = exports.createAccountOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
// -----------------
// Operation
// -----------------
const Key = 'CreateAccountOperation';
/**
 * Creates a new uninitialized Solana account.
 *
 * ```ts
 * const { newAccount } = await metaplex
 *   .system()
 *   .createAccount({ space: 100 }) // 100 bytes
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createAccountOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createAccountOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = yield (0, exports.createAccountBuilder)(metaplex, operation.input);
            scope.throwIfCanceled();
            return builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Creates a new uninitialized Solana account.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .system()
 *   .builders()
 *   .createAccount({ space: 100 }); // 100 bytes
 * ```
 *
 * Note that accessing this transaction builder is asynchronous
 * because we may need to contact the cluster to get the
 * rent-exemption for the provided space.
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createAccountBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { space, payer = metaplex.identity(), newAccount = web3_js_1.Keypair.generate(), program = web3_js_1.SystemProgram.programId, } = params;
    const lamports = (_a = params.lamports) !== null && _a !== void 0 ? _a : (yield metaplex.rpc().getRent(space));
    (0, types_1.assertSol)(lamports);
    return utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        newAccount,
        lamports,
    })
        .add({
        instruction: web3_js_1.SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: newAccount.publicKey,
            space,
            lamports: lamports.basisPoints.toNumber(),
            programId: program,
        }),
        signers: [payer, newAccount],
        key: (_b = params.instructionKey) !== null && _b !== void 0 ? _b : 'createAccount',
    });
});
exports.createAccountBuilder = createAccountBuilder;
//# sourceMappingURL=createAccount.js.map
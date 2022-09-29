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
exports.transferSolBuilder = exports.transferSolOperationHandler = exports.transferSolOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
// -----------------
// Operation
// -----------------
const Key = 'TransferSolOperation';
/**
 * Transfers some SOL from one account to another.
 *
 * ```ts
 * await metaplex
 *   .system()
 *   .transferSol({
 *     to: new PublicKey("..."),
 *     amount: sol(1.5),
 *   })
 *   .run();
 * ````
 *
 * @group Operations
 * @category Constructors
 */
exports.transferSolOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.transferSolOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = (0, exports.transferSolBuilder)(metaplex, operation.input);
            return builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Transfers some SOL from one account to another.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .system()
 *   .builders()
 *   .transferSol({
 *     to: new PublicKey("..."),
 *     amount: sol(1.5),
 *   });
 * ````
 *
 * @group Transaction Builders
 * @category Constructors
 */
const transferSolBuilder = (metaplex, params) => {
    var _a;
    const { from = metaplex.identity(), to, amount, basePubkey, seed, program = web3_js_1.SystemProgram.programId, } = params;
    (0, types_1.assertSol)(amount);
    return utils_1.TransactionBuilder.make().add({
        instruction: web3_js_1.SystemProgram.transfer(Object.assign(Object.assign({ fromPubkey: from.publicKey, toPubkey: to, lamports: amount.basisPoints.toNumber() }, (basePubkey ? { basePubkey, seed } : {})), { programId: program })),
        signers: [from],
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'transferSol',
    });
};
exports.transferSolBuilder = transferSolBuilder;
//# sourceMappingURL=transferSol.js.map
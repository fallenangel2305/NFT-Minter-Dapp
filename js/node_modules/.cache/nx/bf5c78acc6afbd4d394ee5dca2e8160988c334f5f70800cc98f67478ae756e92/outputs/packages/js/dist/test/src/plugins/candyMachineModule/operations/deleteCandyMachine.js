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
exports.deleteCandyMachineBuilder = exports.deleteCandyMachineOperationHandler = exports.deleteCandyMachineOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'DeleteCandyMachineOperation';
/**
 * Deletes an existing Candy Machine.
 *
 * ```ts
 * await metaplex.candyMachines().delete({ candyMachine }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.deleteCandyMachineOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.deleteCandyMachineOperationHandler = {
    handle(operation, metaplex) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, exports.deleteCandyMachineBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Deletes an existing Candy Machine.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .candyMachines()
 *   .builders()
 *   .delete({
 *     candyMachine: { address, collectionMintAddress },
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const deleteCandyMachineBuilder = (metaplex, params) => {
    var _a, _b;
    const authority = (_a = params.authority) !== null && _a !== void 0 ? _a : metaplex.identity();
    const candyMachine = params.candyMachine;
    const deleteInstruction = (0, mpl_candy_machine_1.createWithdrawFundsInstruction)({
        candyMachine: candyMachine.address,
        authority: authority.publicKey,
    });
    if (candyMachine.collectionMintAddress) {
        const collectionPda = (0, pdas_1.findCandyMachineCollectionPda)(candyMachine.address);
        deleteInstruction.keys.push({
            pubkey: collectionPda,
            isWritable: true,
            isSigner: false,
        });
    }
    return (utils_1.TransactionBuilder.make()
        // This is important because, otherwise, the authority will not be identitied
        // as a mutable account and debitting it will cause an error.
        .setFeePayer(authority)
        .add({
        instruction: deleteInstruction,
        signers: [authority],
        key: (_b = params.instructionKey) !== null && _b !== void 0 ? _b : 'withdrawFunds',
    }));
};
exports.deleteCandyMachineBuilder = deleteCandyMachineBuilder;
//# sourceMappingURL=deleteCandyMachine.js.map
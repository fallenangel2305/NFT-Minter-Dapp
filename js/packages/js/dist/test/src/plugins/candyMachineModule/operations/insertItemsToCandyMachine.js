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
exports.insertItemsToCandyMachineBuilder = exports.InsertItemsToCandyMachineOperationHandler = exports.insertItemsToCandyMachineOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const asserts_1 = require("../asserts");
// -----------------
// Operation
// -----------------
const Key = 'InsertItemsToCandyMachineOperation';
/**
 * Insert items into an existing Candy Machine.
 *
 * ```ts
 * await metaplex
 *   .candyMachines()
 *   .insertItems({
 *     candyMachine,
 *     items: [
 *       { name: 'My NFT #1', uri: 'https://example.com/nft1' },
 *       { name: 'My NFT #2', uri: 'https://example.com/nft2' },
 *       { name: 'My NFT #3', uri: 'https://example.com/nft3' },
 *     ],
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.insertItemsToCandyMachineOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.InsertItemsToCandyMachineOperationHandler = {
    handle(operation, metaplex) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, exports.insertItemsToCandyMachineBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Insert items into an existing Candy Machine.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .candyMachines()
 *   .builders()
 *   .insertItems({ candyMachine, items });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const insertItemsToCandyMachineBuilder = (metaplex, params) => {
    var _a, _b, _c;
    const authority = (_a = params.authority) !== null && _a !== void 0 ? _a : metaplex.identity();
    const index = (_b = params.index) !== null && _b !== void 0 ? _b : params.candyMachine.itemsLoaded;
    const items = params.items;
    (0, asserts_1.assertNotFull)(params.candyMachine, index);
    (0, asserts_1.assertCanAdd)(params.candyMachine, index, items.length);
    (0, asserts_1.assertAllConfigLineConstraints)(items);
    return utils_1.TransactionBuilder.make().add({
        instruction: (0, mpl_candy_machine_1.createAddConfigLinesInstruction)({
            candyMachine: params.candyMachine.address,
            authority: authority.publicKey,
        }, { index: index.toNumber(), configLines: items }),
        signers: [authority],
        key: (_c = params.instructionKey) !== null && _c !== void 0 ? _c : 'insertItems',
    });
};
exports.insertItemsToCandyMachineBuilder = insertItemsToCandyMachineBuilder;
//# sourceMappingURL=insertItemsToCandyMachine.js.map
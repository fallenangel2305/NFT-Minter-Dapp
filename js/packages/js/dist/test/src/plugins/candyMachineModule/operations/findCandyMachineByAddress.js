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
exports.findCandyMachineByAddressOperationHandler = exports.findCandyMachineByAddressOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const CandyMachine_1 = require("../models/CandyMachine");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'FindCandyMachineByAddressOperation';
/**
 * Find an existing Candy Machine by its address.
 *
 * ```ts
 * const candyMachine = await metaplex.candyMachines().findbyAddress({ address }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findCandyMachineByAddressOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findCandyMachineByAddressOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const { address, commitment } = operation.input;
        const collectionPda = (0, pdas_1.findCandyMachineCollectionPda)(address);
        const accounts = yield metaplex
            .rpc()
            .getMultipleAccounts([address, collectionPda], commitment);
        const unparsedAccount = accounts[0];
        (0, types_1.assertAccountExists)(unparsedAccount);
        const account = (0, accounts_1.toCandyMachineAccount)(unparsedAccount);
        const collectionAccount = (0, accounts_1.parseCandyMachineCollectionAccount)(accounts[1]);
        const mint = account.data.tokenMint
            ? yield metaplex
                .tokens()
                .findMintByAddress({ address: account.data.tokenMint })
                .run()
            : null;
        return (0, CandyMachine_1.toCandyMachine)(account, unparsedAccount, collectionAccount, mint);
    }),
};
//# sourceMappingURL=findCandyMachineByAddress.js.map
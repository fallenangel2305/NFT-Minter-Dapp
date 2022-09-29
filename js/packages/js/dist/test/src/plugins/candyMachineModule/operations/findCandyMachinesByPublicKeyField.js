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
exports.findCandyMachinesByPublicKeyFieldOperationHandler = exports.findCandyMachinesByPublicKeyFieldOperation = void 0;
const errors_1 = require("../../../errors");
const tokenModule_1 = require("../../../plugins/tokenModule");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("../accounts");
const CandyMachine_1 = require("../models/CandyMachine");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'FindCandyMachinesByPublicKeyOperation';
/**
 * Find all Candy Machines matching by a given `publicKey` or a given `type`.
 *
 * The following two types are supported.
 *
 * `authority`: Find Candy Machines whose authority is the given `publicKey`.
 * ```ts
 * const someAuthority = new PublicKey('...');
 * const candyMachines = await metaplex
 *   .candyMachines()
 *   .findAllBy({ type: 'authority', someAuthority });
 *   .run();
 * ```
 *
 * `wallet`: Find Candy Machines whose wallet address is the given `publicKey`.
 * ```ts
 * const someWallet = new PublicKey('...');
 * const candyMachines = await metaplex
 *   .candyMachines()
 *   .findAllBy({ type: 'wallet', someWallet });
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findCandyMachinesByPublicKeyFieldOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findCandyMachinesByPublicKeyFieldOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { type, publicKey, commitment } = operation.input;
        const accounts = program_1.CandyMachineProgram.accounts(metaplex).mergeConfig({
            commitment,
        });
        let candyMachineQuery;
        switch (type) {
            case 'authority':
                candyMachineQuery =
                    accounts.candyMachineAccountsForAuthority(publicKey);
                break;
            case 'wallet':
                candyMachineQuery = accounts.candyMachineAccountsForWallet(publicKey);
                break;
            default:
                throw new errors_1.UnreachableCaseError(type);
        }
        const unparsedAccounts = yield candyMachineQuery.get();
        scope.throwIfCanceled();
        const collectionPdas = unparsedAccounts.map((unparsedAccount) => (0, pdas_1.findCandyMachineCollectionPda)(unparsedAccount.publicKey));
        // Find mint details for all unique SPL tokens used
        // in candy machines that have non-null `tokenMint`
        const parsedAccounts = Object.fromEntries(unparsedAccounts.map((unparsedAccount) => [
            unparsedAccount.publicKey.toString(),
            (0, accounts_1.parseCandyMachineAccount)(unparsedAccount),
        ]));
        const tokenMints = [
            ...new Set(Object.values(parsedAccounts)
                .map((account) => { var _a; return (_a = account.data.tokenMint) === null || _a === void 0 ? void 0 : _a.toString(); })
                .filter((tokenMint) => tokenMint !== undefined)),
        ].map((address) => new web3_js_1.PublicKey(address));
        const result = yield metaplex
            .rpc()
            .getMultipleAccounts(tokenMints.concat(collectionPdas), commitment);
        scope.throwIfCanceled();
        const unparsedMintAccounts = result.slice(0, tokenMints.length);
        const unparsedCollectionAccounts = result.slice(-collectionPdas.length);
        const mints = Object.fromEntries(unparsedMintAccounts.map((account) => [
            account.publicKey.toString(),
            (0, tokenModule_1.toMint)((0, tokenModule_1.toMintAccount)(account)),
        ]));
        return (0, utils_1.zipMap)(unparsedAccounts, unparsedCollectionAccounts, (unparsedAccount, unparsedCollectionAccount) => {
            var _a;
            const parsedAccount = parsedAccounts[unparsedAccount.publicKey.toString()];
            const collectionAccount = unparsedCollectionAccount
                ? (0, accounts_1.parseCandyMachineCollectionAccount)(unparsedCollectionAccount)
                : null;
            const tokenMintAddress = (_a = parsedAccount.data.tokenMint) === null || _a === void 0 ? void 0 : _a.toString();
            return (0, CandyMachine_1.toCandyMachine)(parsedAccount, unparsedAccount, collectionAccount, tokenMintAddress ? mints[tokenMintAddress] : null);
        });
    }),
};
//# sourceMappingURL=findCandyMachinesByPublicKeyField.js.map
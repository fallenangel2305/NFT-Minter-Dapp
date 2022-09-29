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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCandyMachineBuilder = exports.updateCandyMachineOperationHandler = exports.updateCandyMachineOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const nftModule_1 = require("../../nftModule");
const CandyMachine_1 = require("../models/CandyMachine");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'UpdateCandyMachineOperation';
/**
 * Updates an existing Candy Machine.
 *
 * ```ts
 * await metaplex
 *   .candyMachines()
 *   .update({
 *     candyMachine,
 *     price: sol(2), // Updates the price only.
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.updateCandyMachineOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.updateCandyMachineOperationHandler = {
    handle(operation, metaplex) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = operation.input, { candyMachine, authority = metaplex.identity(), payer = metaplex.identity(), newAuthority, newCollection, confirmOptions } = _a, updatableFields = __rest(_a, ["candyMachine", "authority", "payer", "newAuthority", "newCollection", "confirmOptions"]);
            const currentConfigs = (0, CandyMachine_1.toCandyMachineConfigs)(candyMachine);
            const instructionDataWithoutChanges = (0, CandyMachine_1.toCandyMachineInstructionData)(candyMachine.address, currentConfigs);
            const instructionData = (0, CandyMachine_1.toCandyMachineInstructionData)(candyMachine.address, Object.assign(Object.assign({}, currentConfigs), updatableFields));
            const { data, wallet, tokenMint } = instructionData;
            const shouldUpdateData = !(0, lodash_isequal_1.default)(instructionData, instructionDataWithoutChanges);
            const builder = (0, exports.updateCandyMachineBuilder)(metaplex, {
                candyMachine,
                authority,
                payer,
                newData: shouldUpdateData ? Object.assign(Object.assign({}, data), { wallet, tokenMint }) : undefined,
                newCollection,
                newAuthority,
            });
            if (builder.isEmpty()) {
                throw new errors_1.NoInstructionsToSendError(Key);
            }
            return builder.sendAndConfirm(metaplex, confirmOptions);
        });
    },
};
/**
 * Updates an existing Candy Machine.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .candyMachines()
 *   .builders()
 *   .update({
 *     candyMachine: { address, walletAddress, collectionMintAddress },
 *     newData: {...}, // Updates the provided data.
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const updateCandyMachineBuilder = (metaplex, params) => {
    const { candyMachine, authority = metaplex.identity(), payer = metaplex.identity(), newData, newAuthority, newCollection, } = params;
    const shouldUpdateAuthority = !!newAuthority && !newAuthority.equals(authority.publicKey);
    const sameCollection = newCollection &&
        candyMachine.collectionMintAddress &&
        candyMachine.collectionMintAddress.equals(newCollection);
    const shouldUpdateCollection = !!newCollection && !sameCollection;
    const shouldRemoveCollection = !shouldUpdateCollection &&
        newCollection === null &&
        candyMachine.collectionMintAddress !== null;
    return (utils_1.TransactionBuilder.make()
        // Update data.
        .when(!!newData, (builder) => {
        var _a;
        const data = newData;
        const wallet = newData === null || newData === void 0 ? void 0 : newData.wallet;
        const tokenMint = newData === null || newData === void 0 ? void 0 : newData.tokenMint;
        const updateInstruction = (0, mpl_candy_machine_1.createUpdateCandyMachineInstruction)({
            candyMachine: candyMachine.address,
            authority: authority.publicKey,
            wallet,
        }, { data });
        if (tokenMint) {
            updateInstruction.keys.push({
                pubkey: tokenMint,
                isWritable: false,
                isSigner: false,
            });
        }
        return builder.add({
            instruction: updateInstruction,
            signers: [authority],
            key: (_a = params.updateInstructionKey) !== null && _a !== void 0 ? _a : 'update',
        });
    })
        // Set or update collection.
        .when(shouldUpdateCollection, (builder) => {
        var _a;
        const collectionMint = newCollection;
        const metadata = (0, nftModule_1.findMetadataPda)(collectionMint);
        const edition = (0, nftModule_1.findMasterEditionV2Pda)(collectionMint);
        const collectionPda = (0, pdas_1.findCandyMachineCollectionPda)(candyMachine.address);
        const collectionAuthorityRecord = (0, nftModule_1.findCollectionAuthorityRecordPda)(collectionMint, collectionPda);
        return builder.add({
            instruction: (0, mpl_candy_machine_1.createSetCollectionInstruction)({
                candyMachine: candyMachine.address,
                authority: authority.publicKey,
                collectionPda,
                payer: payer.publicKey,
                metadata,
                mint: collectionMint,
                edition,
                collectionAuthorityRecord,
                tokenMetadataProgram: nftModule_1.TokenMetadataProgram.publicKey,
            }),
            signers: [payer, authority],
            key: (_a = params.setCollectionInstructionKey) !== null && _a !== void 0 ? _a : 'setCollection',
        });
    })
        // Remove collection.
        .when(shouldRemoveCollection, (builder) => {
        var _a;
        const collectionMint = candyMachine.collectionMintAddress;
        const metadata = (0, nftModule_1.findMetadataPda)(collectionMint);
        const collectionPda = (0, pdas_1.findCandyMachineCollectionPda)(candyMachine.address);
        const collectionAuthorityRecord = (0, nftModule_1.findCollectionAuthorityRecordPda)(collectionMint, collectionPda);
        return builder.add({
            instruction: (0, mpl_candy_machine_1.createRemoveCollectionInstruction)({
                candyMachine: candyMachine.address,
                authority: authority.publicKey,
                collectionPda,
                metadata,
                mint: collectionMint,
                collectionAuthorityRecord,
                tokenMetadataProgram: nftModule_1.TokenMetadataProgram.publicKey,
            }),
            signers: [authority],
            key: (_a = params.removeCollectionInstructionKey) !== null && _a !== void 0 ? _a : 'removeCollection',
        });
    })
        // Update authority.
        .when(shouldUpdateAuthority, (builder) => {
        var _a, _b;
        return builder.add({
            instruction: (0, mpl_candy_machine_1.createUpdateAuthorityInstruction)({
                candyMachine: candyMachine.address,
                authority: authority.publicKey,
                wallet: (_a = newData === null || newData === void 0 ? void 0 : newData.wallet) !== null && _a !== void 0 ? _a : candyMachine.walletAddress,
            }, { newAuthority: newAuthority }),
            signers: [authority],
            key: (_b = params.updateAuthorityInstructionKey) !== null && _b !== void 0 ? _b : 'updateAuthority',
        });
    }));
};
exports.updateCandyMachineBuilder = updateCandyMachineBuilder;
//# sourceMappingURL=updateCandyMachine.js.map
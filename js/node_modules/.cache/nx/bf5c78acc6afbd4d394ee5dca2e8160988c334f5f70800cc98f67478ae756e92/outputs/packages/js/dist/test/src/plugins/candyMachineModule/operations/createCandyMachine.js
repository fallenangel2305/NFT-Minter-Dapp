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
exports.createCandyMachineBuilder = exports.createCandyMachineOperationHandler = exports.createCandyMachineOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const web3_js_1 = require("@solana/web3.js");
const nftModule_1 = require("../../nftModule");
const CandyMachine_1 = require("../models/CandyMachine");
const errors_1 = require("../../../errors");
const helpers_1 = require("../helpers");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'CreateCandyMachineOperation';
/**
 * Creates a brand new Candy Machine.
 *
 * ```ts
 * const { candyMachine } = await metaplex
 *   .candyMachines()
 *   .create({
 *     sellerFeeBasisPoints: 500, // 5% royalties
 *     price: sol(1.3), // 1.3 SOL
 *     itemsAvailable: toBigNumber(1000), // 1000 items available
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createCandyMachineOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createCandyMachineOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const builder = yield (0, exports.createCandyMachineBuilder)(metaplex, operation.input);
            scope.throwIfCanceled();
            const output = yield builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
            scope.throwIfCanceled();
            const candyMachine = yield metaplex
                .candyMachines()
                .findByAddress({ address: output.candyMachineSigner.publicKey })
                .run(scope);
            return Object.assign(Object.assign({}, output), { candyMachine });
        });
    },
};
/**
 * Creates a brand new Candy Machine.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .candyMachines()
 *   .builders()
 *   .create({
 *     sellerFeeBasisPoints: 500, // 5% royalties
 *     price: sol(1.3), // 1.3 SOL
 *     itemsAvailable: toBigNumber(1000), // 1000 items available
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createCandyMachineBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    const candyMachine = (_a = params.candyMachine) !== null && _a !== void 0 ? _a : web3_js_1.Keypair.generate();
    const payer = (_b = params.payer) !== null && _b !== void 0 ? _b : metaplex.identity();
    const authority = (_c = params.authority) !== null && _c !== void 0 ? _c : metaplex.identity();
    const collection = (_d = params.collection) !== null && _d !== void 0 ? _d : null;
    const { data, wallet, tokenMint } = (0, CandyMachine_1.toCandyMachineInstructionData)(candyMachine.publicKey, Object.assign(Object.assign({}, params), { wallet: (_e = params.wallet) !== null && _e !== void 0 ? _e : metaplex.identity().publicKey, tokenMint: (_f = params.tokenMint) !== null && _f !== void 0 ? _f : null, symbol: (_g = params.symbol) !== null && _g !== void 0 ? _g : '', maxEditionSupply: (_h = params.maxEditionSupply) !== null && _h !== void 0 ? _h : (0, types_1.toBigNumber)(0), isMutable: (_j = params.isMutable) !== null && _j !== void 0 ? _j : true, retainAuthority: (_k = params.retainAuthority) !== null && _k !== void 0 ? _k : true, goLiveDate: (_l = params.goLiveDate) !== null && _l !== void 0 ? _l : null, endSettings: (_m = params.endSettings) !== null && _m !== void 0 ? _m : null, creators: (_o = params.creators) !== null && _o !== void 0 ? _o : [
            {
                address: metaplex.identity().publicKey,
                share: 100,
                verified: false,
            },
        ], hiddenSettings: (_p = params.hiddenSettings) !== null && _p !== void 0 ? _p : null, whitelistMintSettings: (_q = params.whitelistMintSettings) !== null && _q !== void 0 ? _q : null, gatekeeper: (_r = params.gatekeeper) !== null && _r !== void 0 ? _r : null }));
    const initializeInstruction = (0, mpl_candy_machine_1.createInitializeCandyMachineInstruction)({
        candyMachine: candyMachine.publicKey,
        wallet,
        authority: (0, types_1.toPublicKey)(authority),
        payer: payer.publicKey,
    }, { data });
    if (tokenMint) {
        initializeInstruction.keys.push({
            pubkey: tokenMint,
            isWritable: false,
            isSigner: false,
        });
    }
    else {
        (0, types_1.assertSameCurrencies)(params.price, types_1.SOL);
    }
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        candyMachineSigner: candyMachine,
        payer,
        wallet,
        authority: (0, types_1.toPublicKey)(authority),
        creators: data.creators,
    })
        // Create an empty account for the candy machine.
        .add(yield metaplex
        .system()
        .builders()
        .createAccount({
        payer,
        newAccount: candyMachine,
        space: (0, helpers_1.getCandyMachineAccountSizeFromData)(data),
        program: program_1.CandyMachineProgram.publicKey,
        instructionKey: (_s = params.createAccountInstructionKey) !== null && _s !== void 0 ? _s : 'createAccount',
    }))
        // Initialize the candy machine account.
        .add({
        instruction: initializeInstruction,
        signers: [candyMachine, payer],
        key: (_t = params.initializeCandyMachineInstructionKey) !== null && _t !== void 0 ? _t : 'initializeCandyMachine',
    })
        // Set the collection.
        .when(!!collection, (builder) => {
        var _a;
        if (!(0, types_1.isSigner)(authority)) {
            throw new errors_1.ExpectedSignerError('authority', 'PublicKey', {
                problemSuffix: 'You are trying to create a Candy Machine with a Collection NFT. ' +
                    'In order for the Collection NFT to be set successfully, you must provide the authority as a Signer.',
                solution: 'Please provide the "authority" parameter as a Signer if you want to set the Collection NFT upon creation. ' +
                    'Alternatively, you may remove the "collection" parameter to create a Candy Machine without an associated Collection NFT.',
            });
        }
        const collectionMint = collection;
        const metadata = (0, nftModule_1.findMetadataPda)(collectionMint);
        const edition = (0, nftModule_1.findMasterEditionV2Pda)(collectionMint);
        const collectionPda = (0, pdas_1.findCandyMachineCollectionPda)(candyMachine.publicKey);
        const collectionAuthorityRecord = (0, nftModule_1.findCollectionAuthorityRecordPda)(collectionMint, collectionPda);
        return builder.add({
            instruction: (0, mpl_candy_machine_1.createSetCollectionInstruction)({
                candyMachine: candyMachine.publicKey,
                authority: (0, types_1.toPublicKey)(authority),
                collectionPda,
                payer: payer.publicKey,
                metadata,
                mint: collectionMint,
                edition,
                collectionAuthorityRecord,
                tokenMetadataProgram: nftModule_1.TokenMetadataProgram.publicKey,
            }),
            signers: [authority],
            key: (_a = params.setCollectionInstructionKey) !== null && _a !== void 0 ? _a : 'setCollection',
        });
    }));
});
exports.createCandyMachineBuilder = createCandyMachineBuilder;
//# sourceMappingURL=createCandyMachine.js.map
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
exports.mintCandyMachineBuilder = exports.mintCandyMachineOperationHandler = exports.mintCandyMachineOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const web3_js_1 = require("@solana/web3.js");
const nftModule_1 = require("../../nftModule");
const tokenModule_1 = require("../../tokenModule");
const accounts_1 = require("../accounts");
const asserts_1 = require("../asserts");
const errors_1 = require("../errors");
const pdas_1 = require("../pdas");
const program_1 = require("../program");
// -----------------
// Operation
// -----------------
const Key = 'MintCandyMachineOperation';
/**
 * Mint an NFT from an existing Candy Machine.
 *
 * ```ts
 * const { nft } = await metaplex
 *   .candyMachines()
 *   .mint({ candyMachine })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.mintCandyMachineOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.mintCandyMachineOperationHandler = {
    handle(operation, metaplex, scope) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (0, asserts_1.assertCanMintCandyMachine)(operation.input.candyMachine, (_a = operation.input.payer) !== null && _a !== void 0 ? _a : metaplex.identity());
            const builder = yield (0, exports.mintCandyMachineBuilder)(metaplex, operation.input);
            scope.throwIfCanceled();
            const output = yield builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
            scope.throwIfCanceled();
            let nft;
            try {
                nft = (yield metaplex
                    .nfts()
                    .findByMint({
                    mintAddress: output.mintSigner.publicKey,
                    tokenAddress: output.tokenAddress,
                })
                    .run(scope));
            }
            catch (error) {
                throw new errors_1.CandyMachineBotTaxError(metaplex.rpc().getSolanaExporerUrl(output.response.signature), error);
            }
            return Object.assign({ nft }, output);
        });
    },
};
/**
 * Mint an NFT from an existing Candy Machine.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .candyMachines()
 *   .builders()
 *   .mint({ candyMachine });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const mintCandyMachineBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { candyMachine, payer = metaplex.identity(), newMint = web3_js_1.Keypair.generate(), newOwner = metaplex.identity().publicKey, newToken, tokenProgram, associatedTokenProgram, tokenMetadataProgram = nftModule_1.TokenMetadataProgram.publicKey, candyMachineProgram = program_1.CandyMachineProgram.publicKey, } = params;
    const newMetadata = (0, nftModule_1.findMetadataPda)(newMint.publicKey, tokenMetadataProgram);
    const newEdition = (0, nftModule_1.findMasterEditionV2Pda)(newMint.publicKey, tokenMetadataProgram);
    const candyMachineCreator = (0, pdas_1.findCandyMachineCreatorPda)(candyMachine.address, candyMachineProgram);
    const candyMachineCollectionAddress = (0, pdas_1.findCandyMachineCollectionPda)(candyMachine.address, candyMachineProgram);
    const candyMachineCollectionAccount = (0, accounts_1.parseCandyMachineCollectionAccount)(yield metaplex.rpc().getAccount(candyMachineCollectionAddress));
    const tokenWithMintBuilder = yield metaplex
        .tokens()
        .builders()
        .createTokenWithMint({
        decimals: 0,
        initialSupply: (0, types_1.token)(1),
        mint: newMint,
        mintAuthority: payer,
        freezeAuthority: payer.publicKey,
        owner: newOwner,
        token: newToken,
        payer,
        tokenProgram,
        associatedTokenProgram,
        createMintAccountInstructionKey: params.createMintAccountInstructionKey,
        initializeMintInstructionKey: params.initializeMintInstructionKey,
        createAssociatedTokenAccountInstructionKey: params.createAssociatedTokenAccountInstructionKey,
        createTokenAccountInstructionKey: params.createTokenAccountInstructionKey,
        initializeTokenInstructionKey: params.initializeTokenInstructionKey,
        mintTokensInstructionKey: params.mintTokensInstructionKey,
    });
    const { tokenAddress } = tokenWithMintBuilder.getContext();
    const mintNftInstruction = (0, mpl_candy_machine_1.createMintNftInstruction)({
        candyMachine: candyMachine.address,
        candyMachineCreator: candyMachineCreator,
        payer: payer.publicKey,
        wallet: candyMachine.walletAddress,
        metadata: newMetadata,
        mint: newMint.publicKey,
        mintAuthority: payer.publicKey,
        updateAuthority: payer.publicKey,
        masterEdition: newEdition,
        tokenMetadataProgram,
        clock: web3_js_1.SYSVAR_CLOCK_PUBKEY,
        recentBlockhashes: web3_js_1.SYSVAR_SLOT_HASHES_PUBKEY,
        instructionSysvarAccount: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
    }, { creatorBump: candyMachineCreator.bump });
    if (candyMachine.whitelistMintSettings) {
        const whitelistToken = (_a = params.whitelistToken) !== null && _a !== void 0 ? _a : (0, tokenModule_1.findAssociatedTokenAccountPda)(candyMachine.whitelistMintSettings.mint, payer.publicKey, associatedTokenProgram);
        mintNftInstruction.keys.push({
            pubkey: whitelistToken,
            isWritable: true,
            isSigner: false,
        }, {
            pubkey: candyMachine.whitelistMintSettings.mint,
            isWritable: true,
            isSigner: false,
        }, {
            pubkey: payer.publicKey,
            isWritable: false,
            isSigner: true,
        });
    }
    if (candyMachine.tokenMintAddress) {
        const payerToken = (_b = params.payerToken) !== null && _b !== void 0 ? _b : (0, tokenModule_1.findAssociatedTokenAccountPda)(candyMachine.tokenMintAddress, payer.publicKey, associatedTokenProgram);
        mintNftInstruction.keys.push({
            pubkey: payerToken,
            isWritable: true,
            isSigner: false,
        }, {
            pubkey: payer.publicKey,
            isWritable: false,
            isSigner: true,
        });
    }
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        mintSigner: newMint,
        tokenAddress,
    })
        // Create token and mint accounts.
        .add(tokenWithMintBuilder)
        // Create the new NFT.
        .add({
        instruction: mintNftInstruction,
        signers: [payer, newMint],
        key: (_c = params.mintNftInstructionKey) !== null && _c !== void 0 ? _c : 'mintNft',
    })
        // Set the collection on the NFT.
        .when(candyMachineCollectionAccount.exists, (builder) => {
        var _a;
        (0, types_1.assertAccountExists)(candyMachineCollectionAccount);
        const collectionMint = candyMachineCollectionAccount.data.mint;
        const collectionMetadata = (0, nftModule_1.findMetadataPda)(collectionMint, tokenMetadataProgram);
        const collectionMasterEdition = (0, nftModule_1.findMasterEditionV2Pda)(collectionMint, tokenMetadataProgram);
        const collectionAuthorityRecord = (0, nftModule_1.findCollectionAuthorityRecordPda)(collectionMint, candyMachineCollectionAccount.publicKey, tokenMetadataProgram);
        return builder.add({
            instruction: (0, mpl_candy_machine_1.createSetCollectionDuringMintInstruction)({
                candyMachine: candyMachine.address,
                metadata: newMetadata,
                payer: payer.publicKey,
                collectionPda: candyMachineCollectionAccount.publicKey,
                tokenMetadataProgram,
                instructions: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
                collectionMint: candyMachineCollectionAccount.data.mint,
                collectionMetadata,
                collectionMasterEdition,
                authority: candyMachine.authorityAddress,
                collectionAuthorityRecord,
            }),
            signers: [payer],
            key: (_a = params.setCollectionInstructionKey) !== null && _a !== void 0 ? _a : 'setCollection',
        });
    }));
});
exports.mintCandyMachineBuilder = mintCandyMachineBuilder;
//# sourceMappingURL=mintCandyMachine.js.map
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
exports.printNewEditionBuilder = exports.printNewEditionOperationHandler = exports.printNewEditionOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const tokenModule_1 = require("../../tokenModule");
const accounts_1 = require("../accounts");
const models_1 = require("../models");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'PrintNewEditionOperation';
/**
 * Prints a new edition from an original NFT.
 *
 * ```ts
 * const { nft } = await metaplex
 *   .nfts()
 *   .printNewEdition({ originalMint })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.printNewEditionOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.printNewEditionOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const originalEditionAccount = yield metaplex
            .rpc()
            .getAccount((0, pdas_1.findMasterEditionV2Pda)(operation.input.originalMint));
        scope.throwIfCanceled();
        const originalEdition = (0, models_1.toNftOriginalEdition)((0, accounts_1.toOriginalEditionAccount)(originalEditionAccount));
        const builder = yield (0, exports.printNewEditionBuilder)(metaplex, Object.assign(Object.assign({}, operation.input), { originalSupply: originalEdition.supply }));
        scope.throwIfCanceled();
        const output = yield builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
        scope.throwIfCanceled();
        const nft = yield metaplex
            .nfts()
            .findByMint({
            mintAddress: output.mintSigner.publicKey,
            tokenAddress: output.tokenAddress,
        })
            .run(scope);
        scope.throwIfCanceled();
        (0, models_1.assertNftWithToken)(nft);
        return Object.assign(Object.assign({}, output), { nft });
    }),
};
/**
 * Prints a new edition from an original NFT.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .nfts()
 *   .builders()
 *   .printNewEdition({ originalMint });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const printNewEditionBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { originalMint, newMint = web3_js_1.Keypair.generate(), newUpdateAuthority = metaplex.identity().publicKey, newOwner = metaplex.identity().publicKey, newTokenAccount, payer = metaplex.identity(), tokenProgram, associatedTokenProgram, printNewEditionInstructionKey = 'printNewEdition', } = params;
    // Original NFT.
    const originalMetadataAddress = (0, pdas_1.findMetadataPda)(originalMint);
    const originalEditionAddress = (0, pdas_1.findMasterEditionV2Pda)(originalMint);
    const edition = (0, types_1.toBigNumber)(params.originalSupply.addn(1));
    const originalEditionMarkPda = (0, pdas_1.findEditionMarkerPda)(originalMint, edition);
    // New NFT.
    const newMintAuthority = web3_js_1.Keypair.generate(); // Will be overwritten by edition PDA.
    const newMetadataAddress = (0, pdas_1.findMetadataPda)(newMint.publicKey);
    const newEditionAddress = (0, pdas_1.findEditionPda)(newMint.publicKey);
    const sharedAccounts = {
        newMetadata: newMetadataAddress,
        newEdition: newEditionAddress,
        masterEdition: originalEditionAddress,
        newMint: newMint.publicKey,
        editionMarkPda: originalEditionMarkPda,
        newMintAuthority: newMintAuthority.publicKey,
        payer: payer.publicKey,
        newMetadataUpdateAuthority: newUpdateAuthority,
        metadata: originalMetadataAddress,
    };
    const tokenWithMintBuilder = yield metaplex
        .tokens()
        .builders()
        .createTokenWithMint({
        decimals: 0,
        initialSupply: (0, types_1.token)(1),
        mint: newMint,
        mintAuthority: newMintAuthority,
        freezeAuthority: newMintAuthority.publicKey,
        owner: newOwner,
        token: newTokenAccount,
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
    const originalTokenAccountOwner = (_a = params.originalTokenAccountOwner) !== null && _a !== void 0 ? _a : metaplex.identity();
    const originalTokenAccount = (_b = params.originalTokenAccount) !== null && _b !== void 0 ? _b : (0, tokenModule_1.findAssociatedTokenAccountPda)(originalMint, originalTokenAccountOwner.publicKey);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        mintSigner: newMint,
        metadataAddress: newMetadataAddress,
        editionAddress: newEditionAddress,
        tokenAddress,
        updatedSupply: edition,
    })
        // Create the mint and token accounts before minting 1 token to the owner.
        .add(tokenWithMintBuilder)
        // Mint new edition.
        .add({
        instruction: (0, mpl_token_metadata_1.createMintNewEditionFromMasterEditionViaTokenInstruction)(Object.assign(Object.assign({}, sharedAccounts), { tokenAccountOwner: originalTokenAccountOwner.publicKey, tokenAccount: originalTokenAccount }), { mintNewEditionFromMasterEditionViaTokenArgs: { edition } }),
        signers: [newMint, newMintAuthority, payer, originalTokenAccountOwner],
        key: printNewEditionInstructionKey,
    }));
});
exports.printNewEditionBuilder = printNewEditionBuilder;
//# sourceMappingURL=printNewEdition.js.map
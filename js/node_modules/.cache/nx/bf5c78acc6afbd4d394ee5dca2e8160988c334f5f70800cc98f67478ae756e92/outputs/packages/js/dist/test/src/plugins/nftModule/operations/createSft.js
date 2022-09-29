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
exports.createSftBuilder = exports.createSftOperationHandler = exports.createSftOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const tokenModule_1 = require("../../tokenModule");
const models_1 = require("../models");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'CreateSftOperation';
/**
 * Creates a new SFT.
 *
 * ```ts
 * const { sft } = await metaplex
 *   .nfts()
 *   .createSft({
 *     name: 'My SFT',
 *     uri: 'https://example.com/my-sft',
 *     sellerFeeBasisPoints: 250, // 2.5%
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createSftOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createSftOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { useNewMint = web3_js_1.Keypair.generate(), useExistingMint, tokenOwner, tokenAddress: tokenSigner, confirmOptions, } = operation.input;
        const mintAddress = useExistingMint !== null && useExistingMint !== void 0 ? useExistingMint : useNewMint.publicKey;
        const associatedTokenAddress = tokenOwner
            ? (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, tokenOwner)
            : null;
        const tokenAddress = tokenSigner
            ? (0, types_1.toPublicKey)(tokenSigner)
            : associatedTokenAddress;
        let tokenExists;
        if (!!useExistingMint && !!tokenAddress) {
            const tokenAccount = yield metaplex.rpc().getAccount(tokenAddress);
            tokenExists = tokenAccount.exists;
        }
        else {
            tokenExists = false;
        }
        const builder = yield (0, exports.createSftBuilder)(metaplex, Object.assign(Object.assign({}, operation.input), { useNewMint,
            tokenExists }));
        scope.throwIfCanceled();
        const output = yield builder.sendAndConfirm(metaplex, confirmOptions);
        scope.throwIfCanceled();
        const sft = yield metaplex
            .nfts()
            .findByMint({
            mintAddress: output.mintAddress,
            tokenAddress: (_a = output.tokenAddress) !== null && _a !== void 0 ? _a : undefined,
        })
            .run(scope);
        scope.throwIfCanceled();
        (0, models_1.assertSft)(sft);
        return Object.assign(Object.assign({}, output), { sft });
    }),
};
/**
 * Creates a new SFT.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .nfts()
 *   .builders()
 *   .createSft({
 *     name: 'My SFT',
 *     uri: 'https://example.com/my-sft',
 *     sellerFeeBasisPoints: 250, // 2.5%
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createSftBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e, _f;
    const { payer = metaplex.identity(), useNewMint = web3_js_1.Keypair.generate(), updateAuthority = metaplex.identity(), mintAuthority = metaplex.identity(), } = params;
    const mintAndTokenBuilder = yield createMintAndTokenForSftBuilder(metaplex, params, useNewMint);
    const { mintAddress, tokenAddress } = mintAndTokenBuilder.getContext();
    const metadataPda = (0, pdas_1.findMetadataPda)(mintAddress);
    const creatorsInput = (_b = params.creators) !== null && _b !== void 0 ? _b : [
        {
            address: updateAuthority.publicKey,
            authority: updateAuthority,
            share: 100,
        },
    ];
    const creators = creatorsInput.length > 0
        ? creatorsInput.map((creator) => (Object.assign(Object.assign({}, creator), { verified: creator.address.equals(updateAuthority.publicKey) })))
        : null;
    const createMetadataInstruction = (0, mpl_token_metadata_1.createCreateMetadataAccountV3Instruction)({
        metadata: metadataPda,
        mint: mintAddress,
        mintAuthority: mintAuthority.publicKey,
        payer: payer.publicKey,
        updateAuthority: updateAuthority.publicKey,
    }, {
        createMetadataAccountArgsV3: {
            data: {
                name: params.name,
                symbol: (_c = params.symbol) !== null && _c !== void 0 ? _c : '',
                uri: params.uri,
                sellerFeeBasisPoints: params.sellerFeeBasisPoints,
                creators,
                collection: params.collection
                    ? { key: params.collection, verified: false }
                    : null,
                uses: (_d = params.uses) !== null && _d !== void 0 ? _d : null,
            },
            isMutable: (_e = params.isMutable) !== null && _e !== void 0 ? _e : true,
            collectionDetails: params.isCollection
                ? { __kind: 'V1', size: 0 } // Program will hardcode size to zero anyway.
                : null,
        },
    });
    // When the payer is different than the update authority, the latter will
    // not be marked as a signer and therefore signing as a creator will fail.
    createMetadataInstruction.keys[4].isSigner = true;
    const verifyAdditionalCreatorInstructions = creatorsInput
        .filter((creator) => {
        return (!!creator.authority &&
            !creator.address.equals(updateAuthority.publicKey));
    })
        .map((creator) => {
        return metaplex.nfts().builders().verifyCreator({
            mintAddress,
            creator: creator.authority,
        });
    });
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        mintAddress,
        metadataAddress: metadataPda,
        tokenAddress,
    })
        // Create the mint and token accounts before minting 1 token to the owner.
        .add(mintAndTokenBuilder)
        // Create metadata account.
        .add({
        instruction: createMetadataInstruction,
        signers: [payer, mintAuthority, updateAuthority],
        key: (_f = params.createMetadataInstructionKey) !== null && _f !== void 0 ? _f : 'createMetadata',
    })
        // Verify additional creators.
        .add(...verifyAdditionalCreatorInstructions)
        // Verify collection.
        .when(!!params.collection && !!params.collectionAuthority, (builder) => {
        var _a, _b;
        return builder.add(metaplex
            .nfts()
            .builders()
            .verifyCollection({
            payer,
            mintAddress,
            collectionMintAddress: params.collection,
            collectionAuthority: params.collectionAuthority,
            isDelegated: (_a = params.collectionAuthorityIsDelegated) !== null && _a !== void 0 ? _a : false,
            isSizedCollection: (_b = params.collectionIsSized) !== null && _b !== void 0 ? _b : true,
        }));
    }));
});
exports.createSftBuilder = createSftBuilder;
const createMintAndTokenForSftBuilder = (metaplex, params, useNewMint) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    const { payer = metaplex.identity(), mintAuthority = metaplex.identity(), freezeAuthority = metaplex.identity().publicKey, tokenExists = false, } = params;
    const mintAddress = (_g = params.useExistingMint) !== null && _g !== void 0 ? _g : useNewMint.publicKey;
    const associatedTokenAddress = params.tokenOwner
        ? (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, params.tokenOwner)
        : null;
    const tokenAddress = params.tokenAddress
        ? (0, types_1.toPublicKey)(params.tokenAddress)
        : associatedTokenAddress;
    const builder = utils_1.TransactionBuilder.make().setContext({
        mintAddress,
        tokenAddress,
    });
    // Create the mint account if it doesn't exist.
    if (!params.useExistingMint) {
        builder.add(yield metaplex
            .tokens()
            .builders()
            .createMint({
            decimals: (_h = params.decimals) !== null && _h !== void 0 ? _h : 0,
            mint: useNewMint,
            payer,
            mintAuthority: mintAuthority.publicKey,
            freezeAuthority,
            tokenProgram: params.tokenProgram,
            createAccountInstructionKey: params.createMintAccountInstructionKey,
            initializeMintInstructionKey: params.initializeMintInstructionKey,
        }));
    }
    // Create the token account if it doesn't exist.
    const isNewToken = !!params.tokenAddress && (0, types_1.isSigner)(params.tokenAddress);
    const isNewAssociatedToken = !!params.tokenOwner;
    if (!tokenExists && (isNewToken || isNewAssociatedToken)) {
        builder.add(yield metaplex
            .tokens()
            .builders()
            .createToken({
            mint: mintAddress,
            owner: params.tokenOwner,
            token: params.tokenAddress,
            payer,
            tokenProgram: params.tokenProgram,
            associatedTokenProgram: params.associatedTokenProgram,
            createAssociatedTokenAccountInstructionKey: params.createAssociatedTokenAccountInstructionKey,
            createAccountInstructionKey: params.createTokenAccountInstructionKey,
            initializeTokenInstructionKey: params.initializeTokenInstructionKey,
        }));
    }
    // Mint provided amount to the token account.
    if (tokenAddress && params.tokenAmount) {
        builder.add(yield metaplex.tokens().builders().mint({
            mintAddress,
            toToken: tokenAddress,
            toTokenExists: true,
            amount: params.tokenAmount,
            mintAuthority,
            tokenProgram: params.tokenProgram,
            mintTokensInstructionKey: params.mintTokensInstructionKey,
        }));
    }
    return builder;
});
//# sourceMappingURL=createSft.js.map
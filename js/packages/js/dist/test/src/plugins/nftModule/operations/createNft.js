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
exports.createNftBuilder = exports.createNftOperationHandler = exports.createNftOperation = void 0;
const tokenModule_1 = require("../../../plugins/tokenModule");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const models_1 = require("../models");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'CreateNftOperation';
/**
 * Creates a new NFT.
 *
 * ```ts
 * const { nft } = await metaplex
 *   .nfts()
 *   .create({
 *     name: 'My NFT',
 *     uri: 'https://example.com/my-nft',
 *     sellerFeeBasisPoints: 250, // 2.5%
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createNftOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createNftOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { useNewMint = web3_js_1.Keypair.generate(), useExistingMint, tokenOwner = metaplex.identity().publicKey, tokenAddress: tokenSigner, confirmOptions, } = operation.input;
        const mintAddress = useExistingMint !== null && useExistingMint !== void 0 ? useExistingMint : useNewMint.publicKey;
        const tokenAddress = tokenSigner
            ? (0, types_1.toPublicKey)(tokenSigner)
            : (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, tokenOwner);
        const tokenAccount = yield metaplex.rpc().getAccount(tokenAddress);
        const tokenExists = tokenAccount.exists;
        const builder = yield (0, exports.createNftBuilder)(metaplex, Object.assign(Object.assign({}, operation.input), { useNewMint,
            tokenOwner,
            tokenExists }));
        scope.throwIfCanceled();
        const output = yield builder.sendAndConfirm(metaplex, confirmOptions);
        scope.throwIfCanceled();
        const nft = yield metaplex
            .nfts()
            .findByMint({
            mintAddress: output.mintAddress,
            tokenAddress: output.tokenAddress,
        })
            .run(scope);
        scope.throwIfCanceled();
        (0, models_1.assertNftWithToken)(nft);
        return Object.assign(Object.assign({}, output), { nft });
    }),
};
/**
 * Creates a new NFT.
 *
 * ```ts
 * const transactionBuilder = await metaplex
 *   .nfts()
 *   .builders()
 *   .create({
 *     name: 'My NFT',
 *     uri: 'https://example.com/my-nft',
 *     sellerFeeBasisPoints: 250, // 2.5%
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createNftBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { useNewMint = web3_js_1.Keypair.generate(), payer = metaplex.identity(), updateAuthority = metaplex.identity(), mintAuthority = metaplex.identity(), tokenOwner = metaplex.identity().publicKey, } = params;
    const sftBuilder = yield metaplex
        .nfts()
        .builders()
        .createSft(Object.assign(Object.assign({}, params), { payer,
        updateAuthority,
        mintAuthority, freezeAuthority: mintAuthority.publicKey, useNewMint,
        tokenOwner, tokenAmount: (0, types_1.token)(1), decimals: 0 }));
    const { mintAddress, metadataAddress, tokenAddress } = sftBuilder.getContext();
    const masterEditionAddress = (0, pdas_1.findMasterEditionV2Pda)(mintAddress);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        mintAddress,
        metadataAddress,
        masterEditionAddress,
        tokenAddress: tokenAddress,
    })
        // Create the mint, the token and the metadata.
        .add(sftBuilder)
        // Create master edition account (prevents further minting).
        .add({
        instruction: (0, mpl_token_metadata_1.createCreateMasterEditionV3Instruction)({
            edition: masterEditionAddress,
            mint: mintAddress,
            updateAuthority: updateAuthority.publicKey,
            mintAuthority: mintAuthority.publicKey,
            payer: payer.publicKey,
            metadata: metadataAddress,
        }, {
            createMasterEditionArgs: {
                maxSupply: params.maxSupply === undefined ? 0 : params.maxSupply,
            },
        }),
        signers: [payer, mintAuthority, updateAuthority],
        key: (_a = params.createMasterEditionInstructionKey) !== null && _a !== void 0 ? _a : 'createMasterEdition',
    }));
});
exports.createNftBuilder = createNftBuilder;
//# sourceMappingURL=createNft.js.map
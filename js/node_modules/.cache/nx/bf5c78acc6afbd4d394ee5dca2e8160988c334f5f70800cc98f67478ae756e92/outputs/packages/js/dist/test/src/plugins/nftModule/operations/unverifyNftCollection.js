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
exports.unverifyNftCollectionBuilder = exports.unverifyNftCollectionOperationHandler = exports.unverifyNftCollectionOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'UnverifyNftCollectionOperation';
/**
 * Unverifies the collection of an NFT or SFT.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .unverifyCollection({ mintAddress, collectionMintAddress })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.unverifyNftCollectionOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.unverifyNftCollectionOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.unverifyNftCollectionBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Unverifies the collection of an NFT or SFT.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .unverifyCollection({ mintAddress, collectionMintAddress });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const unverifyNftCollectionBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, collectionMintAddress, isSizedCollection = true, isDelegated = false, collectionAuthority = metaplex.identity(), payer = metaplex.identity(), } = params;
    const accounts = {
        metadata: (0, pdas_1.findMetadataPda)(mintAddress),
        collectionAuthority: collectionAuthority.publicKey,
        payer: payer.publicKey,
        collectionMint: collectionMintAddress,
        collection: (0, pdas_1.findMetadataPda)(collectionMintAddress),
        collectionMasterEditionAccount: (0, pdas_1.findMasterEditionV2Pda)(collectionMintAddress),
        collectionAuthorityRecord: isDelegated
            ? (0, pdas_1.findCollectionAuthorityRecordPda)(collectionMintAddress, collectionAuthority.publicKey)
            : undefined,
    };
    const instruction = isSizedCollection
        ? (0, mpl_token_metadata_1.createUnverifySizedCollectionItemInstruction)(accounts)
        : (0, mpl_token_metadata_1.createUnverifyCollectionInstruction)(accounts);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Unverify the collection.
        .add({
        instruction: instruction,
        signers: [payer, collectionAuthority],
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'unverifyCollection',
    }));
};
exports.unverifyNftCollectionBuilder = unverifyNftCollectionBuilder;
//# sourceMappingURL=unverifyNftCollection.js.map
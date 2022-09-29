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
exports.migrateToSizedCollectionNftBuilder = exports.migrateToSizedCollectionNftOperationHandler = exports.migrateToSizedCollectionNftOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'MigrateToSizedCollectionNftOperation';
/**
 * Migrates a legacy Collection NFT to a sized Collection NFT.
 * Both can act as a Collection for NFTs but only the latter
 * keeps track of the size of the collection on chain.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .migrateToSizedCollection({ mintAddress, size: toBigNumber(10000) })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.migrateToSizedCollectionNftOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.migrateToSizedCollectionNftOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.migrateToSizedCollectionNftBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Migrates a legacy Collection NFT to a sized Collection NFT.
 * Both can act as a Collection for NFTs but only the latter
 * keeps track of the size of the collection on chain.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .migrateToSizedCollection({ mintAddress, size: toBigNumber(10000) });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const migrateToSizedCollectionNftBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, collectionAuthority = metaplex.identity(), size, isDelegated = false, } = params;
    return (utils_1.TransactionBuilder.make()
        // Update the metadata account.
        .add({
        instruction: (0, mpl_token_metadata_1.createSetCollectionSizeInstruction)({
            collectionMetadata: (0, pdas_1.findMetadataPda)(mintAddress),
            collectionAuthority: collectionAuthority.publicKey,
            collectionMint: mintAddress,
            collectionAuthorityRecord: isDelegated
                ? (0, pdas_1.findCollectionAuthorityRecordPda)(mintAddress, collectionAuthority.publicKey)
                : undefined,
        }, { setCollectionSizeArgs: { size } }),
        signers: [collectionAuthority],
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'setCollectionSize',
    }));
};
exports.migrateToSizedCollectionNftBuilder = migrateToSizedCollectionNftBuilder;
//# sourceMappingURL=migrateToSizedCollectionNft.js.map
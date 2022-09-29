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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNftBuilder = exports.updateNftOperationHandler = exports.updateNftOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'UpdateNftOperation';
/**
 * Updates an existing NFT or SFT.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .update({ nftOrSft, name: "My new NFT name" })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.updateNftOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.updateNftOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const builder = (0, exports.updateNftBuilder)(metaplex, operation.input);
        if (builder.isEmpty()) {
            throw new errors_1.NoInstructionsToSendError(Key);
        }
        return builder.sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Updates an existing NFT or SFT.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .update({ nftOrSft, name: "My new NFT name" });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const updateNftBuilder = (metaplex, params) => {
    var _a;
    const { nftOrSft, updateAuthority = metaplex.identity() } = params;
    const updateInstructionDataWithoutChanges = toInstructionData(nftOrSft);
    const updateInstructionData = toInstructionData(nftOrSft, params);
    const shouldSendUpdateInstruction = !(0, lodash_isequal_1.default)(updateInstructionData, updateInstructionDataWithoutChanges);
    const isRemovingVerifiedCollection = !!nftOrSft.collection &&
        !!nftOrSft.collection.verified &&
        !params.collection;
    const isOverridingVerifiedCollection = !!nftOrSft.collection &&
        !!nftOrSft.collection.verified &&
        !!params.collection &&
        !params.collection.equals(nftOrSft.collection.address);
    const shouldUnverifyCurrentCollection = isRemovingVerifiedCollection || isOverridingVerifiedCollection;
    const creatorsInput = (_a = params.creators) !== null && _a !== void 0 ? _a : nftOrSft.creators;
    const verifyAdditionalCreatorInstructions = creatorsInput
        .filter((creator) => {
        var _a;
        const currentCreator = nftOrSft.creators.find(({ address }) => address.equals(creator.address));
        const currentlyVerified = (_a = currentCreator === null || currentCreator === void 0 ? void 0 : currentCreator.verified) !== null && _a !== void 0 ? _a : false;
        return !!creator.authority && !currentlyVerified;
    })
        .map((creator) => {
        return metaplex.nfts().builders().verifyCreator({
            mintAddress: nftOrSft.address,
            creator: creator.authority,
        });
    });
    return (utils_1.TransactionBuilder.make()
        // Unverify current collection before overriding it.
        // Otherwise, the previous collection size will not be properly decremented.
        .when(shouldUnverifyCurrentCollection, (builder) => {
        var _a, _b;
        return builder.add(metaplex
            .nfts()
            .builders()
            .unverifyCollection({
            mintAddress: nftOrSft.address,
            collectionMintAddress: (_a = nftOrSft.collection) === null || _a === void 0 ? void 0 : _a.address,
            collectionAuthority: updateAuthority,
            isSizedCollection: (_b = params.oldCollectionIsSized) !== null && _b !== void 0 ? _b : true,
        }));
    })
        // Update the metadata account.
        .when(shouldSendUpdateInstruction, (builder) => {
        var _a;
        return builder.add({
            instruction: (0, mpl_token_metadata_1.createUpdateMetadataAccountV2Instruction)({
                metadata: (0, pdas_1.findMetadataPda)(nftOrSft.address),
                updateAuthority: updateAuthority.publicKey,
            }, {
                updateMetadataAccountArgsV2: updateInstructionData,
            }),
            signers: [updateAuthority],
            key: (_a = params.updateMetadataInstructionKey) !== null && _a !== void 0 ? _a : 'updateMetadata',
        });
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
            mintAddress: nftOrSft.address,
            collectionMintAddress: params.collection,
            collectionAuthority: params.collectionAuthority,
            isDelegated: (_a = params.collectionAuthorityIsDelegated) !== null && _a !== void 0 ? _a : false,
            isSizedCollection: (_b = params.collectionIsSized) !== null && _b !== void 0 ? _b : true,
        }));
    }));
};
exports.updateNftBuilder = updateNftBuilder;
const toInstructionData = (nftOrSft, input = {}) => {
    var _a, _b, _c, _d, _e, _f, _g;
    const creators = input.creators === undefined
        ? nftOrSft.creators
        : input.creators.map((creator) => {
            var _a;
            const currentCreator = nftOrSft.creators.find(({ address }) => address.equals(creator.address));
            return Object.assign(Object.assign({}, creator), { verified: (_a = currentCreator === null || currentCreator === void 0 ? void 0 : currentCreator.verified) !== null && _a !== void 0 ? _a : false });
        });
    const currentCollection = nftOrSft.collection
        ? Object.assign(Object.assign({}, nftOrSft.collection), { key: nftOrSft.collection.address }) : null;
    const newCollection = input.collection
        ? { key: input.collection, verified: false }
        : null;
    return {
        updateAuthority: (_a = input.newUpdateAuthority) !== null && _a !== void 0 ? _a : null,
        primarySaleHappened: (_b = input.primarySaleHappened) !== null && _b !== void 0 ? _b : null,
        isMutable: (_c = input.isMutable) !== null && _c !== void 0 ? _c : null,
        data: {
            name: (_d = input.name) !== null && _d !== void 0 ? _d : nftOrSft.name,
            symbol: (_e = input.symbol) !== null && _e !== void 0 ? _e : nftOrSft.symbol,
            uri: (_f = input.uri) !== null && _f !== void 0 ? _f : nftOrSft.uri,
            sellerFeeBasisPoints: (_g = input.sellerFeeBasisPoints) !== null && _g !== void 0 ? _g : nftOrSft.sellerFeeBasisPoints,
            creators: creators.length > 0 ? creators : null,
            uses: input.uses === undefined ? nftOrSft.uses : input.uses,
            collection: input.collection === undefined ? currentCollection : newCollection,
        },
    };
};
//# sourceMappingURL=updateNft.js.map
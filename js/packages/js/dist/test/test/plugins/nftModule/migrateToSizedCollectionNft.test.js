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
const index_1 = require("../../../src/index");
const web3_js_1 = require("@solana/web3.js");
const spok_1 = __importDefault(require("spok"));
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can migrate from a legacy collection to a sized collection', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing legacy collection.
    const collectionAuthority = web3_js_1.Keypair.generate();
    const collection = yield (0, helpers_1.createNft)(mx, {
        updateAuthority: collectionAuthority,
    });
    t.false(collection.collectionDetails, 'collection is legacy');
    // When we migrate the collection to a sized collection of 12345 items.
    yield mx
        .nfts()
        .migrateToSizedCollection({
        mintAddress: collection.address,
        size: (0, index_1.toBigNumber)(12345),
        collectionAuthority,
    })
        .run();
    // Then the collection NFT has been updated to a sized collection.
    const updatedCollection = yield mx.nfts().refresh(collection).run();
    (0, spok_1.default)(t, updatedCollection, {
        $topic: 'Updated Collection NFT',
        model: 'nft',
        collectionDetails: {
            version: 'V1',
            size: (0, helpers_1.spokSameBignum)(12345),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can migrate from a legacy collection to a sized collection using a delegated authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing legacy collection.
    const collectionAuthority = web3_js_1.Keypair.generate();
    const collection = yield (0, helpers_1.createNft)(mx, {
        updateAuthority: collectionAuthority,
    });
    t.false(collection.collectionDetails, 'collection is legacy');
    // And a delegated collection authority for that collection NFT.
    const delegatedCollectionAuthority = web3_js_1.Keypair.generate();
    yield mx
        .nfts()
        .approveCollectionAuthority({
        mintAddress: collection.address,
        collectionAuthority: delegatedCollectionAuthority.publicKey,
        updateAuthority: collectionAuthority,
    })
        .run();
    // When we migrate the collection to a sized collection using that delegated authority.
    yield mx
        .nfts()
        .migrateToSizedCollection({
        mintAddress: collection.address,
        size: (0, index_1.toBigNumber)(12345),
        collectionAuthority: delegatedCollectionAuthority,
        isDelegated: true,
    })
        .run();
    // Then the collection NFT has been updated to a sized collection.
    const updatedCollection = yield mx.nfts().refresh(collection).run();
    (0, spok_1.default)(t, updatedCollection, {
        $topic: 'Updated Collection NFT',
        model: 'nft',
        collectionDetails: {
            version: 'V1',
            size: (0, helpers_1.spokSameBignum)(12345),
        },
    });
}));
//# sourceMappingURL=migrateToSizedCollectionNft.test.js.map
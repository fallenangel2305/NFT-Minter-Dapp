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
const web3_js_1 = require("@solana/web3.js");
const spok_1 = __importDefault(require("spok"));
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can unverify the collection of an NFT item', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with an verified collection.
    const collectionAuthority = web3_js_1.Keypair.generate();
    const collection = yield (0, helpers_1.createCollectionNft)(mx, {
        updateAuthority: collectionAuthority,
    });
    const nft = yield (0, helpers_1.createNft)(mx, {
        collection: collection.address,
        collectionAuthority,
    });
    t.true(nft.collection, 'nft has a collection');
    t.true((_a = nft.collection) === null || _a === void 0 ? void 0 : _a.verified, 'nft collection is verified');
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collection, 1);
    // When we unverify the collection.
    yield mx
        .nfts()
        .unverifyCollection({
        mintAddress: nft.address,
        collectionMintAddress: nft.collection.address,
        collectionAuthority,
    })
        .run();
    // Then the NFT collection should be unverified.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated Nft',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collection.address),
            verified: false,
        },
    });
    // And the collection should have the updated size.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collection, 0);
}));
(0, tape_1.default)('[nftModule] it can unverify the legacy collection of an NFT item', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with an verified legacy collection.
    const collectionAuthority = web3_js_1.Keypair.generate();
    const collection = yield (0, helpers_1.createNft)(mx, {
        updateAuthority: collectionAuthority,
    });
    const nft = yield (0, helpers_1.createNft)(mx, {
        collection: collection.address,
        collectionAuthority,
        collectionIsSized: false,
    });
    t.true(nft.collection, 'nft has a collection');
    t.true((_b = nft.collection) === null || _b === void 0 ? void 0 : _b.verified, 'nft collection is verified');
    t.false(collection.collectionDetails, 'collection is legacy');
    // When we unverify the collection.
    yield mx
        .nfts()
        .unverifyCollection({
        mintAddress: nft.address,
        collectionMintAddress: nft.collection.address,
        collectionAuthority,
        isSizedCollection: false,
    })
        .run();
    // Then the NFT collection should be unverified.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated Nft',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collection.address),
            verified: false,
        },
    });
}));
//# sourceMappingURL=unverifyNftCollection.test.js.map
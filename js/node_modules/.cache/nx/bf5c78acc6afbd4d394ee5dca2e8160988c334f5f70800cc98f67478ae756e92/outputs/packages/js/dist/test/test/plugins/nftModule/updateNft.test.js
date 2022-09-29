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
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can update the on-chain metadata of an NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT.
    const nft = yield (0, helpers_1.createNft)(mx, {
        name: 'On-chain NFT name',
        symbol: 'OLD',
        sellerFeeBasisPoints: 100,
        isMutable: true,
        json: {
            name: 'JSON NFT name',
            description: 'JSON NFT description',
            image: (0, index_1.toMetaplexFile)('some image', 'some-image.jpg'),
        },
    });
    // And some new updated metadata that has been uploadeds.
    const { uri: updatedUri, metadata: updatedMetadata } = yield mx
        .nfts()
        .uploadMetadata({
        name: 'Updated JSON NFT name',
        description: 'Updated JSON NFT description',
        image: (0, index_1.toMetaplexFile)('updated image', 'updated-image.jpg'),
    })
        .run();
    // When we update the NFT with new on-chain data.
    yield mx
        .nfts()
        .update({
        nftOrSft: nft,
        name: 'Updated On-chain NFT name',
        symbol: 'UPDATED',
        sellerFeeBasisPoints: 500,
        primarySaleHappened: true,
        uri: updatedUri,
        isMutable: false,
    })
        .run();
    // Then the returned NFT should have the updated data.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated Nft',
        model: 'nft',
        name: 'Updated On-chain NFT name',
        symbol: 'UPDATED',
        sellerFeeBasisPoints: 500,
        uri: updatedUri,
        isMutable: false,
        primarySaleHappened: true,
        json: {
            name: 'Updated JSON NFT name',
            description: 'Updated JSON NFT description',
            image: updatedMetadata.image,
        },
        token: {
            address: (0, helpers_1.spokSamePubkey)(nft.token.address),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can update the on-chain metadata of an SFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing SFT.
    const sft = yield (0, helpers_1.createSft)(mx, {
        name: 'On-chain SFT name',
        symbol: 'OLD',
        sellerFeeBasisPoints: 100,
        isMutable: true,
        json: {
            name: 'JSON SFT name',
            description: 'JSON SFT description',
            image: (0, index_1.toMetaplexFile)('some image', 'some-image.jpg'),
        },
    });
    // And some new updated metadata that has been uploadeds.
    const { uri: updatedUri, metadata: updatedMetadata } = yield mx
        .nfts()
        .uploadMetadata({
        name: 'Updated JSON SFT name',
        description: 'Updated JSON SFT description',
        image: (0, index_1.toMetaplexFile)('updated image', 'updated-image.jpg'),
    })
        .run();
    // When we update the NFT with new on-chain data.
    yield mx
        .nfts()
        .update({
        nftOrSft: sft,
        name: 'Updated On-chain SFT name',
        symbol: 'UPDATED',
        sellerFeeBasisPoints: 500,
        primarySaleHappened: true,
        uri: updatedUri,
        isMutable: false,
    })
        .run();
    // Then the returned NFT should have the updated data.
    const updatedSft = yield mx.nfts().refresh(sft).run();
    (0, spok_1.default)(t, updatedSft, {
        $topic: 'Updated SFT',
        model: 'sft',
        name: 'Updated On-chain SFT name',
        symbol: 'UPDATED',
        sellerFeeBasisPoints: 500,
        uri: updatedUri,
        isMutable: false,
        primarySaleHappened: true,
        json: {
            name: 'Updated JSON SFT name',
            description: 'Updated JSON SFT description',
            image: updatedMetadata.image,
        },
    });
}));
(0, tape_1.default)('[nftModule] it can update and verify creators at the same time', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And 4 creators.
    const creatorA = web3_js_1.Keypair.generate();
    const creatorB = web3_js_1.Keypair.generate();
    const creatorC = web3_js_1.Keypair.generate();
    const creatorD = web3_js_1.Keypair.generate();
    // And an existing NFT with:
    // - creatorA verified
    // - creatorB unverified
    // - creatorC unverified
    const nft = yield (0, helpers_1.createNft)(mx, {
        creators: [
            {
                address: mx.identity().publicKey,
                share: 40,
            },
            {
                address: creatorA.publicKey,
                authority: creatorA,
                share: 30,
            },
            {
                address: creatorB.publicKey,
                share: 20,
            },
            {
                address: creatorC.publicKey,
                share: 10,
            },
        ],
    });
    t.ok(nft.creators[0].verified, 'update authority is verified');
    t.ok(nft.creators[1].verified, 'creatorA is verified');
    t.ok(!nft.creators[2].verified, 'creatorB is not verified');
    t.ok(!nft.creators[3].verified, 'creatorC is not verified');
    // When we update the NFT with such that:
    // - update authority was removed from the creators
    // - creatorA is still verified
    // - creatorB is still unverified
    // - creatorC is now verified
    // - creatorD is added and verified
    yield mx
        .nfts()
        .update({
        nftOrSft: nft,
        creators: [
            {
                address: creatorA.publicKey,
                share: 30,
            },
            {
                address: creatorB.publicKey,
                share: 20,
            },
            {
                address: creatorC.publicKey,
                authority: creatorC,
                share: 10,
            },
            {
                address: creatorD.publicKey,
                authority: creatorD,
                share: 40,
            },
        ],
    })
        .run();
    // Then the returned NFT should have the updated data.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated Nft',
        model: 'nft',
        creators: [
            {
                address: creatorA.publicKey,
                verified: true,
                share: 30,
            },
            {
                address: creatorB.publicKey,
                verified: false,
                share: 20,
            },
            {
                address: creatorC.publicKey,
                verified: true,
                share: 10,
            },
            {
                address: creatorD.publicKey,
                verified: true,
                share: 40,
            },
        ],
    });
}));
(0, tape_1.default)('[nftModule] it can set the parent Collection of an NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with no parent collection.
    const nft = yield (0, helpers_1.createNft)(mx);
    t.false(nft.collection, 'has no parent collection');
    // And a collection NFT with no items in it yet.
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx);
    (0, helpers_2.assertCollectionHasSize)(t, collectionNft, 0);
    // When we update that NFT by providing a parent collection.
    yield mx
        .nfts()
        .update({
        nftOrSft: nft,
        collection: collectionNft.address,
    })
        .run();
    // Then the updated NFT is now from that collection.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated NFT',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collectionNft.address),
            verified: false,
        },
    });
    // And the collection NFT has the same size because we did not verify it.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 0);
}));
(0, tape_1.default)('[nftModule] it can set and verify the parent Collection of an NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with no parent collection.
    const nft = yield (0, helpers_1.createNft)(mx);
    t.false(nft.collection, 'has no parent collection');
    // And a collection NFT with no items in it yet.
    const collectionAuthority = web3_js_1.Keypair.generate();
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx, {
        updateAuthority: collectionAuthority,
    });
    (0, helpers_2.assertCollectionHasSize)(t, collectionNft, 0);
    // When we update that NFT by providing a parent collection and its authority.
    yield mx
        .nfts()
        .update({
        nftOrSft: nft,
        collection: collectionNft.address,
        collectionAuthority: collectionAuthority,
    })
        .run();
    // Then the updated NFT is now from that collection and it is verified.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated NFT',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collectionNft.address),
            verified: true,
        },
    });
    // And the size of the collection NFT was incremented by 1.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 1);
}));
(0, tape_1.default)('[nftModule] it can set and verify the parent Collection of an NFT using a delegated authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with no parent collection.
    const nft = yield (0, helpers_1.createNft)(mx);
    t.false(nft.collection, 'has no parent collection');
    // And a collection NFT with delegated authority and no items in it yet.
    const delegatedCollectionAuthority = web3_js_1.Keypair.generate();
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx);
    (0, helpers_2.assertCollectionHasSize)(t, collectionNft, 0);
    yield mx
        .nfts()
        .approveCollectionAuthority({
        mintAddress: collectionNft.address,
        collectionAuthority: delegatedCollectionAuthority.publicKey,
    })
        .run();
    // When we update that NFT by providing a parent collection and its delegated authority.
    yield mx
        .nfts()
        .update({
        nftOrSft: nft,
        collection: collectionNft.address,
        collectionAuthority: delegatedCollectionAuthority,
        collectionAuthorityIsDelegated: true,
    })
        .run();
    // Then the updated NFT is now from that collection and it is verified.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated NFT',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collectionNft.address),
            verified: true,
        },
    });
    // And the size of the collection NFT was incremented by 1.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 1);
}));
(0, tape_1.default)('[nftModule] it can update the parent Collection of an NFT even when verified', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And two new collection NFTs A and B.
    const collectionNftA = yield (0, helpers_1.createCollectionNft)(mx);
    const collectionNftB = yield (0, helpers_1.createCollectionNft)(mx);
    // And an existing NFT with that belongs to collection A.
    const nft = yield (0, helpers_1.createNft)(mx, {
        collection: collectionNftA.address,
        collectionAuthority: mx.identity(),
    });
    t.true((_a = nft.collection) === null || _a === void 0 ? void 0 : _a.verified, 'has verified parent collection');
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNftA, 1);
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNftB, 0);
    // When we update that NFT so it is part of collection B.
    yield mx
        .nfts()
        .update({
        nftOrSft: nft,
        collection: collectionNftB.address,
        collectionAuthority: mx.identity(),
    })
        .run();
    // Then the updated NFT is now from collection B.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated NFT',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collectionNftB.address),
            verified: true,
        },
    });
    // And the collection size of both collections were updated.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNftA, 0);
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNftB, 1);
}));
(0, tape_1.default)('[nftModule] it can unset the parent Collection of an NFT even when verified', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with that belongs to a verified collection.
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, {
        collection: collectionNft.address,
        collectionAuthority: mx.identity(),
    });
    t.true((_b = nft.collection) === null || _b === void 0 ? void 0 : _b.verified, 'has verified parent collection');
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 1);
    // When we update that NFT by removing its parent collection.
    yield mx
        .nfts()
        .update({
        nftOrSft: nft,
        collection: null,
    })
        .run();
    // Then the updated NFT should now have no parent collection.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated NFT',
        model: 'nft',
        collection: null,
    });
    // And the size of the collection NFT was decremented by 1.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 0);
}));
//# sourceMappingURL=updateNft.test.js.map
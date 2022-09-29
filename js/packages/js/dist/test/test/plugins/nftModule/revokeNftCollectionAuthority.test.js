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
(0, tape_1.default)('[nftModule] it can revoke a collection authority for a given NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with an unverified collection.
    const collectionAuthority = web3_js_1.Keypair.generate();
    const collection = yield (0, helpers_1.createCollectionNft)(mx, {
        updateAuthority: collectionAuthority,
    });
    const nft = yield (0, helpers_1.createNft)(mx, {
        collection: collection.address,
    });
    t.true(nft.collection, 'nft has a collection');
    t.false((_a = nft.collection) === null || _a === void 0 ? void 0 : _a.verified, 'nft collection is not verified');
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collection, 0);
    // And a delegated collection authority for that collection.
    const delegatedCollectionAuthority = web3_js_1.Keypair.generate();
    yield mx
        .nfts()
        .approveCollectionAuthority({
        mintAddress: collection.address,
        collectionAuthority: delegatedCollectionAuthority.publicKey,
        updateAuthority: collectionAuthority,
    })
        .run();
    // When we revoke that authority.
    yield mx
        .nfts()
        .revokeCollectionAuthority({
        mintAddress: collection.address,
        collectionAuthority: delegatedCollectionAuthority.publicKey,
        revokeAuthority: collectionAuthority,
    })
        .run();
    // Then we expect an error when we try to verify the NFT using that delegated authority.
    const promise = mx
        .nfts()
        .verifyCollection({
        mintAddress: nft.address,
        collectionMintAddress: nft.collection.address,
        collectionAuthority: delegatedCollectionAuthority,
        isDelegated: true,
    })
        .run();
    yield (0, helpers_1.assertThrows)(t, promise, /Collection Update Authority is invalid/);
    // And the NFT collection should still be unverified.
    const refreshedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, refreshedNft, {
        $topic: 'Refreshed Nft',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collection.address),
            verified: false,
        },
    });
    // And the collection size should still be 0.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collection, 0);
}));
//# sourceMappingURL=revokeNftCollectionAuthority.test.js.map
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
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can fetch all NFTs from the first creator', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and two NFTs from two different creators.
    const mx = yield (0, helpers_1.metaplex)();
    const creatorA = web3_js_1.Keypair.generate().publicKey;
    const creatorB = web3_js_1.Keypair.generate().publicKey;
    const nftA = yield createNftWithFirstCreator(mx, 'NFT A', creatorA);
    const nftB = yield createNftWithFirstCreator(mx, 'NFT B', creatorB);
    // When we fetch the NFTs by creator A.
    const nftsA = (yield mx
        .nfts()
        .findAllByCreator({ creator: creatorA })
        .run());
    // Then we don't get the NFTs from creator B.
    t.same(nftsA.map((nft) => nft.name), ['NFT A']);
    t.same(nftsA[0].mintAddress, nftA.address);
    // And vice versa.
    const nftsB = (yield mx
        .nfts()
        .findAllByCreator({ creator: creatorB })
        .run());
    t.same(nftsB.map((nft) => nft.name), ['NFT B']);
    t.same(nftsB[0].mintAddress, nftB.address);
}));
(0, tape_1.default)('[nftModule] it can fetch all NFTs from other creator positions', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and two NFTs from two different creators on the second position.
    const mx = yield (0, helpers_1.metaplex)();
    const creatorA = web3_js_1.Keypair.generate().publicKey;
    const creatorB = web3_js_1.Keypair.generate().publicKey;
    const nftA = yield createNftWithSecondCreator(mx, 'NFT A', creatorA);
    const nftB = yield createNftWithSecondCreator(mx, 'NFT B', creatorB);
    // When we fetch the NFTs by second creator A.
    const nftsA = (yield mx
        .nfts()
        .findAllByCreator({ creator: creatorA, position: 2 })
        .run());
    // Then we don't get the NFTs from second creator B.
    t.same(nftsA.map((nft) => nft.name), ['NFT A']);
    t.same(nftsA[0].mintAddress, nftA.address);
    // And vice versa.
    const nftsB = (yield mx
        .nfts()
        .findAllByCreator({ creator: creatorB, position: 2 })
        .run());
    t.same(nftsB.map((nft) => nft.name), ['NFT B']);
    t.same(nftsB[0].mintAddress, nftB.address);
}));
const createNftWithFirstCreator = (mx, name, creator) => {
    return (0, helpers_1.createNft)(mx, {
        name,
        creators: [
            { address: creator, share: 50 },
            { address: mx.identity().publicKey, share: 50 },
        ],
    });
};
const createNftWithSecondCreator = (mx, name, creator) => {
    return (0, helpers_1.createNft)(mx, {
        name,
        creators: [
            { address: mx.identity().publicKey, share: 50 },
            { address: creator, share: 50 },
        ],
    });
};
//# sourceMappingURL=findNftsByCreator.test.js.map
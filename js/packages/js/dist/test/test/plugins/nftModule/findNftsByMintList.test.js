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
const index_1 = require("../../../src/index");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can fetch all NFTs from a provided mint list', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Given a metaplex instance and two NFTs on-chain.
    const mx = yield (0, helpers_1.metaplex)();
    const nftA = yield (0, helpers_1.createNft)(mx, { name: 'NFT A' });
    const nftB = yield (0, helpers_1.createNft)(mx, { name: 'NFT B' });
    // When we fetch these NFTs by mint addresses.
    const nfts = (yield mx
        .nfts()
        .findAllByMintList({ mints: [nftA.address, nftB.address] })
        .run());
    // Then we get the right NFTs.
    t.same(nfts.map((nft) => nft === null || nft === void 0 ? void 0 : nft.name), ['NFT A', 'NFT B']);
    t.same((_a = nfts[0]) === null || _a === void 0 ? void 0 : _a.mintAddress, nftA.address);
    t.same((_b = nfts[1]) === null || _b === void 0 ? void 0 : _b.mintAddress, nftB.address);
}));
(0, tape_1.default)('[nftModule] it returns null when an NFT is not found in a mint list', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and one NFT on-chain.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, { name: 'Some NFT' });
    // And two mint addresses with no NFT associated to them.
    const emptyMintA = web3_js_1.Keypair.generate().publicKey;
    const emptyMintB = web3_js_1.Keypair.generate().publicKey;
    // When we fetch NFTs matching all these addresses.
    const nfts = yield mx
        .nfts()
        .findAllByMintList({ mints: [emptyMintA, nft.address, emptyMintB] })
        .run();
    // Then we get null for mint not associated to any NFT.
    t.same(nfts.map((nft) => { var _a; return (_a = nft === null || nft === void 0 ? void 0 : nft.name) !== null && _a !== void 0 ? _a : null; }), [null, 'Some NFT', null]);
}));
(0, tape_1.default)('[nftModule] it returns Metadata models by default', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and an NFT on-chain.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, { name: 'Some NFT' });
    // When we fetch that NFT by providing an array of mint addresses.
    const [fetchedNft] = yield mx
        .nfts()
        .findAllByMintList({ mints: [nft.address] })
        .run();
    // Then the fetched NFT is a Metadata model.
    t.ok((0, index_1.isMetadata)(fetchedNft), 'is a lazy NFT');
}));
//# sourceMappingURL=findNftsByMintList.test.js.map
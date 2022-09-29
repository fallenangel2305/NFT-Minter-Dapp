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
(0, tape_1.default)('[nftModule] it can fetch an NFT by its mint address', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and an existing NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const mint = web3_js_1.Keypair.generate();
    const nft = yield (0, helpers_1.createNft)(mx, {
        useNewMint: mint,
        json: { name: 'Some NFT' },
    });
    // When we fetch that NFT using its mint address and its token address.
    const fetchedNft = (yield mx
        .nfts()
        .findByMint({
        mintAddress: nft.address,
        tokenAddress: nft.token.address,
    })
        .run());
    // Then we get the right NFT.
    t.same(fetchedNft.name, nft.name);
    t.same(fetchedNft.uri, nft.uri);
    t.same(fetchedNft.edition, nft.edition);
    t.ok(fetchedNft.address.equals(nft.address));
    t.ok(fetchedNft.metadataAddress.equals(nft.metadataAddress));
    t.ok(fetchedNft.mint.address.equals(nft.mint.address));
}));
(0, tape_1.default)('[nftModule] it can fetch an SFT by its mint address', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and an existing SFT.
    const mx = yield (0, helpers_1.metaplex)();
    const mint = web3_js_1.Keypair.generate();
    const sft = yield (0, helpers_1.createSft)(mx, {
        useNewMint: mint,
        json: { name: 'Some SFT' },
    });
    // When we fetch that SFT using its mint address.
    const fetchedSft = yield mx
        .nfts()
        .findByMint({ mintAddress: mint.publicKey })
        .run();
    // Then we get the right SFT.
    t.same(fetchedSft, sft);
}));
(0, tape_1.default)('[nftModule] it can fetch an NFT with an invalid URI', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT with an invalid URI.
    const mx = yield (0, helpers_1.metaplex)();
    const { nft } = yield mx
        .nfts()
        .create({
        name: 'Some NFT',
        sellerFeeBasisPoints: 200,
        uri: 'https://example.com/some/invalid/uri',
    })
        .run();
    // When we fetch that NFT using its mint address.
    const fetchedNft = yield mx
        .nfts()
        .findByMint({ mintAddress: nft.address })
        .run();
    // Then we get the right NFT.
    t.same(fetchedNft.address, nft.address);
    // And its metadata is empty.
    t.same(fetchedNft.json, null);
}));
//# sourceMappingURL=findNftByMint.test.js.map
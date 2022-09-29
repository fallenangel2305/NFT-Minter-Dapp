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
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can fetch all NFTs in a wallet', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and a connected wallet.
    const mx = yield (0, helpers_1.metaplex)();
    const owner = mx.identity().publicKey;
    // And two NFTs inside that wallets.
    const nftA = yield (0, helpers_1.createNft)(mx, { name: 'NFT A' });
    const nftB = yield (0, helpers_1.createNft)(mx, { name: 'NFT B' });
    // When we fetch all NFTs in the wallet.
    const nfts = (yield mx.nfts().findAllByOwner({ owner }).run());
    // Then we get the right NFTs.
    t.same(nfts.map((nft) => nft.name).sort(), ['NFT A', 'NFT B']);
    t.same(nfts.map((nft) => nft.mintAddress.toBase58()).sort(), [nftA.address.toBase58(), nftB.address.toBase58()].sort());
}));
//# sourceMappingURL=findNftsByOwner.test.js.map
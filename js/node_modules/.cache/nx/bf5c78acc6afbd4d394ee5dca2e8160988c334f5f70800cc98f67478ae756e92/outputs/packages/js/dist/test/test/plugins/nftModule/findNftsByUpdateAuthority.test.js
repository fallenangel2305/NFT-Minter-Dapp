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
const createNftWithAuthority = (mx, name, updateAuthority) => (0, helpers_1.createNft)(mx, { name, updateAuthority });
(0, tape_1.default)('[nftModule] it can fetch all NFTs for a given update authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and 2 wallet.
    const mx = yield (0, helpers_1.metaplex)();
    const walletA = web3_js_1.Keypair.generate();
    const walletB = web3_js_1.Keypair.generate();
    // Where wallet A is the update authority of NFT A and B but not C.
    const nftA = yield createNftWithAuthority(mx, 'NFT A', walletA);
    const nftB = yield createNftWithAuthority(mx, 'NFT B', walletA);
    yield createNftWithAuthority(mx, 'NFT C', walletB);
    // When we fetch all NFTs where wallet A is the authority.
    const nfts = (yield mx
        .nfts()
        .findAllByUpdateAuthority({ updateAuthority: walletA.publicKey })
        .run());
    // Then we get the right NFTs.
    t.same(nfts.map((nft) => nft.name).sort(), ['NFT A', 'NFT B']);
    t.same(nfts.map((nft) => nft.mintAddress.toBase58()).sort(), [nftA.address.toBase58(), nftB.address.toBase58()].sort());
}));
//# sourceMappingURL=findNftsByUpdateAuthority.test.js.map
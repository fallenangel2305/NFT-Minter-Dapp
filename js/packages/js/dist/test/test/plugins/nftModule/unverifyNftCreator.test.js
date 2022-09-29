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
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can unverify a creator', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing NFT with an verified creator.
    const creator = web3_js_1.Keypair.generate();
    const nft = yield (0, helpers_1.createNft)(mx, {
        creators: [
            {
                address: mx.identity().publicKey,
                share: 60,
            },
            {
                address: creator.publicKey,
                authority: creator,
                share: 40,
            },
        ],
    });
    t.ok(nft.creators[0].verified, 'update authority is verified');
    t.ok(nft.creators[1].verified, 'creator is verified');
    // When we unverify the creator.
    yield mx.nfts().unverifyCreator({ mintAddress: nft.address, creator }).run();
    // Then the returned NFT should have the updated data.
    const updatedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, updatedNft, {
        $topic: 'Updated Nft',
        model: 'nft',
        creators: [
            {
                address: mx.identity().publicKey,
                verified: true,
                share: 60,
            },
            {
                address: creator.publicKey,
                verified: false,
                share: 40,
            },
        ],
    });
}));
//# sourceMappingURL=unverifyNftCreator.test.js.map
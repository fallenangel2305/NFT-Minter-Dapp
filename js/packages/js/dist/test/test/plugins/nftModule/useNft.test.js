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
const spok_1 = __importDefault(require("spok"));
const index_1 = require("../../../src/index");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can use an NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT with 10 uses.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, {
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 10,
            total: 10,
        },
    });
    // When we use the NFT once.
    yield mx.nfts().use({ mintAddress: nft.address }).run();
    const usedNft = yield mx.nfts().refresh(nft).run();
    // Then the returned usable NFT should have one less use.
    (0, spok_1.default)(t, usedNft, {
        model: 'nft',
        $topic: 'Used NFT',
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: (0, helpers_1.spokSameBignum)(9),
            total: (0, helpers_1.spokSameBignum)(10),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can use an SFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing SFT with 10 uses.
    const mx = yield (0, helpers_1.metaplex)();
    const sft = yield (0, helpers_1.createSft)(mx, {
        tokenOwner: mx.identity().publicKey,
        tokenAmount: (0, index_1.token)(10),
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 10,
            total: 10,
        },
    });
    // When we use the NFT once.
    yield mx.nfts().use({ mintAddress: sft.address }).run();
    const usedSft = yield mx.nfts().refresh(sft).run();
    // Then the returned usable NFT should have one less use.
    (0, spok_1.default)(t, usedSft, {
        $topic: 'Used SFT',
        model: 'sft',
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: (0, helpers_1.spokSameBignum)(9),
            total: (0, helpers_1.spokSameBignum)(10),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can use an NFT multiple times', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT with 7 remaining uses.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, {
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 7,
            total: 10,
        },
    });
    // When we use the NFT 3 times.
    yield mx.nfts().use({ mintAddress: nft.address, numberOfUses: 3 }).run();
    const usedNft = yield mx.nfts().refresh(nft).run();
    // Then the returned NFT should have 4 remaining uses.
    (0, spok_1.default)(t, usedNft, {
        $topic: 'Used NFT',
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: (0, helpers_1.spokSameBignum)(4),
            total: (0, helpers_1.spokSameBignum)(10),
        },
    });
}));
(0, tape_1.default)('[nftModule] it only allows the owner to update the uses', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT with 10 remaining uses.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, {
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 10,
            total: 10,
        },
    });
    // And an another wallet that do not own that NFT.
    const anotherWallet = web3_js_1.Keypair.generate();
    // When this other wallet tries to use that NFT.
    const promise = mx
        .nfts()
        .use({ mintAddress: nft.address, owner: anotherWallet })
        .run();
    // Then we get an error.
    yield (0, helpers_1.assertThrows)(t, promise, /invalid account data for instruction/);
}));
(0, tape_1.default)('[nftModule] it cannot be used more times than the remaining uses', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT with 2 remaining uses.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, {
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 2,
            total: 10,
        },
    });
    // When this other wallet tries to use that NFT.
    const promise = mx
        .nfts()
        .use({ mintAddress: nft.address, numberOfUses: 3 })
        .run();
    // Then we get an error.
    yield (0, helpers_1.assertThrows)(t, promise, /There are not enough Uses left on this token/);
}));
//# sourceMappingURL=useNft.test.js.map
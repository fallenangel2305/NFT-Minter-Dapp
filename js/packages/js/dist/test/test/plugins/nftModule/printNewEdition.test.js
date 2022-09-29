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
const spok_1 = __importDefault(require("spok"));
const index_1 = require("../../../src/index");
const plugins_1 = require("../../../src/plugins");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can print a new edition from an original edition', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Original NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const originalNft = yield (0, helpers_1.createNft)(mx, {
        name: 'Original Nft On-Chain Name',
        maxSupply: (0, index_1.toBigNumber)(100),
        json: {
            name: 'Original Nft Name',
            description: 'Original Nft Description',
        },
    });
    // When we print a new edition of the NFT.
    const { nft: printNft, updatedSupply, tokenAddress, } = yield mx
        .nfts()
        .printNewEdition({ originalMint: originalNft.address })
        .run();
    // Then we created and returned the printed NFT with the right data.
    const expectedNft = {
        model: 'nft',
        name: 'Original Nft On-Chain Name',
        json: {
            name: 'Original Nft Name',
            description: 'Original Nft Description',
        },
        edition: {
            isOriginal: false,
            parent: (0, helpers_1.spokSamePubkey)(originalNft.edition.address),
            number: (0, helpers_1.spokSameBignum)(1),
        },
        token: {
            address: (0, helpers_1.spokSamePubkey)(tokenAddress),
            isAssociatedToken: true,
        },
    };
    (0, spok_1.default)(t, printNft, Object.assign({ $topic: 'nft' }, expectedNft));
    // And the data was stored in the blockchain.
    const retrievedNft = yield mx.nfts().refresh(printNft).run();
    (0, spok_1.default)(t, retrievedNft, Object.assign({ $topic: 'Retrieved Nft' }, expectedNft));
    // And the original NFT edition was updated.
    t.equals(updatedSupply.toNumber(), 1);
}));
(0, tape_1.default)('[nftModule] it keeps track of the edition number', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Original NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const originalNft = yield (0, helpers_1.createNft)(mx, { maxSupply: (0, index_1.toBigNumber)(100) });
    // When we print 3 new editions of the NFT.
    const input = { originalMint: originalNft.address };
    const { nft: printNft1 } = yield mx.nfts().printNewEdition(input).run();
    const { nft: printNft2 } = yield mx.nfts().printNewEdition(input).run();
    const { nft: printNft3 } = yield mx.nfts().printNewEdition(input).run();
    // Then each edition knows their number and are associated with the same parent.
    isPrintOfOriginal(t, printNft1, originalNft, 1);
    isPrintOfOriginal(t, printNft2, originalNft, 2);
    isPrintOfOriginal(t, printNft3, originalNft, 3);
}));
(0, tape_1.default)('[nftModule] it can print unlimited editions', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Original NFT with unlimited supply.
    const mx = yield (0, helpers_1.metaplex)();
    const originalNft = yield (0, helpers_1.createNft)(mx, { maxSupply: null });
    const originalEdition = originalNft.edition;
    (0, plugins_1.assertNftOriginalEdition)(originalEdition);
    t.equals(originalEdition.maxSupply, null);
    // When we print an edition of the NFT.
    const { nft: printNft } = yield mx
        .nfts()
        .printNewEdition({ originalMint: originalNft.address })
        .run();
    // Then we successfully printed the first NFT of an unlimited collection.
    isPrintOfOriginal(t, printNft, originalNft, 1);
}));
(0, tape_1.default)('[nftModule] it cannot print when the maxSupply is zero', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Original NFT with a maxSupply of zero.
    const mx = yield (0, helpers_1.metaplex)();
    const originalNft = yield (0, helpers_1.createNft)(mx, { maxSupply: (0, index_1.toBigNumber)(0) });
    // When we try to print an edition of the NFT.
    const promise = mx
        .nfts()
        .printNewEdition({ originalMint: originalNft.address })
        .run();
    // Then we should get an error.
    yield (0, helpers_1.assertThrows)(t, promise, /Maximum editions printed already/);
}));
const isPrintOfOriginal = (t, print, original, edition) => {
    (0, spok_1.default)(t, print, {
        $topic: 'print NFT #' + edition,
        edition: {
            parent: (0, helpers_1.spokSamePubkey)(original.edition.address),
            number: (0, helpers_1.spokSameBignum)(edition),
        },
    });
};
//# sourceMappingURL=printNewEdition.test.js.map
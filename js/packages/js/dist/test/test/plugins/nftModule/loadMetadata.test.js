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
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can load a Metadata model into an NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and a Metadata model.
    const mx = yield (0, helpers_1.metaplex)();
    const originalNft = yield (0, helpers_1.createNft)(mx, {
        name: 'On-chain Name',
        json: { name: 'Json Name' },
    });
    const metadata = yield asMetadata(mx, originalNft);
    // When we load that Metadata model.
    const nft = yield mx.nfts().load({ metadata }).run();
    // Then we get the fully loaded NFT model.
    (0, spok_1.default)(t, nft, {
        $topic: 'Loaded NFT',
        model: 'nft',
        address: (0, helpers_1.spokSamePubkey)(metadata.mintAddress),
        metadataAddress: (0, helpers_1.spokSamePubkey)(metadata.address),
        name: 'On-chain Name',
        json: {
            name: 'Json Name',
        },
        mint: {
            address: (0, helpers_1.spokSamePubkey)(metadata.mintAddress),
        },
        edition: {
            isOriginal: true,
        },
    });
}));
(0, tape_1.default)('[nftModule] it can load a Metadata model into an SFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and a Metadata model.
    const mx = yield (0, helpers_1.metaplex)();
    const originalSft = yield (0, helpers_1.createSft)(mx, {
        name: 'On-chain Name',
        json: { name: 'Json Name' },
    });
    const metadata = yield asMetadata(mx, originalSft);
    // When we load that Metadata model.
    const sft = yield mx.nfts().load({ metadata }).run();
    // Then we get the fully loaded SFT model.
    (0, spok_1.default)(t, sft, {
        $topic: 'Loaded SFT',
        model: 'sft',
        address: (0, helpers_1.spokSamePubkey)(metadata.mintAddress),
        metadataAddress: (0, helpers_1.spokSamePubkey)(metadata.address),
        name: 'On-chain Name',
        json: {
            name: 'Json Name',
        },
        mint: {
            address: (0, helpers_1.spokSamePubkey)(metadata.mintAddress),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can load a Metadata model into an NftWithToken', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a metaplex instance and a Metadata model.
    const mx = yield (0, helpers_1.metaplex)();
    const originalNft = yield (0, helpers_1.createNft)(mx, {
        name: 'On-chain Name',
        json: { name: 'Json Name' },
    });
    const metadata = yield asMetadata(mx, originalNft);
    // When we load that Metadata model and provide the token address
    const nft = yield mx
        .nfts()
        .load({ metadata, tokenAddress: originalNft.token.address })
        .run();
    // Then we get the fully loaded NFT model with Token information.
    (0, spok_1.default)(t, nft, {
        $topic: 'Loaded NFT',
        model: 'nft',
        address: (0, helpers_1.spokSamePubkey)(metadata.mintAddress),
        metadataAddress: (0, helpers_1.spokSamePubkey)(metadata.address),
        name: 'On-chain Name',
        json: {
            name: 'Json Name',
        },
        mint: {
            address: (0, helpers_1.spokSamePubkey)(metadata.mintAddress),
        },
        token: {
            address: (0, helpers_1.spokSamePubkey)(originalNft.token.address),
        },
        edition: {
            isOriginal: true,
        },
    });
}));
const asMetadata = (mx, nftOrSft) => __awaiter(void 0, void 0, void 0, function* () {
    const metadataAccount = (0, index_1.toMetadataAccount)(yield mx.rpc().getAccount(nftOrSft.metadataAddress));
    return (0, index_1.toMetadata)(metadataAccount);
});
//# sourceMappingURL=loadMetadata.test.js.map
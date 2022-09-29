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
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const spok_1 = __importDefault(require("spok"));
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] a delegated authority can thaw its NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing delegated NFT that's already frozen.
    const mx = yield (0, helpers_1.metaplex)();
    const delegateAuthority = web3_js_1.Keypair.generate();
    const nft = yield (0, helpers_1.createNft)(mx);
    yield mx
        .tokens()
        .approveDelegateAuthority({
        mintAddress: nft.address,
        delegateAuthority: delegateAuthority.publicKey,
    })
        .run();
    yield mx
        .nfts()
        .freezeDelegatedNft({ mintAddress: nft.address, delegateAuthority })
        .run();
    // When the delegated authority thaws the NFT.
    yield mx
        .nfts()
        .thawDelegatedNft({ mintAddress: nft.address, delegateAuthority })
        .run();
    // Then the token account for that NFT is thawed.
    const thawedNft = yield mx.nfts().refresh(nft).run();
    (0, spok_1.default)(t, thawedNft, {
        model: 'nft',
        $topic: 'Thawed NFT',
        token: {
            state: spl_token_1.AccountState.Initialized,
        },
    });
}));
(0, tape_1.default)('[nftModule] the owner of the NFT cannot thaw its own NFT without a delegated authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing delegated NFT that's already frozen.
    const mx = yield (0, helpers_1.metaplex)();
    const delegateAuthority = web3_js_1.Keypair.generate();
    const owner = web3_js_1.Keypair.generate();
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: owner.publicKey });
    yield mx
        .tokens()
        .approveDelegateAuthority({
        mintAddress: nft.address,
        delegateAuthority: delegateAuthority.publicKey,
        owner,
    })
        .run();
    yield mx
        .nfts()
        .freezeDelegatedNft({
        mintAddress: nft.address,
        delegateAuthority,
        tokenOwner: owner.publicKey,
    })
        .run();
    // When the owner tries to thaw the NFT.
    const promise = mx
        .nfts()
        .thawDelegatedNft({
        mintAddress: nft.address,
        delegateAuthority: owner,
        tokenOwner: owner.publicKey,
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /InvalidDelegate: All tokens in this account have not been delegated to this user/);
}));
//# sourceMappingURL=thawDelegatedNft.test.js.map
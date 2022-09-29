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
const index_1 = require("../../../src/index");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const spok_1 = __importDefault(require("spok"));
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can create an SFT with minimum configuration', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And we uploaded some metadata containing an image.
    const { uri, metadata } = yield mx
        .nfts()
        .uploadMetadata({
        name: 'JSON SFT name',
        description: 'JSON SFT description',
        image: (0, index_1.toMetaplexFile)('some_image', 'some-image.jpg'),
    })
        .run();
    // When we create a new SFT with minimum configuration.
    const { sft, mintAddress, metadataAddress } = yield mx
        .nfts()
        .createSft({
        uri,
        name: 'On-chain SFT name',
        sellerFeeBasisPoints: 200,
    })
        .run();
    // Then we created and returned the new SFT and it has appropriate defaults.
    const expectedSft = {
        model: 'sft',
        name: 'On-chain SFT name',
        uri,
        address: (0, helpers_1.spokSamePubkey)(mintAddress),
        metadataAddress: (0, helpers_1.spokSamePubkey)(metadataAddress),
        updateAuthorityAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
        mint: {
            model: 'mint',
            decimals: 0,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(0)),
            mintAuthorityAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
            freezeAuthorityAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
        },
        token: spok_1.default.notDefined,
        jsonLoaded: true,
        json: {
            name: 'JSON SFT name',
            description: 'JSON SFT description',
            image: metadata.image,
        },
        sellerFeeBasisPoints: 200,
        primarySaleHappened: false,
        creators: [
            {
                address: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
                share: 100,
                verified: true,
            },
        ],
        collection: null,
        uses: null,
    };
    (0, spok_1.default)(t, sft, Object.assign({ $topic: 'SFT' }, expectedSft));
    // And we get the same data when fetching a fresh instance of that SFT.
    const retrievedSft = yield mx
        .nfts()
        .findByMint({ mintAddress: sft.address })
        .run();
    (0, spok_1.default)(t, retrievedSft, Object.assign({ $topic: 'Retrieved SFT' }, expectedSft));
}));
(0, tape_1.default)('[nftModule] it can create an SFT with maximum configuration', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And a various keypairs for different access.
    const payer = yield (0, helpers_1.createWallet)(mx);
    const mint = web3_js_1.Keypair.generate();
    const collection = web3_js_1.Keypair.generate();
    const owner = web3_js_1.Keypair.generate();
    const mintAuthority = web3_js_1.Keypair.generate();
    const freezeAuthority = web3_js_1.Keypair.generate();
    const updateAuthority = web3_js_1.Keypair.generate();
    const otherCreator = web3_js_1.Keypair.generate();
    // When we create a new SFT with maximum configuration.
    const { sft } = yield mx
        .nfts()
        .createSft({
        uri: 'https://example.com/some-json-uri',
        name: 'On-chain SFT name',
        symbol: 'MYSFT',
        decimals: 2,
        sellerFeeBasisPoints: 456,
        isMutable: false,
        useNewMint: mint,
        tokenOwner: owner.publicKey,
        tokenAmount: (0, index_1.token)(4200),
        payer,
        mintAuthority,
        updateAuthority,
        freezeAuthority: freezeAuthority.publicKey,
        collection: collection.publicKey,
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Burn,
            remaining: 0,
            total: 1000,
        },
        creators: [
            {
                address: updateAuthority.publicKey,
                share: 60,
            },
            {
                address: otherCreator.publicKey,
                share: 40,
            },
        ],
    })
        .run();
    // Then the created SFT has the expected configuration.
    (0, spok_1.default)(t, sft, {
        $topic: 'SFT With Token',
        model: 'sft',
        uri: 'https://example.com/some-json-uri',
        name: 'On-chain SFT name',
        symbol: 'MYSFT',
        json: null,
        jsonLoaded: true,
        sellerFeeBasisPoints: 456,
        primarySaleHappened: false,
        updateAuthorityAddress: (0, helpers_1.spokSamePubkey)(updateAuthority.publicKey),
        mint: {
            model: 'mint',
            address: (0, helpers_1.spokSamePubkey)(mint.publicKey),
            decimals: 2,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(42, 2, 'MYSFT')),
            mintAuthorityAddress: (0, helpers_1.spokSamePubkey)(mintAuthority.publicKey),
            freezeAuthorityAddress: (0, helpers_1.spokSamePubkey)(freezeAuthority.publicKey),
        },
        token: {
            model: 'token',
            isAssociatedToken: true,
            mintAddress: (0, helpers_1.spokSamePubkey)(mint.publicKey),
            ownerAddress: (0, helpers_1.spokSamePubkey)(owner.publicKey),
            amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(42, 2, 'MYSFT')),
            closeAuthorityAddress: null,
            delegateAddress: null,
            delegateAmount: (0, index_1.token)(0, 2, 'MYSFT'),
        },
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collection.publicKey),
            verified: false,
        },
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Burn,
            remaining: (0, helpers_1.spokSameBignum)(0),
            total: (0, helpers_1.spokSameBignum)(1000),
        },
        creators: [
            {
                address: (0, helpers_1.spokSamePubkey)(updateAuthority.publicKey),
                share: 60,
                verified: true,
            },
            {
                address: (0, helpers_1.spokSamePubkey)(otherCreator.publicKey),
                share: 40,
                verified: false,
            },
        ],
    });
}));
(0, tape_1.default)('[nftModule] it can create an SFT from an existing mint', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing mint.
    const mintAuthority = web3_js_1.Keypair.generate();
    const { mint } = yield mx
        .tokens()
        .createMint({ decimals: 2, mintAuthority: mintAuthority.publicKey })
        .run();
    // When we create a new SFT from that mint.
    const { sft } = yield mx
        .nfts()
        .createSft(Object.assign(Object.assign({}, minimalInput()), { useExistingMint: mint.address, mintAuthority: mintAuthority, name: 'My SFT from an existing mint', symbol: 'MYSFT', decimals: 9 }))
        .run();
    // Then we created an SFT whilst keeping the provided mint.
    (0, spok_1.default)(t, sft, {
        $topic: 'SFT',
        model: 'sft',
        name: 'My SFT from an existing mint',
        symbol: 'MYSFT',
        mint: {
            model: 'mint',
            address: (0, helpers_1.spokSamePubkey)(mint.address),
            decimals: 2,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(0, 2, 'MYSFT')),
            mintAuthorityAddress: (0, helpers_1.spokSamePubkey)(mint.mintAuthorityAddress),
            freezeAuthorityAddress: (0, helpers_1.spokSamePubkey)(mint.freezeAuthorityAddress),
        },
        token: spok_1.default.notDefined,
    });
}));
(0, tape_1.default)('[nftModule] it can create an SFT with a new associated token', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we create a new SFT with a token account.
    const { sft } = yield mx
        .nfts()
        .createSft(Object.assign(Object.assign({}, minimalInput()), { tokenOwner: mx.identity().publicKey, tokenAmount: (0, index_1.token)(42) }))
        .run();
    // Then the created SFT has the expected configuration.
    (0, spok_1.default)(t, sft, {
        $topic: 'SFT',
        model: 'sft',
        mint: {
            model: 'mint',
            decimals: 0,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(42)),
        },
        token: {
            model: 'token',
            isAssociatedToken: true,
            ownerAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
            amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(42)),
            closeAuthorityAddress: null,
            delegateAddress: null,
            delegateAmount: (0, index_1.token)(0),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can create an SFT with a new non-associated token', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we create a new SFT with a non-associated token account.
    const tokenSigner = web3_js_1.Keypair.generate();
    const { sft } = yield mx
        .nfts()
        .createSft(Object.assign(Object.assign({}, minimalInput()), { tokenAddress: tokenSigner, tokenAmount: (0, index_1.token)(42) }))
        .run();
    // Then the created SFT has the expected configuration.
    (0, spok_1.default)(t, sft, {
        $topic: 'SFT',
        model: 'sft',
        mint: {
            model: 'mint',
            decimals: 0,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(42)),
        },
        token: {
            model: 'token',
            address: (0, helpers_1.spokSamePubkey)(tokenSigner.publicKey),
            isAssociatedToken: false,
            amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(42)),
            closeAuthorityAddress: null,
            delegateAddress: null,
            delegateAmount: (0, index_1.token)(0),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can create an SFT from an existing mint and mint to an existing token account', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And a token and a mint account.
    const tokenSigner = web3_js_1.Keypair.generate();
    const { token: existingToken } = yield mx
        .tokens()
        .createTokenWithMint({ token: tokenSigner })
        .run();
    const existingMint = existingToken.mint;
    // When we create a new SFT for that mint and mint to an existing token account.
    const { sft } = yield mx
        .nfts()
        .createSft(Object.assign(Object.assign({}, minimalInput()), { useExistingMint: existingMint.address, tokenAddress: tokenSigner, tokenAmount: (0, index_1.token)(42) }))
        .run();
    // Then the created SFT has the expected configuration.
    (0, spok_1.default)(t, sft, {
        $topic: 'SFT',
        model: 'sft',
        mint: {
            model: 'mint',
            address: (0, helpers_1.spokSamePubkey)(existingMint.address),
            decimals: 0,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(42)),
        },
        token: {
            model: 'token',
            address: (0, helpers_1.spokSamePubkey)(existingToken.address),
            isAssociatedToken: false,
            amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(42)),
            closeAuthorityAddress: null,
            delegateAddress: null,
            delegateAmount: (0, index_1.token)(0),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can create an SFT with additional verified creators', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance and 2 additional creators.
    const mx = yield (0, helpers_1.metaplex)();
    const creatorA = web3_js_1.Keypair.generate();
    const creatorB = web3_js_1.Keypair.generate();
    // When we create a new SFT with these creators as signers.
    const { sft } = yield mx
        .nfts()
        .createSft(Object.assign(Object.assign({}, minimalInput()), { creators: [
            {
                address: mx.identity().publicKey,
                share: 40,
            },
            {
                address: creatorA.publicKey,
                authority: creatorA,
                share: 35,
            },
            {
                address: creatorB.publicKey,
                authority: creatorB,
                share: 25,
            },
        ] }))
        .run();
    // Then the created SFT has all creators verified.
    (0, spok_1.default)(t, sft, {
        $topic: 'SFT',
        model: 'sft',
        creators: [
            {
                address: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
                share: 40,
                verified: true,
            },
            {
                address: (0, helpers_1.spokSamePubkey)(creatorA.publicKey),
                share: 35,
                verified: true,
            },
            {
                address: (0, helpers_1.spokSamePubkey)(creatorB.publicKey),
                share: 25,
                verified: true,
            },
        ],
    });
}));
const minimalInput = () => ({
    uri: 'https://example.com/some-json-uri',
    name: 'My NFT',
    sellerFeeBasisPoints: 200,
});
//# sourceMappingURL=createSft.test.js.map
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
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can create an NFT with minimum configuration', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And we uploaded some metadata containing an image.
    const { uri, metadata } = yield mx
        .nfts()
        .uploadMetadata({
        name: 'JSON NFT name',
        description: 'JSON NFT description',
        image: (0, index_1.toMetaplexFile)('some_image', 'some-image.jpg'),
    })
        .run();
    // When we create a new NFT with minimum configuration.
    const { nft, mintAddress, metadataAddress, masterEditionAddress, tokenAddress, } = yield mx
        .nfts()
        .create({
        uri,
        name: 'On-chain NFT name',
        sellerFeeBasisPoints: 500,
    })
        .run();
    // Then we created and returned the new NFT and it has appropriate defaults.
    const expectedNft = {
        model: 'nft',
        name: 'On-chain NFT name',
        uri,
        address: (0, helpers_1.spokSamePubkey)(mintAddress),
        mint: {
            model: 'mint',
            address: (0, helpers_1.spokSamePubkey)(mintAddress),
            decimals: 0,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(1)),
            mintAuthorityAddress: (0, helpers_1.spokSamePubkey)(masterEditionAddress),
            freezeAuthorityAddress: (0, helpers_1.spokSamePubkey)(masterEditionAddress),
        },
        token: {
            model: 'token',
            isAssociatedToken: true,
            mintAddress: (0, helpers_1.spokSamePubkey)(mintAddress),
            ownerAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
            amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(1)),
            closeAuthorityAddress: null,
            delegateAddress: null,
            delegateAmount: (0, helpers_1.spokSameAmount)((0, index_1.token)(0)),
        },
        metadataAddress: (0, helpers_1.spokSamePubkey)(metadataAddress),
        updateAuthorityAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
        json: {
            name: 'JSON NFT name',
            description: 'JSON NFT description',
            image: metadata.image,
        },
        sellerFeeBasisPoints: 500,
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
    (0, spok_1.default)(t, nft, Object.assign({ $topic: 'NFT' }, expectedNft));
    // And we get the same data when fetching a fresh instance of that NFT.
    const retrievedNft = yield mx
        .nfts()
        .findByMint({ mintAddress: nft.address, tokenAddress })
        .run();
    (0, spok_1.default)(t, retrievedNft, Object.assign({ $topic: 'Retrieved NFT' }, expectedNft));
}));
(0, tape_1.default)('[nftModule] it can create an NFT with maximum configuration', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And we uploaded some metadata.
    const { uri, metadata } = yield mx
        .nfts()
        .uploadMetadata({
        name: 'JSON NFT name',
        description: 'JSON NFT description',
        image: (0, index_1.toMetaplexFile)('some_image', 'some-image.jpg'),
    })
        .run();
    // And a various keypairs for different access.
    const payer = yield (0, helpers_1.createWallet)(mx);
    const mint = web3_js_1.Keypair.generate();
    const collection = web3_js_1.Keypair.generate();
    const owner = web3_js_1.Keypair.generate();
    const mintAuthority = web3_js_1.Keypair.generate();
    const updateAuthority = web3_js_1.Keypair.generate();
    const otherCreator = web3_js_1.Keypair.generate();
    // When we create a new NFT with minimum configuration.
    const { nft } = yield mx
        .nfts()
        .create({
        uri,
        name: 'On-chain NFT name',
        symbol: 'MYNFT',
        sellerFeeBasisPoints: 456,
        isMutable: true,
        maxSupply: (0, index_1.toBigNumber)(123),
        useNewMint: mint,
        payer,
        mintAuthority,
        updateAuthority,
        tokenOwner: owner.publicKey,
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
    // Then we created and retrieved the new NFT and it has appropriate defaults.
    (0, spok_1.default)(t, nft, {
        $topic: 'nft',
        model: 'nft',
        name: 'On-chain NFT name',
        symbol: 'MYNFT',
        uri,
        mint: {
            model: 'mint',
            address: (0, helpers_1.spokSamePubkey)(mint.publicKey),
            decimals: 0,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(1, 0, 'MYNFT')),
        },
        token: {
            model: 'token',
            isAssociatedToken: true,
            mintAddress: (0, helpers_1.spokSamePubkey)(mint.publicKey),
            ownerAddress: (0, helpers_1.spokSamePubkey)(owner.publicKey),
            amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(1, 0, 'MYNFT')),
            closeAuthorityAddress: null,
            delegateAddress: null,
            delegateAmount: (0, index_1.token)(0, 0, 'MYNFT'),
        },
        json: {
            name: 'JSON NFT name',
            description: 'JSON NFT description',
            image: metadata.image,
        },
        sellerFeeBasisPoints: 456,
        primarySaleHappened: false,
        updateAuthorityAddress: (0, helpers_1.spokSamePubkey)(updateAuthority.publicKey),
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
(0, tape_1.default)('[nftModule] it can create an NFT from an existing mint', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing mint.
    const mintAuthority = web3_js_1.Keypair.generate();
    const { mint } = yield mx
        .tokens()
        .createMint({
        decimals: 0,
        mintAuthority: mintAuthority.publicKey,
    })
        .run();
    // When we create a new SFT from that mint.
    const { nft, masterEditionAddress } = yield mx
        .nfts()
        .create(Object.assign(Object.assign({}, minimalInput()), { useExistingMint: mint.address, mintAuthority: mintAuthority, name: 'My NFT from an existing mint' }))
        .run();
    // Then we created an SFT whilst keeping the provided mint.
    (0, spok_1.default)(t, nft, {
        $topic: 'NFT',
        model: 'nft',
        name: 'My NFT from an existing mint',
        mint: {
            model: 'mint',
            address: (0, helpers_1.spokSamePubkey)(mint.address),
            decimals: 0,
            supply: (0, helpers_1.spokSameAmount)((0, index_1.token)(1)),
            mintAuthorityAddress: (0, helpers_1.spokSamePubkey)(masterEditionAddress),
            freezeAuthorityAddress: (0, helpers_1.spokSamePubkey)(masterEditionAddress),
        },
        token: {
            model: 'token',
            isAssociatedToken: true,
            mintAddress: (0, helpers_1.spokSamePubkey)(mint.address),
            ownerAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
            amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(1)),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can make another signer wallet pay for the storage and transaction fees', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    const initialIdentityBalance = yield mx.connection.getBalance(mx.identity().publicKey);
    // And a keypair that will pay for the storage.
    const payer = yield (0, helpers_1.createWallet)(mx, 1);
    t.equal(yield mx.connection.getBalance(payer.publicKey), 1000000000);
    // When we create a new NFT using that account as a payer.
    const { nft } = yield mx
        .nfts()
        .create(Object.assign(Object.assign({}, minimalInput()), { payer }))
        .run();
    // Then the payer has less lamports than it used to.
    t.ok((yield mx.connection.getBalance(payer.publicKey)) < 1000000000);
    // And the identity did not lose any lamports.
    t.equal(yield mx.connection.getBalance(mx.identity().publicKey), initialIdentityBalance);
    // And the NFT was successfully created.
    (0, spok_1.default)(t, nft, { $topic: 'NFT', model: 'nft' });
}));
(0, tape_1.default)('[nftModule] it can create an NFT with an invalid URI', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we create an NFT with an invalid URI.
    const { nft } = yield mx
        .nfts()
        .create(Object.assign(Object.assign({}, minimalInput()), { uri: 'https://example.com/some/invalid/uri' }))
        .run();
    // Then the NFT was created successfully.
    t.equal(nft.model, 'nft');
    t.equal(nft.uri, 'https://example.com/some/invalid/uri');
    // But its JSON metadata is null.
    t.equal(nft.json, null);
}));
(0, tape_1.default)('[nftModule] it can create a collection NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we create a collection NFT.
    const { nft } = yield mx
        .nfts()
        .create(Object.assign(Object.assign({}, minimalInput()), { isCollection: true }))
        .run();
    // Then the created NFT is a sized collection.
    (0, spok_1.default)(t, nft, {
        $topic: 'NFT',
        model: 'nft',
        collectionDetails: {
            version: 'V1',
            size: (0, helpers_1.spokSameBignum)(0),
        },
    });
}));
(0, tape_1.default)('[nftModule] it can create an NFT with a parent Collection', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a collection NFT
    const mx = yield (0, helpers_1.metaplex)();
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx);
    (0, helpers_2.assertCollectionHasSize)(t, collectionNft, 0);
    // When we create a new NFT with this collection as a parent.
    const { nft } = yield mx
        .nfts()
        .create(Object.assign(Object.assign({}, minimalInput()), { collection: collectionNft.address }))
        .run();
    // Then the created NFT is from that collection.
    (0, spok_1.default)(t, nft, {
        $topic: 'NFT',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collectionNft.address),
            verified: false,
        },
    });
    // And the collection NFT has the same size because we did not verify it.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 0);
}));
(0, tape_1.default)('[nftModule] it can create an NFT with a verified parent Collection', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a collection NFT with an explicit update authority.
    const mx = yield (0, helpers_1.metaplex)();
    const collectionUpdateAuthority = web3_js_1.Keypair.generate();
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx, {
        updateAuthority: collectionUpdateAuthority,
    });
    (0, helpers_2.assertCollectionHasSize)(t, collectionNft, 0);
    // When we create a new NFT with this collection as a parent and with its update authority.
    const { nft } = yield mx
        .nfts()
        .create(Object.assign(Object.assign({}, minimalInput()), { collection: collectionNft.address, collectionAuthority: collectionUpdateAuthority }))
        .run();
    // Then the created NFT is from that collection and it is verified.
    (0, spok_1.default)(t, nft, {
        $topic: 'NFT',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collectionNft.address),
            verified: true,
        },
    });
    // And the collection NFT size has been increase by 1.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 1);
}));
(0, tape_1.default)('[nftModule] it can create an NFT with a verified parent Collection using a delegated authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a collection NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx);
    (0, helpers_2.assertCollectionHasSize)(t, collectionNft, 0);
    // And a delegated collection authority for that collection NFT.
    const collectionDelegatedAuthority = web3_js_1.Keypair.generate();
    yield mx
        .nfts()
        .approveCollectionAuthority({
        mintAddress: collectionNft.address,
        collectionAuthority: collectionDelegatedAuthority.publicKey,
    })
        .run();
    // When we create a new NFT with this collection as a parent using the delegated authority.
    const { nft } = yield mx
        .nfts()
        .create(Object.assign(Object.assign({}, minimalInput()), { collection: collectionNft.address, collectionAuthority: collectionDelegatedAuthority, collectionAuthorityIsDelegated: true }))
        .run();
    // Then the created NFT is from that collection and it is verified.
    (0, spok_1.default)(t, nft, {
        $topic: 'NFT',
        model: 'nft',
        collection: {
            address: (0, helpers_1.spokSamePubkey)(collectionNft.address),
            verified: true,
        },
    });
    // And the collection NFT size has been increase by 1.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 1);
}));
const minimalInput = () => ({
    uri: 'https://example.com/some-json-uri',
    name: 'My NFT',
    sellerFeeBasisPoints: 200,
});
/*
 * Regression test.
 * @see https://github.com/metaplex-foundation/metaplex-program-library/issues/383
 */
(0, tape_1.default)('[nftModule] it works when we give an explicit payer for the create metadata ix only', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have everything we need to create a Metadata account.
    const mx = yield (0, helpers_1.metaplex)();
    const mint = web3_js_1.Keypair.generate();
    const metadata = (0, index_1.findMetadataPda)(mint.publicKey);
    const edition = (0, index_1.findEditionPda)(mint.publicKey);
    const { uri } = yield mx
        .nfts()
        .uploadMetadata({ name: 'Metadata Name' })
        .run();
    const data = {
        name: 'My NFT',
        symbol: 'MNFT',
        sellerFeeBasisPoints: 10,
        uri,
        creators: [
            {
                address: mx.identity().publicKey,
                share: 100,
                verified: false,
            },
        ],
        collection: null,
        uses: null,
    };
    // And an explicit payer account that is only used to pay for the Metadata account storage.
    const explicitPayer = web3_js_1.Keypair.generate();
    yield helpers_1.amman.airdrop(mx.connection, explicitPayer.publicKey, 1);
    // When we assemble that transaction.
    const tx = index_1.TransactionBuilder.make()
        .add(yield mx
        .tokens()
        .builders()
        .createTokenWithMint({
        initialSupply: (0, index_1.token)(1),
        mint,
        payer: mx.identity(),
    }))
        .add({
        instruction: (0, mpl_token_metadata_1.createCreateMetadataAccountV2Instruction)({
            metadata,
            mint: mint.publicKey,
            mintAuthority: mx.identity().publicKey,
            payer: explicitPayer.publicKey,
            updateAuthority: mx.identity().publicKey,
        }, { createMetadataAccountArgsV2: { data, isMutable: false } }),
        signers: [explicitPayer],
    })
        .add({
        instruction: (0, mpl_token_metadata_1.createCreateMasterEditionV3Instruction)({
            edition,
            mint: mint.publicKey,
            updateAuthority: mx.identity().publicKey,
            mintAuthority: mx.identity().publicKey,
            payer: explicitPayer.publicKey,
            metadata,
        }, {
            createMasterEditionArgs: { maxSupply: 0 },
        }),
        signers: [explicitPayer],
    });
    // And send it with confirmation.
    yield mx.rpc().sendAndConfirmTransaction(tx);
    // Then the transaction succeeded and the NFT was created.
    const nft = yield mx.nfts().findByMint({ mintAddress: mint.publicKey }).run();
    t.equal(nft.name, 'My NFT');
    t.equal(nft.metadataAddress.toBase58(), metadata.toBase58());
}));
//# sourceMappingURL=createNft.test.js.map
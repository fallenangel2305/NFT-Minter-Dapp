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
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
const index_1 = require("../../../src/index");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[candyMachineModule] it can mint from candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with 2 items.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        itemsAvailable: (0, index_1.toBigNumber)(2),
        symbol: 'CANDY',
        sellerFeeBasisPoints: 123,
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            { name: 'Degen #2', uri: 'https://example.com/degen/2' },
        ],
    });
    // When we mint an NFT from the candy machine.
    const { nft } = yield mx.candyMachines().mint({ candyMachine }).run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then an NFT was created with the right data.
    (0, spok_1.default)(t, nft, {
        $topic: 'Minted NFT',
        model: 'nft',
        name: 'Degen #1',
        symbol: 'CANDY',
        uri: 'https://example.com/degen/1',
        sellerFeeBasisPoints: 123,
        tokenStandard: mpl_token_metadata_1.TokenStandard.NonFungible,
        isMutable: true,
        primarySaleHappened: true,
        updateAuthorityAddress: (0, helpers_1.spokSamePubkey)(candyMachine.authorityAddress),
        creators: [
            {
                address: (0, helpers_1.spokSamePubkey)((0, index_1.findCandyMachineCreatorPda)(candyMachine.address)),
                verified: true,
                share: 0,
            },
            {
                address: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
                verified: false,
                share: 100,
            },
        ],
        edition: {
            model: 'nftEdition',
            isOriginal: true,
            supply: (0, helpers_1.spokSameBignum)((0, index_1.toBigNumber)(0)),
            maxSupply: (0, helpers_1.spokSameBignum)((0, index_1.toBigNumber)(0)),
        },
    });
    // And the Candy Machine data was updated.
    (0, spok_1.default)(t, updatedCandyMachine, {
        $topic: 'Update Candy Machine',
        itemsAvailable: (0, helpers_1.spokSameBignum)((0, index_1.toBigNumber)(2)),
        itemsMinted: (0, helpers_1.spokSameBignum)((0, index_1.toBigNumber)(1)),
        itemsRemaining: (0, helpers_1.spokSameBignum)((0, index_1.toBigNumber)(1)),
    });
}));
(0, tape_1.default)('[candyMachineModule] it can mint from candy machine with a collection', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine with a set Collection.
    const mx = yield (0, helpers_1.metaplex)();
    const collection = yield (0, helpers_1.createNft)(mx);
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        goLiveDate: (0, index_1.toDateTime)((0, index_1.now)().subn(24 * 60 * 60)),
        itemsAvailable: (0, index_1.toBigNumber)(1),
        collection: collection.address,
        items: [{ name: 'Degen #1', uri: 'https://example.com/degen/1' }],
    });
    // When we mint an NFT from that candy machine.
    const { nft } = yield mx.candyMachines().mint({ candyMachine }).run();
    // Then an NFT was created.
    (0, spok_1.default)(t, nft, {
        $topic: 'Minted NFT',
        model: 'nft',
        name: 'Degen #1',
        collection: {
            verified: true,
            address: (0, helpers_1.spokSamePubkey)(collection.address),
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] it can mint from candy machine as another payer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a loaded Candy Machine
    const mx = yield (0, helpers_1.metaplex)();
    const payer = yield (0, helpers_1.createWallet)(mx);
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        goLiveDate: (0, index_1.toDateTime)((0, index_1.now)().subn(24 * 60 * 60)),
        itemsAvailable: (0, index_1.toBigNumber)(1),
        symbol: 'CANDY',
        sellerFeeBasisPoints: 123,
        items: [{ name: 'Degen #1', uri: 'https://example.com/degen/1' }],
    });
    // When we mint an NFT from the candy machine.
    const { nft } = yield mx
        .candyMachines()
        .mint({ candyMachine, payer, newOwner: payer.publicKey })
        .run();
    // Then an NFT was created with the right data.
    (0, spok_1.default)(t, nft, {
        $topic: 'Minted NFT',
        model: 'nft',
        name: 'Degen #1',
    });
    // And it belongs to the payer.
    const nftTokenHolder = yield mx
        .tokens()
        .findTokenWithMintByMint({
        mint: nft.address,
        address: payer.publicKey,
        addressType: 'owner',
    })
        .run();
    t.ok(nftTokenHolder.ownerAddress.equals(payer.publicKey), 'NFT belongs to the payer');
}));
(0, tape_1.default)('[candyMachineModule] it can mint from candy machine with an SPL treasury', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a mint accounts with two token accounts:
    // - One for the payer with an initial supply of 10 tokens "payerTokenAccount".
    // - One for the candy machine "treasuryTokenAccount".
    const mx = yield (0, helpers_1.metaplex)();
    const payer = yield (0, helpers_1.createWallet)(mx);
    const { token: payerTokenAccount } = yield mx
        .tokens()
        .createTokenWithMint({ initialSupply: (0, index_1.token)(10), owner: payer.publicKey })
        .run();
    const mintTreasury = payerTokenAccount.mint;
    const { token: treasuryTokenAccount } = yield mx
        .tokens()
        .createToken({ mint: mintTreasury.address })
        .run();
    // And given a Candy Machine with all of these settings.
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        price: (0, index_1.token)(5),
        goLiveDate: (0, index_1.toDateTime)((0, index_1.now)().subn(24 * 60 * 60)),
        itemsAvailable: (0, index_1.toBigNumber)(2),
        symbol: 'CANDY',
        sellerFeeBasisPoints: 123,
        tokenMint: mintTreasury.address,
        wallet: treasuryTokenAccount.address,
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            { name: 'Degen #2', uri: 'https://example.com/degen/2' },
        ],
    });
    // When we mint an NFT from that candy machine.
    const { nft } = yield mx
        .candyMachines()
        .mint({ candyMachine, payer, newOwner: payer.publicKey })
        .run();
    // Then an NFT was created.
    (0, spok_1.default)(t, nft, {
        $topic: 'Minted NFT',
        model: 'nft',
        name: 'Degen #1',
    });
    // And the payer token account was debited.
    const updatedPayerTokenAccount = yield mx
        .tokens()
        .findTokenByAddress({ address: payerTokenAccount.address })
        .run();
    t.equal(updatedPayerTokenAccount.amount.basisPoints.toNumber(), 5, 'Payer token account was debited');
}));
(0, tape_1.default)('[candyMachineModule] it can mint from candy machine even when we max out the instructions needed', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a mint accounts with two token accounts:
    // - One for the payer with an initial supply of 10 tokens "payerTokenAccount".
    // - One for the candy machine "treasuryTokenAccount".
    const mx = yield (0, helpers_1.metaplex)();
    const payer = yield (0, helpers_1.createWallet)(mx);
    const { token: payerTokenAccount } = yield mx
        .tokens()
        .createTokenWithMint({ initialSupply: (0, index_1.token)(10), owner: payer.publicKey })
        .run();
    const mintTreasury = payerTokenAccount.mint;
    const { token: treasuryTokenAccount } = yield mx
        .tokens()
        .createToken({ mint: mintTreasury.address })
        .run();
    // And the following whitelist settings.
    const { token: payerWhitelistTokenAccount } = yield mx
        .tokens()
        .createTokenWithMint({ initialSupply: (0, index_1.token)(1), owner: payer.publicKey })
        .run();
    const whitelistMintSettings = {
        mode: mpl_candy_machine_1.WhitelistMintMode.BurnEveryTime,
        mint: payerWhitelistTokenAccount.mint.address,
        presale: false,
        discountPrice: null,
    };
    // And the following collection.
    const collection = yield (0, helpers_1.createNft)(mx);
    // And given a Candy Machine with all of these settings.
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        price: (0, index_1.token)(5),
        goLiveDate: (0, index_1.toDateTime)((0, index_1.now)().subn(24 * 60 * 60)),
        itemsAvailable: (0, index_1.toBigNumber)(2),
        symbol: 'CANDY',
        sellerFeeBasisPoints: 123,
        tokenMint: mintTreasury.address,
        wallet: treasuryTokenAccount.address,
        whitelistMintSettings,
        collection: collection.address,
        items: [
            { name: 'Degen #1', uri: 'https://example.com/degen/1' },
            { name: 'Degen #2', uri: 'https://example.com/degen/2' },
        ],
    });
    // When we mint an NFT from that candy machine.
    const { nft } = yield mx
        .candyMachines()
        .mint({ candyMachine, payer, newOwner: payer.publicKey })
        .run();
    // Then an NFT was created.
    (0, spok_1.default)(t, nft, {
        $topic: 'Minted NFT',
        model: 'nft',
        name: 'Degen #1',
    });
}));
//# sourceMappingURL=mintCandyMachine.test.js.map
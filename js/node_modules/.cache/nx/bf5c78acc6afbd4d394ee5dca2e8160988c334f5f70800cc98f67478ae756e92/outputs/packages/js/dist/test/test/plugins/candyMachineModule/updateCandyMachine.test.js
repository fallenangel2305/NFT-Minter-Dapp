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
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const web3_js_1 = require("@solana/web3.js");
const spok_1 = __importDefault(require("spok"));
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[candyMachineModule] it can update the data of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        price: (0, index_1.sol)(1),
        sellerFeeBasisPoints: 100,
        itemsAvailable: (0, index_1.toBigNumber)(100),
        symbol: 'OLD',
        maxEditionSupply: (0, index_1.toBigNumber)(0),
        isMutable: true,
        retainAuthority: true,
        goLiveDate: (0, index_1.toDateTime)(1000000000),
    });
    // When we update the Candy Machine with the following data.
    const creatorA = web3_js_1.Keypair.generate();
    const creatorB = web3_js_1.Keypair.generate();
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        authority: mx.identity(),
        price: (0, index_1.sol)(2),
        sellerFeeBasisPoints: 200,
        itemsAvailable: (0, index_1.toBigNumber)(100),
        symbol: 'NEW',
        maxEditionSupply: (0, index_1.toBigNumber)(1),
        isMutable: false,
        retainAuthority: false,
        goLiveDate: (0, index_1.toDateTime)(2000000000),
        creators: [
            { address: creatorA.publicKey, verified: false, share: 50 },
            { address: creatorB.publicKey, verified: false, share: 50 },
        ],
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        $topic: 'Updated Candy Machine',
        authorityAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
        price: (0, helpers_1.spokSameAmount)((0, index_1.sol)(2)),
        sellerFeeBasisPoints: 200,
        itemsAvailable: (0, helpers_1.spokSameBignum)(100),
        symbol: 'NEW',
        maxEditionSupply: (0, helpers_1.spokSameBignum)(1),
        isMutable: false,
        retainAuthority: false,
        goLiveDate: (0, helpers_1.spokSameBignum)(2000000000),
        creators: [
            {
                address: (0, helpers_1.spokSamePubkey)(creatorA.publicKey),
                verified: false,
                share: 50,
            },
            {
                address: (0, helpers_1.spokSamePubkey)(creatorB.publicKey),
                verified: false,
                share: 50,
            },
        ],
    });
}));
(0, tape_1.default)('[candyMachineModule] it can update the itemsAvailable of a candy machine with hidden settings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with hidden settings.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        itemsAvailable: (0, index_1.toBigNumber)(100),
        hiddenSettings: {
            hash: (0, helpers_2.create32BitsHash)('cache-file'),
            name: 'mint-name',
            uri: 'https://example.com',
        },
    });
    // When we update the items available of a Candy Machine.
    yield mx
        .candyMachines()
        .update({ candyMachine, itemsAvailable: (0, index_1.toBigNumber)(200) })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    t.equals(updatedCandyMachine.itemsAvailable.toNumber(), 200);
}));
(0, tape_1.default)('[candyMachineModule] it can update the hidden settings of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with hidden settings.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        hiddenSettings: {
            hash: (0, helpers_2.create32BitsHash)('cache-file'),
            name: 'mint-name',
            uri: 'https://example.com',
        },
    });
    // When we update these hidden settings.
    const newHash = (0, helpers_2.create32BitsHash)('new-cache-file');
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        hiddenSettings: {
            hash: newHash,
            name: 'new-mint-name',
            uri: 'https://example.com/new',
        },
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        hiddenSettings: {
            hash: newHash,
            name: 'new-mint-name',
            uri: 'https://example.com/new',
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] it can add hidden settings to a candy machine that have zero items available', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine without hidden settings and without items.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        itemsAvailable: (0, index_1.toBigNumber)(0),
        hiddenSettings: null,
    });
    // When we add hidden settings to the Candy Machine.
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        authority: mx.identity(),
        hiddenSettings: {
            hash: (0, helpers_2.create32BitsHash)('cache-file'),
            name: 'mint-name',
            uri: 'https://example.com',
        },
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        hiddenSettings: {
            hash: (0, helpers_2.create32BitsHash)('cache-file'),
            name: 'mint-name',
            uri: 'https://example.com',
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] it can update the end settings of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with end settings.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        endSettings: {
            endSettingType: mpl_candy_machine_1.EndSettingType.Amount,
            number: (0, index_1.toBigNumber)(100),
        },
    });
    // When we update these end settings.
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        endSettings: {
            endSettingType: mpl_candy_machine_1.EndSettingType.Date,
            date: (0, index_1.toDateTime)(1000000000),
        },
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        endSettings: {
            endSettingType: mpl_candy_machine_1.EndSettingType.Date,
            date: (0, helpers_1.spokSameBignum)(1000000000),
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] it can update the whitelist settings of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with whitelist settings.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        whitelistMintSettings: {
            mode: mpl_candy_machine_1.WhitelistMintMode.BurnEveryTime,
            mint: web3_js_1.Keypair.generate().publicKey,
            presale: true,
            discountPrice: (0, index_1.sol)(0.5),
        },
    });
    // When we update these whitelist settings.
    const newWhitelistMint = web3_js_1.Keypair.generate().publicKey;
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        whitelistMintSettings: {
            mode: mpl_candy_machine_1.WhitelistMintMode.NeverBurn,
            mint: newWhitelistMint,
            presale: false,
            discountPrice: (0, index_1.sol)(0),
        },
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        whitelistMintSettings: {
            mode: mpl_candy_machine_1.WhitelistMintMode.NeverBurn,
            mint: (0, helpers_1.spokSamePubkey)(newWhitelistMint),
            presale: false,
            discountPrice: (0, helpers_1.spokSameAmount)((0, index_1.sol)(0)),
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] it can update the gatekeeper of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with a gatekeeper.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        gatekeeper: {
            network: web3_js_1.Keypair.generate().publicKey,
            expireOnUse: true,
        },
    });
    // When we update the gatekeeper of the Candy Machine.
    const newGatekeeperNetwork = web3_js_1.Keypair.generate().publicKey;
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        gatekeeper: {
            network: newGatekeeperNetwork,
            expireOnUse: false,
        },
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        gatekeeper: {
            gatekeeperNetwork: (0, helpers_1.spokSamePubkey)(newGatekeeperNetwork),
            expireOnUse: false,
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] it can update the authority of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const authority = web3_js_1.Keypair.generate();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        authority: authority.publicKey,
    });
    // When we update the authority of the Candy Machine.
    const newAuthority = web3_js_1.Keypair.generate();
    yield mx
        .candyMachines()
        .update({ candyMachine, authority, newAuthority: newAuthority.publicKey })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    t.ok(updatedCandyMachine.authorityAddress.equals(newAuthority.publicKey));
}));
(0, tape_1.default)('[candyMachineModule] it cannot update the authority of a candy machine to the same authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const authority = web3_js_1.Keypair.generate();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        authority: authority.publicKey,
    });
    // When we update the authority of the Candy Machine with the same authority.
    const promise = mx
        .candyMachines()
        .update({ candyMachine, authority, newAuthority: authority.publicKey })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /No Instructions To Send/);
}));
(0, tape_1.default)('[candyMachineModule] it sends no transaction if nothing has changed when updating a candy machine.', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx);
    // When we send an update without providing any changes.
    const builder = mx.candyMachines().builders().update({ candyMachine });
    // Then we expect no transaction to be sent.
    t.equals(builder.getInstructionsWithSigners().length, 0, 'has zero instructions');
}));
(0, tape_1.default)('[candyMachineModule] it throws an error if nothing has changed when updating a candy machine.', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx);
    // When we send an update without providing any changes.
    const promise = mx.candyMachines().update({ candyMachine }).run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /No Instructions To Send/);
}));
(0, tape_1.default)('[candyMachineModule] it can update the treasury of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Given an existing Candy Machine with a SOL treasury.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        wallet: mx.identity().publicKey,
    });
    // And an existing SPL token.
    const { token } = yield mx.tokens().createTokenWithMint().run();
    // When we update the treasury of the Candy Machine to use that SPL token.
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        wallet: token.address,
        tokenMint: token.mint.address,
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    t.ok(updatedCandyMachine.walletAddress.equals(token.address));
    t.ok((_a = updatedCandyMachine.tokenMintAddress) === null || _a === void 0 ? void 0 : _a.equals(token.mint.address));
}));
(0, tape_1.default)('[candyMachineModule] it can set the collection of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine without a collection.
    const mx = yield (0, helpers_1.metaplex)();
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        collection: null,
    });
    // When we update the Candy Machine with a new collection NFT.
    const collectionNft = yield (0, helpers_1.createNft)(mx);
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        authority: mx.identity(),
        newCollection: collectionNft.address,
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        $topic: 'Updated Candy Machine',
        collectionMintAddress: (0, helpers_1.spokSamePubkey)(collectionNft.address),
    });
}));
(0, tape_1.default)('[candyMachineModule] it can update the collection of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with a collection.
    const mx = yield (0, helpers_1.metaplex)();
    const collectionNft = yield (0, helpers_1.createNft)(mx);
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        collection: collectionNft.address,
    });
    // When we update the Candy Machine with a new collection.
    const newCollectionNft = yield (0, helpers_1.createNft)(mx);
    yield mx
        .candyMachines()
        .update({
        candyMachine,
        authority: mx.identity(),
        newCollection: newCollectionNft.address,
    })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        $topic: 'Updated Candy Machine',
        collectionMintAddress: (0, helpers_1.spokSamePubkey)(newCollectionNft.address),
    });
}));
(0, tape_1.default)('[candyMachineModule] it can remove the collection of a candy machine', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with a collection.
    const mx = yield (0, helpers_1.metaplex)();
    const collectionNft = yield (0, helpers_1.createNft)(mx);
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        collection: collectionNft.address,
    });
    // When we remove the collection of that Candy Machine.
    yield mx
        .candyMachines()
        .update({ candyMachine, authority: mx.identity(), newCollection: null })
        .run();
    const updatedCandyMachine = yield mx
        .candyMachines()
        .refresh(candyMachine)
        .run();
    // Then the Candy Machine has been updated properly.
    (0, spok_1.default)(t, updatedCandyMachine, {
        $topic: 'Updated Candy Machine',
        collectionMintAddress: null,
    });
}));
(0, tape_1.default)('[candyMachineModule] it keeps the same collection when the new collection is undefined', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Candy Machine with a collection.
    const mx = yield (0, helpers_1.metaplex)();
    const collectionNft = yield (0, helpers_1.createNft)(mx);
    const { candyMachine } = yield (0, helpers_2.createCandyMachine)(mx, {
        collection: collectionNft.address,
    });
    // When we try to update the Candy Machine with an undefined collection.
    const promise = mx
        .candyMachines()
        .update({
        candyMachine,
        authority: mx.identity(),
        newCollection: undefined,
    })
        .run();
    // Then we have no instruction to send.
    yield (0, helpers_1.assertThrows)(t, promise, /No Instructions To Send/);
}));
//# sourceMappingURL=updateCandyMachine.test.js.map
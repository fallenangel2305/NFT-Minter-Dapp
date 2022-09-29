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
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const mx = yield (0, helpers_1.metaplex)();
        const tc = helpers_1.amman.transactionChecker(mx.connection);
        const client = mx.candyMachines();
        const minimalInput = {
            price: (0, index_1.sol)(1),
            sellerFeeBasisPoints: 500,
            itemsAvailable: (0, index_1.toBigNumber)(100),
        };
        return { mx, tc, client, minimalInput };
    });
}
(0, tape_1.default)('[candyMachineModule] create with minimal input', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client.
    const { tc, mx, client } = yield init();
    // When we create that Candy Machine
    const { response, candyMachine } = yield client
        .create({
        price: (0, index_1.sol)(1.25),
        sellerFeeBasisPoints: 500,
        itemsAvailable: (0, index_1.toBigNumber)(100),
    })
        .run();
    // Then we created the Candy Machine as configured
    yield tc.assertSuccess(t, response.signature);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        programAddress: (0, helpers_1.spokSamePubkey)(index_1.CandyMachineProgram.publicKey),
        version: 2,
        tokenMintAddress: null,
        collectionMintAddress: null,
        uuid: (0, index_1.getCandyMachineUuidFromAddress)(candyMachine.address),
        price: (0, helpers_1.spokSameAmount)((0, index_1.sol)(1.25)),
        symbol: '',
        sellerFeeBasisPoints: 500,
        isMutable: true,
        retainAuthority: true,
        goLiveDate: null,
        maxEditionSupply: (0, helpers_1.spokSameBignum)(0),
        items: [],
        itemsAvailable: (0, helpers_1.spokSameBignum)(100),
        itemsMinted: (0, helpers_1.spokSameBignum)(0),
        itemsRemaining: (0, helpers_1.spokSameBignum)(100),
        itemsLoaded: (0, helpers_1.spokSameBignum)(0),
        isFullyLoaded: false,
        endSettings: null,
        hiddenSettings: null,
        whitelistMintSettings: null,
        gatekeeper: null,
        creators: [
            {
                address: mx.identity().publicKey,
                verified: false,
                share: 100,
            },
        ],
    });
}));
(0, tape_1.default)('[candyMachineModule] create with creators', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client and two creators.
    const { tc, client, minimalInput } = yield init();
    const creatorA = web3_js_1.Keypair.generate();
    const creatorB = web3_js_1.Keypair.generate();
    const creators = [
        {
            address: creatorA.publicKey,
            verified: false,
            share: 50,
        },
        {
            address: creatorB.publicKey,
            verified: false,
            share: 50,
        },
    ];
    // When we create a Candy Machine and assign these creators.
    const { response, candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { creators }))
        .run();
    // Then the creators where saved on the Candy Machine.
    yield tc.assertSuccess(t, response.signature);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        model: 'candyMachine',
        creators,
    });
}));
(0, tape_1.default)('[candyMachineModule] create with 0-decimal SPL token treasury', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client.
    const { tc, mx, client, minimalInput } = yield init();
    // And a token account and its mint account.
    const { token: tokenMint } = yield mx.tokens().createTokenWithMint().run();
    const amount = (0, index_1.token)(100, tokenMint.mint.decimals, tokenMint.mint.currency.symbol);
    // When we create a Candy Machine with an SPL treasury.
    const { response, candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { price: amount, wallet: tokenMint.address, tokenMint: tokenMint.mint.address }))
        .run();
    // Then a Candy Machine was created with the SPL treasury as configured.
    yield tc.assertSuccess(t, response.signature);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        model: 'candyMachine',
        walletAddress: (0, helpers_1.spokSamePubkey)(tokenMint.address),
        tokenMintAddress: (0, helpers_1.spokSamePubkey)(tokenMint.mint.address),
        price: (0, helpers_1.spokSameAmount)(amount),
    });
}));
(0, tape_1.default)('[candyMachineModule] create with 9-decimal SPL token treasury', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client.
    const { tc, mx, client, minimalInput } = yield init();
    // And a token account and its mint account.
    const { token: tokenMint } = yield mx
        .tokens()
        .createTokenWithMint({ decimals: 9 })
        .run();
    const amount = (0, index_1.token)(1.25, tokenMint.mint.decimals, tokenMint.mint.currency.symbol);
    // When we create a Candy Machine with an SPL treasury.
    const { response, candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { price: amount, wallet: tokenMint.address, tokenMint: tokenMint.mint.address }))
        .run();
    // Then a Candy Machine was created with the SPL treasury as configured.
    yield tc.assertSuccess(t, response.signature);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        model: 'candyMachine',
        walletAddress: (0, helpers_1.spokSamePubkey)(tokenMint.address),
        tokenMintAddress: (0, helpers_1.spokSamePubkey)(tokenMint.mint.address),
    });
}));
(0, tape_1.default)('[candyMachineModule] create with end settings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client.
    const { tc, client, minimalInput } = yield init();
    // When we create a Candy Machine with end settings.
    const { response, candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { endSettings: {
            endSettingType: mpl_candy_machine_1.EndSettingType.Amount,
            number: (0, index_1.toBigNumber)(100),
        } }))
        .run();
    // Then a Candy Machine was created with these end settings.
    yield tc.assertSuccess(t, response.signature);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        model: 'candyMachine',
        endSettings: {
            endSettingType: mpl_candy_machine_1.EndSettingType.Amount,
            number: (0, helpers_1.spokSameBignum)(100),
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] create with hidden settings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client and a computed hash.
    const { tc, client, minimalInput } = yield init();
    // When we create a Candy Machine with hidden settings.
    const { response, candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { hiddenSettings: {
            hash: (0, helpers_2.create32BitsHash)('cache-file'),
            uri: 'https://example.com',
            name: 'mint-name',
        } }))
        .run();
    // Then a Candy Machine was created with these hidden settings.
    yield tc.assertSuccess(t, response.signature);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        model: 'candyMachine',
        hiddenSettings: {
            hash: (0, helpers_2.create32BitsHash)('cache-file'),
            uri: 'https://example.com',
            name: 'mint-name',
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] try to create with invalid hidden settings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client.
    const { client, minimalInput } = yield init();
    // When we create a Candy Machine with invalid hidden settings.
    const promise = client
        .create(Object.assign(Object.assign({}, minimalInput), { hiddenSettings: {
            hash: [1, 2, 3],
            uri: 'https://example.com',
            name: 'mint-name',
        } }))
        .run();
    // Then it fails to create the Candy Machine.
    yield (0, helpers_1.assertThrows)(t, promise, /len.+3.+should match len.+32/i);
}));
(0, tape_1.default)('[candyMachineModule] create with gatekeeper settings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client and a gatekeeper address.
    const { tc, client, minimalInput } = yield init();
    const gatekeeper = web3_js_1.Keypair.generate();
    // When we create a Candy Machine with gatekeep settings.
    const { response, candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { gatekeeper: {
            network: gatekeeper.publicKey,
            expireOnUse: true,
        } }))
        .run();
    // Then a Candy Machine was created with these gatekeep settings.
    yield tc.assertSuccess(t, response.signature);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        model: 'candyMachine',
        gatekeeper: {
            network: gatekeeper.publicKey,
            expireOnUse: true,
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] create with whitelistMint settings', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Given a Candy Machine client and a mint account.
    const { tc, client, minimalInput } = yield init();
    const mint = web3_js_1.Keypair.generate();
    // When we create a Candy Machine with ...
    const { response, candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { whitelistMintSettings: {
            mode: mpl_candy_machine_1.WhitelistMintMode.BurnEveryTime,
            discountPrice: (0, index_1.sol)(0.5),
            mint: mint.publicKey,
            presale: false,
        } }))
        .run();
    // Then a Candy Machine was created with ...
    yield tc.assertSuccess(t, response.signature);
    console.log((_a = candyMachine.whitelistMintSettings) === null || _a === void 0 ? void 0 : _a.discountPrice);
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        model: 'candyMachine',
        price: (0, helpers_1.spokSameAmount)((0, index_1.sol)(1)),
        whitelistMintSettings: {
            mode: mpl_candy_machine_1.WhitelistMintMode.BurnEveryTime,
            discountPrice: (0, helpers_1.spokSameAmount)((0, index_1.sol)(0.5)),
            mint: mint.publicKey,
            presale: false,
        },
    });
}));
(0, tape_1.default)('[candyMachineModule] create with collection', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Candy Machine client.
    const { mx, client, minimalInput } = yield init();
    // And a Collection NFT.
    const collectionNft = yield (0, helpers_1.createNft)(mx);
    // When we create that Candy Machine
    const { candyMachine } = yield client
        .create(Object.assign(Object.assign({}, minimalInput), { collection: collectionNft.address }))
        .run();
    // Then we created the Candy Machine as configured
    (0, spok_1.default)(t, candyMachine, {
        $topic: 'Candy Machine',
        collectionMintAddress: (0, helpers_1.spokSamePubkey)(collectionNft.address),
    });
}));
//# sourceMappingURL=createCandyMachine.test.js.map
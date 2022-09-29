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
const helpers_2 = require("./helpers");
const web3_js_1 = require("@solana/web3.js");
const index_1 = require("../../../src/index");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[candyMachineModule] find all candy machines by wallet', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given two candy machines from wallet A.
    const mx = yield (0, helpers_1.metaplex)();
    const walletA = web3_js_1.Keypair.generate();
    yield Promise.all([
        (0, helpers_2.createCandyMachine)(mx, { wallet: walletA.publicKey }),
        (0, helpers_2.createCandyMachine)(mx, { wallet: walletA.publicKey }),
    ]);
    // And one candy machine from wallet B.
    const walletB = web3_js_1.Keypair.generate();
    yield (0, helpers_2.createCandyMachine)(mx, { wallet: walletB.publicKey });
    // When I find all candy machines from wallet A.
    const candyMachines = yield mx
        .candyMachines()
        .findAllBy({ type: 'wallet', publicKey: walletA.publicKey })
        .run();
    // Then we got two candy machines.
    t.equal(candyMachines.length, 2, 'returns two accounts');
    // And they both are from wallet A.
    candyMachines.forEach((candyMachine) => {
        t.ok(candyMachine.walletAddress.equals(walletA.publicKey), 'wallet matches');
    });
}));
(0, tape_1.default)('[candyMachineModule] find all candy machines by authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given two candy machines from authority A.
    const mx = yield (0, helpers_1.metaplex)();
    const authorityA = web3_js_1.Keypair.generate();
    yield Promise.all([
        (0, helpers_2.createCandyMachine)(mx, { authority: authorityA.publicKey }),
        (0, helpers_2.createCandyMachine)(mx, { authority: authorityA.publicKey }),
    ]);
    // And one candy machine from authority B.
    const authorityB = web3_js_1.Keypair.generate();
    yield (0, helpers_2.createCandyMachine)(mx, { authority: authorityB.publicKey });
    // When I find all candy machines from authority A.
    const candyMachines = yield mx
        .candyMachines()
        .findAllBy({ type: 'authority', publicKey: authorityA.publicKey })
        .run();
    // Then we got two candy machines.
    t.equal(candyMachines.length, 2, 'returns two accounts');
    // And they both are from authority A.
    candyMachines.forEach((candyMachine) => {
        t.ok(candyMachine.authorityAddress.equals(authorityA.publicKey), 'authority matches');
    });
}));
(0, tape_1.default)('[candyMachineModule] find all candy machines correctly parses token mints and collection addresses', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    // Given three candy machines from authority A.
    const mx = yield (0, helpers_1.metaplex)();
    const authority = mx.identity();
    const { token: token1 } = yield mx.tokens().createTokenWithMint().run();
    const { token: token2_3 } = yield mx.tokens().createTokenWithMint().run();
    const amount1 = (0, index_1.token)(1.0, token1.mint.decimals, token1.mint.currency.symbol);
    const amount2 = (0, index_1.token)(1.5, token2_3.mint.decimals, token2_3.mint.currency.symbol);
    const collection1 = yield (0, helpers_1.createCollectionNft)(mx, {
        updateAuthority: authority,
    });
    const collection2 = yield (0, helpers_1.createCollectionNft)(mx, {
        collectionAuthority: authority,
    });
    const candyMachineResults = yield Promise.all([
        (0, helpers_2.createCandyMachine)(mx, {
            authority: authority,
            tokenMint: token1.mint.address,
            price: amount1,
            wallet: token1.address,
            collection: collection1.address,
        }),
        (0, helpers_2.createCandyMachine)(mx, {
            authority: authority,
            tokenMint: token2_3.mint.address,
            price: amount2,
            wallet: token2_3.address,
            collection: collection2.address,
        }),
        (0, helpers_2.createCandyMachine)(mx, {
            authority: authority,
            tokenMint: token2_3.mint.address,
            price: amount2,
            wallet: token2_3.address,
        }),
    ]);
    // When I find all candy machines
    const foundCandyMachines = yield mx
        .candyMachines()
        .findAllBy({ type: 'authority', publicKey: authority.publicKey })
        .run();
    // Then we got three candy machines.
    t.equal(foundCandyMachines.length, 3, 'returns three accounts');
    // And they maintained the correct token mint addresses and collections
    const found1 = foundCandyMachines.find((machine) => machine.address.equals(candyMachineResults[0].candyMachine.address));
    t.ok((_a = found1 === null || found1 === void 0 ? void 0 : found1.collectionMintAddress) === null || _a === void 0 ? void 0 : _a.equals(collection1.address), 'collectionMintAddress 1 matches');
    t.ok((_b = found1 === null || found1 === void 0 ? void 0 : found1.tokenMintAddress) === null || _b === void 0 ? void 0 : _b.equals(token1.mint.address), 'tokenMintAddress 1 matches');
    const found2 = foundCandyMachines.find((machine) => machine.address.equals(candyMachineResults[1].candyMachine.address));
    t.ok((_c = found2 === null || found2 === void 0 ? void 0 : found2.collectionMintAddress) === null || _c === void 0 ? void 0 : _c.equals(collection2.address), 'collectionMintAddress 2 matches');
    t.ok((_d = found2 === null || found2 === void 0 ? void 0 : found2.tokenMintAddress) === null || _d === void 0 ? void 0 : _d.equals(token2_3.mint.address), 'tokenMintAddress 2 matches');
    const found3 = foundCandyMachines.find((machine) => machine.address.equals(candyMachineResults[2].candyMachine.address));
    t.ok(found3 && !found3.collectionMintAddress, 'collectionMintAddress 3 matches');
    t.ok((_e = found3 === null || found3 === void 0 ? void 0 : found3.tokenMintAddress) === null || _e === void 0 ? void 0 : _e.equals(token2_3.mint.address), 'tokenMintAddress 3 matches');
}));
//# sourceMappingURL=findCandyMachinesByPublicKeyField.test.js.map
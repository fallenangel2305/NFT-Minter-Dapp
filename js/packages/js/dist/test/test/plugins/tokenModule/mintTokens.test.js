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
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[tokenModule] it can mint tokens to an existing token account', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a mint.
    const mx = yield (0, helpers_1.metaplex)();
    const { mint } = yield mx.tokens().createMint().run();
    // And an existing token account for that mint.
    const toTokenSigner = web3_js_1.Keypair.generate();
    const { token: toToken } = yield mx
        .tokens()
        .createToken({ mint: mint.address, token: toTokenSigner })
        .run();
    (0, helpers_2.assertTokenHasAmount)(t, toToken, (0, index_1.token)(0));
    // When we mint 42 tokens to that token account.
    yield mx
        .tokens()
        .mint({
        mintAddress: mint.address,
        amount: (0, index_1.token)(42),
        toToken: toToken.address,
    })
        .run();
    // Then the mint was successful.
    yield (0, helpers_2.assertRefreshedTokenHasAmount)(t, mx, toToken, (0, index_1.token)(42));
}));
(0, tape_1.default)('[tokenModule] it can mint tokens to an existing associated token account', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a mint.
    const mx = yield (0, helpers_1.metaplex)();
    const { mint } = yield mx.tokens().createMint().run();
    // And an existing associated token account for that mint.
    const toOwner = web3_js_1.Keypair.generate().publicKey;
    const { token: toToken } = yield mx
        .tokens()
        .createToken({ mint: mint.address, owner: toOwner })
        .run();
    (0, helpers_2.assertTokenHasAmount)(t, toToken, (0, index_1.token)(0));
    // When we mint 42 tokens to that token account.
    yield mx
        .tokens()
        .mint({
        mintAddress: mint.address,
        amount: (0, index_1.token)(42),
        toToken: toToken.address,
    })
        .run();
    // Then the mint was successful.
    yield (0, helpers_2.assertRefreshedTokenHasAmount)(t, mx, toToken, (0, index_1.token)(42));
}));
(0, tape_1.default)('[tokenModule] it can mint tokens to an non-existing token account', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a mint.
    const mx = yield (0, helpers_1.metaplex)();
    const { mint } = yield mx.tokens().createMint().run();
    // And an token account to send tokens to that does not exist.
    const toTokenSigner = web3_js_1.Keypair.generate();
    const toTokenAccount = yield mx.rpc().getAccount(toTokenSigner.publicKey);
    t.false(toTokenAccount.exists, 'toToken account does not exist');
    // When we mint 42 tokens to that token account.
    yield mx
        .tokens()
        .mint({
        mintAddress: mint.address,
        amount: (0, index_1.token)(42),
        toToken: toTokenSigner,
    })
        .run();
    // Then the account was created.
    const toToken = yield mx
        .tokens()
        .findTokenByAddress({ address: toTokenSigner.publicKey })
        .run();
    // And the mint was successful.
    yield (0, helpers_2.assertRefreshedTokenHasAmount)(t, mx, toToken, (0, index_1.token)(42));
}));
(0, tape_1.default)('[tokenModule] it can mint tokens to an non-existing associated token account', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a mint.
    const mx = yield (0, helpers_1.metaplex)();
    const { mint } = yield mx.tokens().createMint().run();
    // And an owner that does not have an associated token account for that mint yet.
    const toOwner = web3_js_1.Keypair.generate().publicKey;
    const toAssociatedToken = (0, index_1.findAssociatedTokenAccountPda)(mint.address, toOwner);
    const toAssociatedTokenAccount = yield mx.rpc().getAccount(toAssociatedToken);
    t.false(toAssociatedTokenAccount.exists, 'toToken account does not exist');
    // When we mint 42 tokens to that token account.
    yield mx
        .tokens()
        .mint({ mintAddress: mint.address, amount: (0, index_1.token)(42), toOwner })
        .run();
    // Then the associated token account was created.
    const toToken = yield mx
        .tokens()
        .findTokenByAddress({ address: toAssociatedToken })
        .run();
    // And the mint was successful.
    yield (0, helpers_2.assertRefreshedTokenHasAmount)(t, mx, toToken, (0, index_1.token)(42));
}));
//# sourceMappingURL=mintTokens.test.js.map
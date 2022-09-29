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
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[tokenModule] the freeze authority can freeze any token account', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and an existing token account.
    const mx = yield (0, helpers_1.metaplex)();
    const freezeAuthority = web3_js_1.Keypair.generate();
    const owner = web3_js_1.Keypair.generate();
    const { token: tokenWithMint } = yield mx
        .tokens()
        .createTokenWithMint({
        owner: owner.publicKey,
        freezeAuthority: freezeAuthority.publicKey,
    })
        .run();
    // When the owner freezes its own account.
    yield mx
        .tokens()
        .freeze({
        mintAddress: tokenWithMint.mint.address,
        tokenOwner: owner.publicKey,
        freezeAuthority,
    })
        .run();
    // Then the token account is frozen.
    const refreshedToken = yield (0, helpers_2.refreshToken)(mx, tokenWithMint);
    t.equal(refreshedToken.state, spl_token_1.AccountState.Frozen, 'token account is frozen');
}));
(0, tape_1.default)('[tokenModule] a frozen account cannot send tokens', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and an existing token account.
    const mx = yield (0, helpers_1.metaplex)();
    const freezeAuthority = web3_js_1.Keypair.generate();
    const owner = web3_js_1.Keypair.generate();
    const { token: tokenWithMint } = yield mx
        .tokens()
        .createTokenWithMint({
        owner: owner.publicKey,
        freezeAuthority: freezeAuthority.publicKey,
        initialSupply: (0, index_1.token)(42),
    })
        .run();
    // And that token account has been frozen.
    yield mx
        .tokens()
        .freeze({
        mintAddress: tokenWithMint.mint.address,
        tokenOwner: owner.publicKey,
        freezeAuthority,
    })
        .run();
    // When we try to send tokens from the frozen account.
    const promise = mx
        .tokens()
        .send({
        mintAddress: tokenWithMint.mint.address,
        amount: (0, index_1.token)(10),
        fromOwner: owner,
        toOwner: web3_js_1.Keypair.generate().publicKey,
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /Error: Account is frozen/);
}));
//# sourceMappingURL=freezeTokens.test.js.map
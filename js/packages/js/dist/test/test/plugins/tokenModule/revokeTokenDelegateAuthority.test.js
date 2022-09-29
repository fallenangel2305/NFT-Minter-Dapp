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
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[tokenModule] a token owner can revoke an existing token delegate authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and an existing token account containing 42 tokens.
    const mx = yield (0, helpers_1.metaplex)();
    const owner = web3_js_1.Keypair.generate();
    const { token: tokenWithMint } = yield mx
        .tokens()
        .createTokenWithMint({
        owner: owner.publicKey,
        initialSupply: (0, index_1.token)(42),
    })
        .run();
    // And an approved token delegate authority for 10 tokens.
    const delegateAuthority = web3_js_1.Keypair.generate();
    yield mx
        .tokens()
        .approveDelegateAuthority({
        mintAddress: tokenWithMint.mint.address,
        delegateAuthority: delegateAuthority.publicKey,
        amount: (0, index_1.token)(10),
        owner,
    })
        .run();
    // When the token owner revoke that authority.
    yield mx
        .tokens()
        .revokeDelegateAuthority({
        mintAddress: tokenWithMint.mint.address,
        owner,
    })
        .run();
    // Then the delegate authority cannot use anymore tokens.
    const newOwner = web3_js_1.Keypair.generate();
    const promise = mx
        .tokens()
        .send({
        mintAddress: tokenWithMint.mint.address,
        delegateAuthority,
        fromOwner: owner.publicKey,
        toOwner: newOwner.publicKey,
        amount: (0, index_1.token)(1),
    })
        .run();
    yield (0, helpers_1.assertThrows)(t, promise, /Error: owner does not match/);
}));
//# sourceMappingURL=revokeTokenDelegateAuthority.test.js.map
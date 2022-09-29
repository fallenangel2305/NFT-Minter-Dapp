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
const spok_1 = __importDefault(require("spok"));
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[tokenModule] a token owner can approve a new token delegate authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
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
    // When we approve a new token delegate authority for 10 tokens.
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
    // Then the token account was updated.
    (0, spok_1.default)(t, yield (0, helpers_2.refreshToken)(mx, tokenWithMint), {
        $topic: 'Refreshed Token',
        address: (0, helpers_1.spokSamePubkey)(tokenWithMint.address),
        delegateAddress: (0, helpers_1.spokSamePubkey)(delegateAuthority.publicKey),
        delegateAmount: (0, helpers_1.spokSameAmount)((0, index_1.token)(10)),
    });
    // And the delegate authority can do what they want with up to 10 of these tokens.
    const newOwner = web3_js_1.Keypair.generate();
    yield mx
        .tokens()
        .send({
        mintAddress: tokenWithMint.mint.address,
        delegateAuthority,
        fromOwner: owner.publicKey,
        toOwner: newOwner.publicKey,
        amount: (0, index_1.token)(8),
    })
        .run();
    // And the data is updated correctly on the token account afterwards.
    (0, spok_1.default)(t, yield (0, helpers_2.refreshToken)(mx, tokenWithMint), {
        $topic: 'Refreshed Token After sending',
        address: (0, helpers_1.spokSamePubkey)(tokenWithMint.address),
        amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(34)),
        delegateAddress: (0, helpers_1.spokSamePubkey)(delegateAuthority.publicKey),
        delegateAmount: (0, helpers_1.spokSameAmount)((0, index_1.token)(2)),
    });
}));
(0, tape_1.default)('[tokenModule] an approved delegate authority is automatically revoked when all delegated tokens where used', (t) => __awaiter(void 0, void 0, void 0, function* () {
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
    // And given we approved a new token delegate authority for 10 tokens.
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
    // When we use all 10 delegated tokens from that delegate authority.
    const newOwner = web3_js_1.Keypair.generate();
    yield mx
        .tokens()
        .send({
        mintAddress: tokenWithMint.mint.address,
        delegateAuthority,
        fromOwner: owner.publicKey,
        toOwner: newOwner.publicKey,
        amount: (0, index_1.token)(10),
    })
        .run();
    // Then the delegated authority was automatically revoked.
    (0, spok_1.default)(t, yield (0, helpers_2.refreshToken)(mx, tokenWithMint), {
        $topic: 'Refreshed Token After sending',
        address: (0, helpers_1.spokSamePubkey)(tokenWithMint.address),
        amount: (0, helpers_1.spokSameAmount)((0, index_1.token)(32)),
        delegateAddress: null,
        delegateAmount: (0, helpers_1.spokSameAmount)((0, index_1.token)(0)),
    });
}));
(0, tape_1.default)('[tokenModule] a delegated authority cannot use more tokens than initially agreed', (t) => __awaiter(void 0, void 0, void 0, function* () {
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
    // And given we approved a new token delegate authority for 10 tokens.
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
    // When we try to use more than the 10 tokens delegated.
    const newOwner = web3_js_1.Keypair.generate();
    const promise = mx
        .tokens()
        .send({
        mintAddress: tokenWithMint.mint.address,
        delegateAuthority,
        fromOwner: owner.publicKey,
        toOwner: newOwner.publicKey,
        amount: (0, index_1.token)(20),
    })
        .run();
    // Then we expect an error.
    // Note that we don't get a nice parsed error because we don't
    // have a generated cusper instance for the SPL Token program yet.
    yield (0, helpers_1.assertThrows)(t, promise, /Error: insufficient funds/);
}));
//# sourceMappingURL=approveTokenDelegateAuthority.test.js.map
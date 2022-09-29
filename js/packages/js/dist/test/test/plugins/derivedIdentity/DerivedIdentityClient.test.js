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
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const index_1 = require("../../../src/index");
(0, helpers_1.killStuckProcess)();
const init = (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const mx = yield (0, helpers_1.metaplex)({ solsToAirdrop: options.identityAirdrop });
    mx.use((0, index_1.derivedIdentity)());
    if (options.message != null) {
        yield mx.derivedIdentity().deriveFrom(options.message).run();
    }
    if (options.derivedAirdrop != null) {
        yield helpers_1.amman.airdrop(mx.connection, mx.derivedIdentity().publicKey, options.derivedAirdrop);
    }
    return mx;
});
const getBalances = (mx) => __awaiter(void 0, void 0, void 0, function* () {
    const identityBalance = yield mx.rpc().getBalance(mx.identity().publicKey);
    const derivedBalance = yield mx
        .rpc()
        .getBalance(mx.derivedIdentity().publicKey);
    return { identityBalance, derivedBalance };
});
(0, tape_1.default)('[derivedIdentity] it derives a Keypair from the current identity', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using the derived identity plugin.
    const mx = yield init();
    // When we derive the identity using a message.
    yield mx.derivedIdentity().deriveFrom('Hello World').run();
    // Then we get a Signer Keypair.
    t.ok(mx.derivedIdentity().publicKey, 'derived identity has a public key');
    t.ok(mx.derivedIdentity().secretKey, 'derived identity has a secret key');
    // And it is different from the original identity.
    t.notOk(mx.derivedIdentity().equals(mx.identity()), 'derived identity is different from original identity');
}));
(0, tape_1.default)('[derivedIdentity] it keeps track of the identity it originates from', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using the derived identity plugin.
    const mx = yield init();
    const identityPublicKey = mx.identity().publicKey;
    // When we derive the identity.
    yield mx.derivedIdentity().deriveFrom('Hello World').run();
    // Then the derived identity kept track of the identity it originated from.
    t.ok(identityPublicKey.equals(mx.derivedIdentity().originalPublicKey), 'derived identity stores the public key of the identity it originated from');
    // Even if we end up updating the identity.
    mx.use((0, index_1.keypairIdentity)(web3_js_1.Keypair.generate()));
    t.ok(identityPublicKey.equals(mx.derivedIdentity().originalPublicKey), 'derived identity stores the public key of the identity it originated from even after it changed');
    t.notOk(mx.identity().equals(mx.derivedIdentity().originalPublicKey), "derived identity's stored identity is different to the new identity");
}));
(0, tape_1.default)('[derivedIdentity] it can derive a Keypair from an explicit IdentitySigner', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance and a custom IdentitySigner.
    const mx = yield init();
    const signer = new index_1.KeypairIdentityDriver(web3_js_1.Keypair.generate());
    // When we derive the identity by providing the signer explicitly.
    yield mx.derivedIdentity().deriveFrom('Hello World', signer).run();
    // Then a new derived identity was created for that signer.
    t.ok(signer.publicKey.equals(mx.derivedIdentity().originalPublicKey), 'derived identity stores the public key of the provided signer');
    // But not for the current identity.
    t.notOk(mx.identity().equals(mx.derivedIdentity().originalPublicKey), 'derived identity does not store the public key of the current identity');
}));
(0, tape_1.default)('[derivedIdentity] it derives the same address when using the same message', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using the derived identity plugin.
    const mx = yield init();
    // When we derive the identity twice with the same message.
    yield mx.derivedIdentity().deriveFrom('Hello World').run();
    const derivedPublicKeyA = mx.derivedIdentity().publicKey;
    yield mx.derivedIdentity().deriveFrom('Hello World').run();
    const derivedPubliKeyB = mx.derivedIdentity().publicKey;
    // Then we get the same Keypair.
    t.ok(derivedPublicKeyA.equals(derivedPubliKeyB), 'the two derived identities are the same');
}));
(0, tape_1.default)('[derivedIdentity] it derives different addresses from different messages', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using the derived identity plugin.
    const mx = yield init();
    // When we derive the identity twice with different messages.
    yield mx.derivedIdentity().deriveFrom('Hello World').run();
    const derivedPublicKeyA = mx.derivedIdentity().publicKey;
    yield mx.derivedIdentity().deriveFrom('Hello Papito').run();
    const derivedPubliKeyB = mx.derivedIdentity().publicKey;
    // Then we get the different Keypairs.
    t.notOk(derivedPublicKeyA.equals(derivedPubliKeyB), 'the two derived identities are different');
}));
(0, tape_1.default)('[derivedIdentity] it can fund the derived identity', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance with:
    // - an identity airdropped with 5 SOLs.
    // - a derived identity with no SOLs.
    const mx = yield init({ message: 'fund', identityAirdrop: 5 });
    // When we fund the derived identity by 1 SOL.
    yield mx.derivedIdentity().fund((0, index_1.sol)(1)).run();
    // Then we can see that 1 SOL was transferred from the identity to the derived identity.
    // It's a little less due to the transaction fee.
    const { identityBalance, derivedBalance } = yield getBalances(mx);
    t.ok((0, index_1.isLessThanAmount)(identityBalance, (0, index_1.sol)(4)), 'identity balance is less than 4');
    t.ok((0, index_1.isGreaterThanAmount)(identityBalance, (0, index_1.sol)(3.9)), 'identity balance is greater than 3.9');
    t.ok((0, index_1.isEqualToAmount)(derivedBalance, (0, index_1.sol)(1)), 'derived balance is 1');
}));
(0, tape_1.default)('[derivedIdentity] it can withdraw from the derived identity', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance with:
    // - an identity airdropped with 5 SOLs.
    // - a derived identity airdropped with 2 SOLs.
    const mx = yield init({
        message: 'withdraw',
        identityAirdrop: 5,
        derivedAirdrop: 2,
    });
    // When we withdraw 1 SOL from the derived identity.
    yield mx.derivedIdentity().withdraw((0, index_1.sol)(1)).run();
    // Then we can see that 1 SOL was transferred from the derived identity to the identity.
    // It's a little less due to the transaction fee.
    const { identityBalance, derivedBalance } = yield getBalances(mx);
    t.ok((0, index_1.isLessThanAmount)(identityBalance, (0, index_1.sol)(6)), 'identity balance is less than 6');
    t.ok((0, index_1.isGreaterThanAmount)(identityBalance, (0, index_1.sol)(5.9)), 'identity balance is greater than 5.9');
    t.ok((0, index_1.isEqualToAmount)(derivedBalance, (0, index_1.sol)(1)), 'derived balance is 1');
}));
(0, tape_1.default)('[derivedIdentity] it can withdraw everything from the derived identity', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance with:
    // - an identity airdropped with 5 SOLs.
    // - a derived identity airdropped with 2 SOLs.
    const mx = yield init({
        message: 'withdraw',
        identityAirdrop: 5,
        derivedAirdrop: 2,
    });
    // When we withdraw everything from the derived identity.
    yield mx.derivedIdentity().withdrawAll().run();
    // Then we can see that 1 SOL was transferred from the derived identity to the identity.
    // It's a little less due to the transaction fee.
    const { identityBalance, derivedBalance } = yield getBalances(mx);
    t.ok((0, index_1.isLessThanAmount)(identityBalance, (0, index_1.sol)(7)), 'identity balance is less than 7');
    t.ok((0, index_1.isGreaterThanAmount)(identityBalance, (0, index_1.sol)(6.9)), 'identity balance is greater than 6.9');
    t.ok((0, index_1.isEqualToAmount)(derivedBalance, (0, index_1.sol)(0)), 'derived balance is 0');
}));
//# sourceMappingURL=DerivedIdentityClient.test.js.map
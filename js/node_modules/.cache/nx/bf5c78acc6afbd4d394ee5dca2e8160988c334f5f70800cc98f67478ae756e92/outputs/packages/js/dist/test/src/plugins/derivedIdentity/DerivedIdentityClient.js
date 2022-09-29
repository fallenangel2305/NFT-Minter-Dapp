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
exports.DerivedIdentityClient = void 0;
const web3_js_1 = require("@solana/web3.js");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const buffer_1 = require("buffer");
const types_1 = require("../../types");
const errors_1 = require("./errors");
const utils_1 = require("../../utils");
/**
 * @group Modules
 */
class DerivedIdentityClient {
    constructor(metaplex) {
        this.originalSigner = null;
        this.derivedKeypair = null;
        this.metaplex = metaplex;
    }
    get publicKey() {
        this.assertInitialized();
        return this.derivedKeypair.publicKey;
    }
    get secretKey() {
        this.assertInitialized();
        return this.derivedKeypair.secretKey;
    }
    get originalPublicKey() {
        this.assertInitialized();
        return this.originalSigner.publicKey;
    }
    deriveFrom(message, originalSigner) {
        return new utils_1.Task(() => __awaiter(this, void 0, void 0, function* () {
            this.originalSigner = originalSigner !== null && originalSigner !== void 0 ? originalSigner : this.metaplex.identity().driver();
            const signature = yield this.originalSigner.signMessage(buffer_1.Buffer.from(message));
            const seeds = tweetnacl_1.default.hash(signature).slice(0, 32);
            this.derivedKeypair = web3_js_1.Keypair.fromSeed(seeds);
        }));
    }
    fund(amount) {
        this.assertInitialized();
        return this.metaplex.system().transferSol({
            from: this.originalSigner,
            to: this.derivedKeypair.publicKey,
            amount,
        });
    }
    withdraw(amount) {
        this.assertInitialized();
        return this.metaplex.system().transferSol({
            from: this.derivedKeypair,
            to: this.originalSigner.publicKey,
            amount,
        });
    }
    withdrawAll() {
        this.assertInitialized();
        return new utils_1.Task((scope) => __awaiter(this, void 0, void 0, function* () {
            this.assertInitialized();
            const balance = yield this.metaplex
                .rpc()
                .getBalance(this.derivedKeypair.publicKey);
            return this.withdraw(balance).run(scope);
        }));
    }
    close() {
        this.originalSigner = null;
        this.derivedKeypair = null;
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweetnacl_1.default.sign.detached(message, this.secretKey);
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            transaction.partialSign(this);
            return transaction;
        });
    }
    signAllTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(transactions.map((transaction) => this.signTransaction(transaction)));
        });
    }
    verifyMessage(message, signature) {
        return tweetnacl_1.default.sign.detached.verify(message, signature, this.publicKey.toBytes());
    }
    equals(that) {
        if ((0, types_1.isSigner)(that)) {
            that = that.publicKey;
        }
        return this.publicKey.equals(that);
    }
    assertInitialized() {
        if (this.derivedKeypair === null || this.originalSigner === null) {
            throw new errors_1.UninitializedDerivedIdentityError();
        }
    }
}
exports.DerivedIdentityClient = DerivedIdentityClient;
//# sourceMappingURL=DerivedIdentityClient.js.map
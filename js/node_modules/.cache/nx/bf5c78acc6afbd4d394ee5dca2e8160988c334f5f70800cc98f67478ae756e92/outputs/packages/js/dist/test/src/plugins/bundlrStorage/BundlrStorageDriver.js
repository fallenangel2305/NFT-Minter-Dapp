"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBundlrStorageDriver = exports.BundlrStorageDriver = void 0;
const _BundlrPackage = __importStar(require("@bundlr-network/client"));
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const types_1 = require("../../types");
const errors_1 = require("../../errors");
const storageModule_1 = require("../storageModule");
const keypairIdentity_1 = require("../keypairIdentity");
const web3_js_1 = require("@solana/web3.js");
/**
 * This method is necessary to import the Bundlr package on both ESM and CJS modules.
 * Without this, we get a different structure on each module:
 * - CJS: { default: [Getter], WebBundlr: [Getter] }
 * - ESM: { default: { default: [Getter], WebBundlr: [Getter] } }
 * This method fixes this by ensure there is not double default in the imported package.
 */
function _removeDoubleDefault(pkg) {
    if (pkg &&
        typeof pkg === 'object' &&
        'default' in pkg &&
        'default' in pkg.default) {
        return pkg.default;
    }
    return pkg;
}
const BundlrPackage = _removeDoubleDefault(_BundlrPackage);
class BundlrStorageDriver {
    constructor(metaplex, options = {}) {
        this._bundlr = null;
        this._metaplex = metaplex;
        this._options = Object.assign({ providerUrl: metaplex.connection.rpcEndpoint }, options);
    }
    getUploadPrice(bytes) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const bundlr = yield this.bundlr();
            const price = yield bundlr.getPrice(bytes);
            return bigNumberToAmount(price.multipliedBy((_a = this._options.priceMultiplier) !== null && _a !== void 0 ? _a : 1.5));
        });
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const [uri] = yield this.uploadAll([file]);
            return uri;
        });
    }
    uploadAll(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const bundlr = yield this.bundlr();
            const amount = yield this.getUploadPrice((0, storageModule_1.getBytesFromMetaplexFiles)(...files));
            yield this.fund(amount);
            const promises = files.map((file) => __awaiter(this, void 0, void 0, function* () {
                const { status, data } = yield bundlr.uploader.upload(file.buffer, getMetaplexFileTagsWithContentType(file));
                if (status >= 300) {
                    throw new errors_1.AssetUploadFailedError(status);
                }
                return `https://arweave.net/${data.id}`;
            }));
            return yield Promise.all(promises);
        });
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const bundlr = yield this.bundlr();
            const balance = yield bundlr.getLoadedBalance();
            return bigNumberToAmount(balance);
        });
    }
    fund(amount, skipBalanceCheck = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const bundlr = yield this.bundlr();
            let toFund = amountToBigNumber(amount);
            if (!skipBalanceCheck) {
                const balance = yield bundlr.getLoadedBalance();
                toFund = toFund.isGreaterThan(balance)
                    ? toFund.minus(balance)
                    : new bignumber_js_1.default(0);
            }
            if (toFund.isLessThanOrEqualTo(0)) {
                return;
            }
            // TODO: Catch errors and wrap in BundlrErrors.
            yield bundlr.fund(toFund);
        });
    }
    withdrawAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO(loris): Replace with "withdrawAll" when available on Bundlr.
            const bundlr = yield this.bundlr();
            const balance = yield bundlr.getLoadedBalance();
            const minimumBalance = new bignumber_js_1.default(5000);
            if (balance.isLessThan(minimumBalance)) {
                return;
            }
            const balanceToWithdraw = balance.minus(minimumBalance);
            yield this.withdraw(bigNumberToAmount(balanceToWithdraw));
        });
    }
    withdraw(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const bundlr = yield this.bundlr();
            const { status } = yield bundlr.withdrawBalance(amountToBigNumber(amount));
            if (status >= 300) {
                throw new errors_1.BundlrWithdrawError(status);
            }
        });
    }
    bundlr() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._bundlr) {
                return this._bundlr;
            }
            return (this._bundlr = yield this.initBundlr());
        });
    }
    initBundlr() {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const currency = 'solana';
            const address = (_b = (_a = this._options) === null || _a === void 0 ? void 0 : _a.address) !== null && _b !== void 0 ? _b : 'https://node1.bundlr.network';
            const options = {
                timeout: this._options.timeout,
                providerUrl: this._options.providerUrl,
            };
            const identity = (_c = this._options.identity) !== null && _c !== void 0 ? _c : this._metaplex.identity();
            // if in node use node bundlr, else use web bundlr
            // see: https://github.com/metaplex-foundation/js/issues/202
            let isNode = typeof window === 'undefined' || ((_d = window.process) === null || _d === void 0 ? void 0 : _d.hasOwnProperty('type'));
            let bundlr;
            if (isNode && (0, types_1.isKeypairSigner)(identity))
                bundlr = this.initNodeBundlr(address, currency, identity, options);
            else {
                let identitySigner;
                if ((0, types_1.isIdentitySigner)(identity))
                    identitySigner = identity;
                else
                    identitySigner = new keypairIdentity_1.KeypairIdentityDriver(web3_js_1.Keypair.fromSecretKey(identity.secretKey));
                bundlr = yield this.initWebBundlr(address, currency, identitySigner, options);
            }
            try {
                // Check for valid bundlr node.
                yield bundlr.utils.getBundlerAddress(currency);
            }
            catch (error) {
                throw new errors_1.FailedToConnectToBundlrAddressError(address, {
                    cause: error,
                });
            }
            return bundlr;
        });
    }
    initNodeBundlr(address, currency, keypair, options) {
        return new BundlrPackage.default(address, currency, keypair.secretKey, options);
    }
    initWebBundlr(address, currency, identity, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = {
                publicKey: identity.publicKey,
                signMessage: (message) => identity.signMessage(message),
                signTransaction: (transaction) => identity.signTransaction(transaction),
                signAllTransactions: (transactions) => identity.signAllTransactions(transactions),
                sendTransaction: (transaction, connection, options = {}) => {
                    const { signers } = options, sendOptions = __rest(options, ["signers"]);
                    if ('rpc' in this._metaplex) {
                        return this._metaplex
                            .rpc()
                            .sendTransaction(transaction, signers, sendOptions);
                    }
                    return connection.sendTransaction(transaction, signers !== null && signers !== void 0 ? signers : [], sendOptions);
                },
            };
            const bundlr = new BundlrPackage.WebBundlr(address, currency, wallet, options);
            try {
                // Try to initiate bundlr.
                yield bundlr.ready();
            }
            catch (error) {
                throw new errors_1.FailedToInitializeBundlrError({ cause: error });
            }
            return bundlr;
        });
    }
}
exports.BundlrStorageDriver = BundlrStorageDriver;
const isBundlrStorageDriver = (storageDriver) => {
    return ('bundlr' in storageDriver &&
        'getBalance' in storageDriver &&
        'fund' in storageDriver &&
        'withdrawAll' in storageDriver);
};
exports.isBundlrStorageDriver = isBundlrStorageDriver;
const bigNumberToAmount = (bigNumber) => {
    return (0, types_1.lamports)((0, types_1.toBigNumber)(bigNumber.decimalPlaces(0).toString()));
};
const amountToBigNumber = (amount) => {
    return new bignumber_js_1.default(amount.basisPoints.toString());
};
const getMetaplexFileTagsWithContentType = (file) => {
    if (!file.contentType) {
        return file.tags;
    }
    return [{ name: 'Content-Type', value: file.contentType }, ...file.tags];
};
//# sourceMappingURL=BundlrStorageDriver.js.map
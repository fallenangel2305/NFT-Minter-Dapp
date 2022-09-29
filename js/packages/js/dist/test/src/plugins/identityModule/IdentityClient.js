"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityClient = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const errors_1 = require("../../errors");
const types_1 = require("../../types");
/**
 * @group Modules
 */
class IdentityClient {
    constructor() {
        this._driver = null;
    }
    driver() {
        if (!this._driver) {
            throw new errors_1.DriverNotProvidedError('IdentityDriver');
        }
        return this._driver;
    }
    setDriver(newDriver) {
        this._driver = newDriver;
    }
    get publicKey() {
        return this.driver().publicKey;
    }
    get secretKey() {
        return this.driver().secretKey;
    }
    signMessage(message) {
        return this.driver().signMessage(message);
    }
    signTransaction(transaction) {
        return this.driver().signTransaction(transaction);
    }
    signAllTransactions(transactions) {
        return this.driver().signAllTransactions(transactions);
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
    hasSecretKey() {
        return this.secretKey != null;
    }
}
exports.IdentityClient = IdentityClient;
//# sourceMappingURL=IdentityClient.js.map
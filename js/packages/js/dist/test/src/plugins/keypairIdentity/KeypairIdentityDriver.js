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
exports.KeypairIdentityDriver = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
class KeypairIdentityDriver {
    constructor(keypair) {
        this.keypair = keypair;
        this.publicKey = keypair.publicKey;
        this.secretKey = keypair.secretKey;
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return tweetnacl_1.default.sign.detached(message, this.secretKey);
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            transaction.partialSign(this.keypair);
            return transaction;
        });
    }
    signAllTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(transactions.map((transaction) => this.signTransaction(transaction)));
        });
    }
}
exports.KeypairIdentityDriver = KeypairIdentityDriver;
//# sourceMappingURL=KeypairIdentityDriver.js.map
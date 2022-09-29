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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAdapterIdentityDriver = void 0;
const errors_1 = require("../../errors");
class WalletAdapterIdentityDriver {
    constructor(walletAdapter) {
        this.walletAdapter = walletAdapter;
    }
    get publicKey() {
        if (!this.walletAdapter.publicKey) {
            throw new errors_1.UninitializedWalletAdapterError();
        }
        return this.walletAdapter.publicKey;
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.walletAdapter.signMessage === undefined) {
                throw new errors_1.OperationNotSupportedByWalletAdapterError('signMessage');
            }
            return this.walletAdapter.signMessage(message);
        });
    }
    signTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.walletAdapter.signTransaction === undefined) {
                throw new errors_1.OperationNotSupportedByWalletAdapterError('signTransaction');
            }
            return this.walletAdapter.signTransaction(transaction);
        });
    }
    signAllTransactions(transactions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.walletAdapter.signAllTransactions === undefined) {
                throw new errors_1.OperationNotSupportedByWalletAdapterError('signAllTransactions');
            }
            return this.walletAdapter.signAllTransactions(transactions);
        });
    }
}
exports.WalletAdapterIdentityDriver = WalletAdapterIdentityDriver;
//# sourceMappingURL=WalletAdapterIdentityDriver.js.map
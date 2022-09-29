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
exports.UtilsClient = void 0;
const types_1 = require("../../types");
const TRANSACTION_FEE = 5000;
/**
 * @group Modules
 */
class UtilsClient {
    constructor(metaplex) {
        this.cachedRentPerEmptyAccount = null;
        this.cachedRentPerByte = null;
        this.metaplex = metaplex;
    }
    estimate(bytes, numberOfAccounts = 1, numberOfTransactions = 1, useCache = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const rent = yield this.estimateRent(bytes, numberOfAccounts, useCache);
            const transactionFees = this.estimateTransactionFee(numberOfTransactions);
            return (0, types_1.addAmounts)(rent, transactionFees);
        });
    }
    estimateRent(bytes, numberOfAccounts = 1, useCache = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!useCache ||
                this.cachedRentPerEmptyAccount === null ||
                this.cachedRentPerByte === null) {
                const rentFor0Bytes = yield this.metaplex.rpc().getRent(0);
                const rentFor1Byte = yield this.metaplex.rpc().getRent(1);
                this.cachedRentPerEmptyAccount = rentFor0Bytes;
                this.cachedRentPerByte = (0, types_1.subtractAmounts)(rentFor1Byte, rentFor0Bytes);
            }
            const rentForAccounts = (0, types_1.multiplyAmount)(this.cachedRentPerEmptyAccount, numberOfAccounts);
            const rentForBytes = (0, types_1.multiplyAmount)(this.cachedRentPerByte, bytes);
            return (0, types_1.addAmounts)(rentForAccounts, rentForBytes);
        });
    }
    estimateTransactionFee(numberOfTransactions = 1) {
        // TODO(loris): Improve with an RPC call to get the current transaction fee.
        return (0, types_1.lamports)(numberOfTransactions * TRANSACTION_FEE);
    }
}
exports.UtilsClient = UtilsClient;
//# sourceMappingURL=UtilsClient.js.map
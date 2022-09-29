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
exports.TransactionBuilder = void 0;
const web3_js_1 = require("@solana/web3.js");
class TransactionBuilder {
    constructor(transactionOptions) {
        /** The list of all instructions and their respective signers. */
        this.records = [];
        /** The signer to use to pay for transaction fees. */
        this.feePayer = undefined;
        /** Any additional context gathered when creating the transaction builder. */
        this.context = {};
        this.transactionOptions = transactionOptions;
    }
    static make(transactionOptions) {
        return new TransactionBuilder(transactionOptions);
    }
    prepend(...txs) {
        const newRecords = txs.flatMap((tx) => tx instanceof TransactionBuilder ? tx.getInstructionsWithSigners() : [tx]);
        this.records = [...newRecords, ...this.records];
        return this;
    }
    append(...txs) {
        const newRecords = txs.flatMap((tx) => tx instanceof TransactionBuilder ? tx.getInstructionsWithSigners() : [tx]);
        this.records = [...this.records, ...newRecords];
        return this;
    }
    add(...txs) {
        return this.append(...txs);
    }
    splitUsingKey(key, include = true) {
        const firstBuilder = new TransactionBuilder(this.transactionOptions);
        const secondBuilder = new TransactionBuilder(this.transactionOptions);
        let keyPosition = this.records.findIndex((record) => record.key === key);
        if (keyPosition > -1) {
            keyPosition += include ? 1 : 0;
            firstBuilder.add(...this.records.slice(0, keyPosition));
            firstBuilder.add(...this.records.slice(keyPosition));
        }
        else {
            firstBuilder.add(this);
        }
        return [firstBuilder, secondBuilder];
    }
    splitBeforeKey(key) {
        return this.splitUsingKey(key, false);
    }
    splitAfterKey(key) {
        return this.splitUsingKey(key, true);
    }
    getInstructionsWithSigners() {
        return this.records;
    }
    getInstructions() {
        return this.records.map((record) => record.instruction);
    }
    getInstructionCount() {
        return this.records.length;
    }
    isEmpty() {
        return this.getInstructionCount() === 0;
    }
    getSigners() {
        const feePayer = this.feePayer == null ? [] : [this.feePayer];
        const signers = this.records.flatMap((record) => record.signers);
        return [...feePayer, ...signers];
    }
    setTransactionOptions(transactionOptions) {
        this.transactionOptions = transactionOptions;
        return this;
    }
    getTransactionOptions() {
        return this.transactionOptions;
    }
    setFeePayer(feePayer) {
        this.feePayer = feePayer;
        return this;
    }
    getFeePayer() {
        var _a;
        return (_a = this.feePayer) === null || _a === void 0 ? void 0 : _a.publicKey;
    }
    setContext(context) {
        this.context = context;
        return this;
    }
    getContext() {
        return this.context;
    }
    when(condition, callback) {
        return condition ? callback(this) : this;
    }
    unless(condition, callback) {
        return this.when(!condition, callback);
    }
    toTransaction() {
        const tx = new web3_js_1.Transaction(this.getTransactionOptions());
        tx.add(...this.getInstructions());
        tx.feePayer = this.getFeePayer();
        return tx;
    }
    sendAndConfirm(metaplex, confirmOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield metaplex
                .rpc()
                .sendAndConfirmTransaction(this, undefined, confirmOptions);
            return Object.assign({ response }, this.getContext());
        });
    }
}
exports.TransactionBuilder = TransactionBuilder;
//# sourceMappingURL=TransactionBuilder.js.map
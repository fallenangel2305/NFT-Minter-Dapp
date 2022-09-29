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
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const types_1 = require("../../../src/types");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[utilsModule] it can estimate transaction fees', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we estimate the transaction fees.
    const feesFor1Tx = mx.utils().estimateTransactionFee(1);
    const feesFor2Tx = mx.utils().estimateTransactionFee(2);
    // Then we get the current transaction fee for each transaction provided.
    t.same(feesFor1Tx, (0, types_1.lamports)(5000));
    t.same(feesFor2Tx, (0, types_1.lamports)(10000));
}));
(0, tape_1.default)('[utilsModule] it can estimate rent-exemption fees', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we estimate the rent of 1Kb for one account.
    const rent = mx.utils().estimateRent(1024, 1);
    // Then we get same amount provided by the RPC.
    const rentFromRpc = mx.rpc().getRent(1024);
    t.same(rent, rentFromRpc);
}));
(0, tape_1.default)('[utilsModule] it can estimate rent-exemption fees for multiple accounts', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we estimate the rent of 1Kb for two accounts.
    const rent = yield mx.utils().estimateRent(1024, 2);
    // Then we get same amount provided by the RPC for two accounts of 512 bytes.
    const rpcRentFor512Bytes = yield mx.rpc().getRent(512);
    t.same(rent, (0, types_1.multiplyAmount)(rpcRentFor512Bytes, 2));
    // Which is not the same as one account of 1Kb.
    const rpcRentFor1024Bytes = yield mx.rpc().getRent(1024);
    t.notSame(rent, rpcRentFor1024Bytes);
}));
(0, tape_1.default)('[utilsModule] it can estimate transaction and storage fees in one method', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we estimate the total price of storing 1Kb
    // across two accounts and using 3 transactions.
    const price = yield mx.utils().estimate(1024, 2, 3);
    // Then we get the right amount.
    const rent = (0, types_1.multiplyAmount)(yield mx.rpc().getRent(512), 2);
    const txFee = (0, types_1.lamports)(5000 * 3);
    t.same(price, (0, types_1.addAmounts)(rent, txFee));
}));
//# sourceMappingURL=UtilsClient.test.js.map
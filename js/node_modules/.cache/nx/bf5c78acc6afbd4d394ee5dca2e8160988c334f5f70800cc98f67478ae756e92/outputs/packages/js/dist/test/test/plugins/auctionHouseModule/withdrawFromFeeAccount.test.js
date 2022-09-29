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
const types_1 = require("../../../src/types");
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] withdraw from fee account on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and airdropped 100 SOL to fee account.
    const mx = yield (0, helpers_1.metaplex)();
    const payer = yield (0, helpers_1.createWallet)(mx);
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        payer,
        confirmOptions: { skipPreflight: true },
    })
        .run();
    // And withdrawal destination has 100 SOL.
    const originalFeeWithdrawalDestinationBalance = yield mx
        .rpc()
        .getBalance((0, types_1.toPublicKey)(auctionHouse.feeWithdrawalDestinationAddress));
    t.same(originalFeeWithdrawalDestinationBalance.basisPoints.toNumber(), (0, types_1.sol)(100).basisPoints.toNumber());
    yield mx.rpc().airdrop(auctionHouse.feeAccountAddress, (0, types_1.sol)(100));
    // When we withdraw 1 SOL from fee account.
    yield mx
        .auctionHouse()
        .withdrawFromFeeAccount({
        auctionHouse,
        payer,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then fee account has 99 SOL in it.
    const feeAccountBalance = yield mx
        .rpc()
        .getBalance(auctionHouse.feeAccountAddress);
    t.same(feeAccountBalance.basisPoints.toNumber(), (0, types_1.sol)(99).basisPoints.toNumber());
    // And withdrawal destination account got 1 SOL more after withdrawal.
    const feeWithdrawalDestinationBalance = yield mx
        .rpc()
        .getBalance((0, types_1.toPublicKey)(auctionHouse.feeWithdrawalDestinationAddress));
    t.same(feeWithdrawalDestinationBalance.basisPoints.toNumber(), (0, types_1.sol)(101).basisPoints.toNumber());
}));
(0, tape_1.default)('[auctionHouseModule] withdraw from fee account to a different wallet on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and airdropped 100 SOL to fee destination account.
    const mx = yield (0, helpers_1.metaplex)();
    const feeWithdrawalDestination = yield (0, helpers_1.createWallet)(mx);
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        feeWithdrawalDestination: (0, types_1.toPublicKey)(feeWithdrawalDestination),
    })
        .run();
    yield mx.rpc().airdrop(auctionHouse.feeAccountAddress, (0, types_1.sol)(100));
    // When we withdraw 1 SOL from fee account.
    yield mx
        .auctionHouse()
        .withdrawFromFeeAccount({
        auctionHouse,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then withdrawal destination account has 101 SOL in it.
    const feeWithdrawalDestinationBalance = yield mx
        .rpc()
        .getBalance((0, types_1.toPublicKey)(feeWithdrawalDestination));
    t.same(feeWithdrawalDestinationBalance.basisPoints.toNumber(), (0, types_1.sol)(101).basisPoints.toNumber());
}));
//# sourceMappingURL=withdrawFromFeeAccount.test.js.map
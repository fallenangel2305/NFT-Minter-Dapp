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
const helpers_2 = require("./helpers");
const plugins_1 = require("../../../src/plugins");
const web3_js_1 = require("@solana/web3.js");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] withdraw from buyer account on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And deposit 1 SOL to the buyer's escrow account.
    yield mx
        .auctionHouse()
        .depositToBuyerAccount({
        auctionHouse,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then buyer's escrow account has SOL in it
    let buyerEscrow = (0, plugins_1.findAuctionHouseBuyerEscrowPda)(auctionHouse.address, mx.identity().publicKey);
    let buyerEscrowBalance = yield mx.rpc().getBalance(buyerEscrow);
    const minimumRentExempt = yield mx.rpc().getRent(0);
    t.same(buyerEscrowBalance.basisPoints.toNumber(), (0, types_1.addAmounts)((0, types_1.sol)(1), minimumRentExempt).basisPoints.toNumber());
    // When we withdraw 1 SOL from the buyer's escrow account.
    yield mx
        .auctionHouse()
        .withdrawFromBuyerAccount({
        auctionHouse,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then buyer's escrow account has minimum rent exempt SOL
    buyerEscrowBalance = yield mx.rpc().getBalance(buyerEscrow);
    t.same(buyerEscrowBalance.basisPoints.toNumber(), minimumRentExempt.basisPoints.toNumber());
}));
(0, tape_1.default)('[auctionHouseModule] withdraw from buyer account on an Auction House with assigned authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const authority = yield (0, helpers_1.createWallet)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, { authority });
    // And deposit 1 SOL to the buyer's escrow account.
    yield mx
        .auctionHouse()
        .depositToBuyerAccount({
        auctionHouse,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then buyer's escrow account has SOL in it
    let buyerEscrow = (0, plugins_1.findAuctionHouseBuyerEscrowPda)(auctionHouse.address, mx.identity().publicKey);
    let buyerEscrowBalance = yield mx.rpc().getBalance(buyerEscrow);
    const minimumRentExempt = yield mx.rpc().getRent(0);
    t.same(buyerEscrowBalance.basisPoints.toNumber(), (0, types_1.addAmounts)((0, types_1.sol)(1), minimumRentExempt).basisPoints.toNumber());
    // When we withdraw 1 SOL from the buyer's escrow account.
    yield mx
        .auctionHouse()
        .withdrawFromBuyerAccount({
        auctionHouse,
        amount: (0, types_1.sol)(1),
        authority,
    })
        .run();
    // Then buyer's escrow account has minimum rent exempt SOL
    buyerEscrowBalance = yield mx.rpc().getBalance(buyerEscrow);
    t.same(buyerEscrowBalance.basisPoints.toNumber(), minimumRentExempt.basisPoints.toNumber());
}));
(0, tape_1.default)('[auctionHouseModule] withdraw from buyer account on an Auctioneer Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auctioneer Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // And we deposit 1 SOL.
    yield mx
        .auctionHouse()
        .depositToBuyerAccount({
        auctionHouse,
        auctioneerAuthority,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then buyer's escrow account has SOL in it.
    let buyerEscrowBalance = yield mx
        .auctionHouse()
        .getBuyerBalance({
        auctionHouse: auctionHouse.address,
        buyerAddress: mx.identity().publicKey,
    })
        .run();
    const minimumRentExempt = yield mx.rpc().getRent(0);
    t.same(buyerEscrowBalance.basisPoints.toNumber(), (0, types_1.addAmounts)((0, types_1.sol)(1), minimumRentExempt).basisPoints.toNumber());
    // When we withdraw 1 SOL from the buyer's escrow account.
    yield mx
        .auctionHouse()
        .withdrawFromBuyerAccount({
        auctionHouse,
        auctioneerAuthority,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then buyer's escrow account has minimum rent exempt SOL
    buyerEscrowBalance = buyerEscrowBalance = yield mx
        .auctionHouse()
        .getBuyerBalance({
        auctionHouse: auctionHouse.address,
        buyerAddress: mx.identity().publicKey,
    })
        .run();
    t.same(buyerEscrowBalance.basisPoints.toNumber(), minimumRentExempt.basisPoints.toNumber());
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Auctioneer Authority is not provided in Auctioneer Withdraw', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // When we don't provide auctioneer authority to withdrawFromBuyerAccount.
    const promise = mx
        .auctionHouse()
        .withdrawFromBuyerAccount({
        auctionHouse,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /you have not provided the required "auctioneerAuthority" parameter/);
}));
//# sourceMappingURL=withdrawFromBuyerAccount.test.js.map
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
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] withdraw from treasury account on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House with fee that equals 10% and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const payer = yield (0, helpers_1.createWallet)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, {
        sellerFeeBasisPoints: 1000,
        payer,
    });
    // And withdrawal destination has 100 SOL.
    const originalTreasuryWithdrawalDestinationBalance = yield mx
        .rpc()
        .getBalance((0, types_1.toPublicKey)(auctionHouse.treasuryWithdrawalDestinationAddress));
    t.same(originalTreasuryWithdrawalDestinationBalance.basisPoints.toNumber(), (0, types_1.sol)(100).basisPoints.toNumber());
    // And we airdropped 2 SOL to the treasury account.
    yield mx.rpc().airdrop(auctionHouse.treasuryAccountAddress, (0, types_1.sol)(2));
    // When we withdraw 1 SOL from treasury account.
    yield mx
        .auctionHouse()
        .withdrawFromTreasuryAccount({
        auctionHouse,
        payer,
        amount: (0, types_1.sol)(1),
    })
        .run();
    // Then treasury account has 1 SOL in it.
    const treasuryBalance = yield mx
        .rpc()
        .getBalance(auctionHouse.treasuryAccountAddress);
    t.same(treasuryBalance.basisPoints.toNumber(), (0, types_1.sol)(1).basisPoints.toNumber());
    // And withdrawal destination account has 101 SOL after withdrawal.
    const treasuryWithdrawalDestinationBalance = yield mx
        .rpc()
        .getBalance((0, types_1.toPublicKey)(auctionHouse.treasuryWithdrawalDestinationAddress));
    t.same(treasuryWithdrawalDestinationBalance.basisPoints.toNumber(), (0, types_1.sol)(101).basisPoints.toNumber());
}));
//# sourceMappingURL=withdrawFromTreasuryAccount.test.js.map
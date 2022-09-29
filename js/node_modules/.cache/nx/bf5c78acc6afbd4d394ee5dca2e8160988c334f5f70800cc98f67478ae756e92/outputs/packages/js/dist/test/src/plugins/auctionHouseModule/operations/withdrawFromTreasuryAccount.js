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
exports.withdrawFromTreasuryAccountBuilder = exports.withdrawFromTreasuryAccountOperationHandler = exports.withdrawFromTreasuryAccountOperation = void 0;
const utils_1 = require("../../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'WithdrawFromTreasuryAccountOperation';
/**
 * Transfers funds from Auction House Treasury Wallet to the Treasury Withdrawal Destination Wallet set on an Auction House creation.
 * By default Treasury Withdrawal Destination Wallet is set to `metaplex.identity()`.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .withdrawFromTreasuryAccount({ auctionHouse, amount })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.withdrawFromTreasuryAccountOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.withdrawFromTreasuryAccountOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.withdrawFromTreasuryAccountBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Transfers funds from Auction House Treasury Wallet to the Treasury Withdrawal Destination Wallet set on an Auction House creation.
 * By default Treasury Withdrawal Destination Wallet is set to `metaplex.identity()`.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .withdrawFromTreasuryAccount({ auctionHouse, amount });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const withdrawFromTreasuryAccountBuilder = (metaplex, params) => {
    // Data.
    const { auctionHouse, amount, instructionKey, payer = metaplex.identity(), authority = metaplex.identity(), } = params;
    // Accounts.
    const auctionHouseTreasury = (0, pdas_1.findAuctionHouseTreasuryPda)(auctionHouse.address);
    const accounts = {
        treasuryMint: auctionHouse.treasuryMint.address,
        authority: auctionHouse.authorityAddress,
        treasuryWithdrawalDestination: auctionHouse.treasuryWithdrawalDestinationAddress,
        auctionHouseTreasury: auctionHouseTreasury,
        auctionHouse: auctionHouse.address,
    };
    // Args.
    const args = {
        amount: amount.basisPoints,
    };
    // Withdraw From Treasury Instruction.
    const withdrawFromTreasuryInstruction = (0, mpl_auction_house_1.createWithdrawFromTreasuryInstruction)(accounts, args);
    // Signers.
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Withdraw From Treasury.
        .add({
        instruction: withdrawFromTreasuryInstruction,
        signers: [authority],
        key: instructionKey !== null && instructionKey !== void 0 ? instructionKey : 'withdrawFromTreasuryAccount',
    }));
};
exports.withdrawFromTreasuryAccountBuilder = withdrawFromTreasuryAccountBuilder;
//# sourceMappingURL=withdrawFromTreasuryAccount.js.map
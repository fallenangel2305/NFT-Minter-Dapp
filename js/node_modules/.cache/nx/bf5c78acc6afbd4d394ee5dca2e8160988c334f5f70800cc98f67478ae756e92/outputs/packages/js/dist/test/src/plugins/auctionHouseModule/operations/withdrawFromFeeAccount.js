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
exports.withdrawFromFeeAccountBuilder = exports.withdrawFromFeeAccountOperationHandler = exports.withdrawFromFeeAccountOperation = void 0;
const utils_1 = require("../../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
// -----------------
// Operation
// -----------------
const Key = 'WithdrawFromFeeAccountOperation';
/**
 * Transfers funds from Auction House Fee Wallet to the Fee Withdrawal Destination Wallet.
 * By default Fee Withdrawal Destination Wallet is set to `metaplex.identity()`.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .withdrawFromFeeAccount({ auctionHouse, amount })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.withdrawFromFeeAccountOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.withdrawFromFeeAccountOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.withdrawFromFeeAccountBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Transfers funds from Auction House Fee Wallet to the Fee Withdrawal Destination Wallet.
 * By default Fee Withdrawal Destination Wallet is set to `metaplex.identity()`.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .withdrawFromFeeAccount({ auctionHouse, amount });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const withdrawFromFeeAccountBuilder = (metaplex, params) => {
    // Data.
    const { auctionHouse, amount, instructionKey, payer = metaplex.identity(), authority = metaplex.identity(), } = params;
    // Accounts.
    const accounts = {
        authority: auctionHouse.authorityAddress,
        feeWithdrawalDestination: auctionHouse.feeWithdrawalDestinationAddress,
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
    };
    // Args.
    const args = {
        amount: amount.basisPoints,
    };
    // Withdraw From Fee Instruction.
    const withdrawFromFeeInstruction = (0, mpl_auction_house_1.createWithdrawFromFeeInstruction)(accounts, args);
    // Signers.
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Withdraw From Fee.
        .add({
        instruction: withdrawFromFeeInstruction,
        signers: [authority],
        key: instructionKey !== null && instructionKey !== void 0 ? instructionKey : 'withdrawFromFeeAccount',
    }));
};
exports.withdrawFromFeeAccountBuilder = withdrawFromFeeAccountBuilder;
//# sourceMappingURL=withdrawFromFeeAccount.js.map
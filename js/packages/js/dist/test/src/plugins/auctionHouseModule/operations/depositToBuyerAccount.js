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
exports.depositToBuyerAccountBuilder = exports.depositToBuyerAccountOperationHandler = exports.depositToBuyerAccountOperation = void 0;
const utils_1 = require("../../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
const errors_1 = require("../errors");
// -----------------
// Operation
// -----------------
const Key = 'DepositToBuyerAccountOperation';
/**
 * Adds funds to the user's buyer escrow account for the given auction house.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .depositToBuyerAccount({ auctionHouse, buyer, amount })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.depositToBuyerAccountOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.depositToBuyerAccountOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.depositToBuyerAccountBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Adds funds to the user's buyer escrow account for the given auction house.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .depositToBuyerAccount({ auctionHouse, buyer, amount });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const depositToBuyerAccountBuilder = (metaplex, params) => {
    // Data.
    const { auctionHouse, auctioneerAuthority, amount, instructionKey, buyer = metaplex.identity(), payer = metaplex.identity(), } = params;
    if (auctionHouse.hasAuctioneer && !auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    // Accounts.
    const paymentAccount = auctionHouse.isNative
        ? (0, types_1.toPublicKey)(buyer)
        : (0, tokenModule_1.findAssociatedTokenAccountPda)(auctionHouse.treasuryMint.address, (0, types_1.toPublicKey)(buyer));
    const escrowPayment = (0, pdas_1.findAuctionHouseBuyerEscrowPda)(auctionHouse.address, (0, types_1.toPublicKey)(buyer));
    const accounts = {
        wallet: (0, types_1.toPublicKey)(buyer),
        paymentAccount,
        transferAuthority: (0, types_1.toPublicKey)(buyer),
        escrowPaymentAccount: escrowPayment,
        treasuryMint: auctionHouse.treasuryMint.address,
        authority: auctionHouse.authorityAddress,
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
    };
    // Args.
    const args = {
        escrowPaymentBump: escrowPayment.bump,
        amount: amount.basisPoints,
    };
    // Deposit Instruction.
    let depositInstruction = (0, mpl_auction_house_1.createDepositInstruction)(accounts, args);
    if (auctioneerAuthority) {
        const ahAuctioneerPda = (0, pdas_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority.publicKey);
        const accountsWithAuctioneer = Object.assign(Object.assign({}, accounts), { auctioneerAuthority: auctioneerAuthority.publicKey, ahAuctioneerPda });
        depositInstruction = (0, mpl_auction_house_1.createAuctioneerDepositInstruction)(Object.assign({}, accountsWithAuctioneer), args);
    }
    // Signers.
    const depositSigners = [buyer, auctioneerAuthority].filter(types_1.isSigner);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Deposit.
        .add({
        instruction: depositInstruction,
        signers: depositSigners,
        key: instructionKey !== null && instructionKey !== void 0 ? instructionKey : 'depositToBuyerAccount',
    }));
};
exports.depositToBuyerAccountBuilder = depositToBuyerAccountBuilder;
//# sourceMappingURL=depositToBuyerAccount.js.map
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
exports.withdrawFromBuyerAccountBuilder = exports.withdrawFromBuyerAccountOperationHandler = exports.withdrawFromBuyerAccountOperation = void 0;
const utils_1 = require("../../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
const pdas_1 = require("../pdas");
const errors_1 = require("../errors");
// -----------------
// Operation
// -----------------
const Key = 'WithdrawFromBuyerAccountOperation';
/**
 * Withdraws funds from the user's buyer escrow account for the given auction house.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .withdraw({ auctionHouse, buyer, amount })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.withdrawFromBuyerAccountOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.withdrawFromBuyerAccountOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.withdrawFromBuyerAccountBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Withdraws funds from the user's buyer escrow account to the given auction house.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .withdrawFromBuyerAccountBuilder({ auctionHouse, buyer, amount });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const withdrawFromBuyerAccountBuilder = (metaplex, params) => {
    var _a, _b, _c;
    const { auctionHouse, auctioneerAuthority, amount, payer = metaplex.identity(), } = params;
    if (auctionHouse.hasAuctioneer && !params.auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    const amountBasisPoint = amount.basisPoints;
    const buyer = (_a = params.buyer) !== null && _a !== void 0 ? _a : metaplex.identity();
    const authority = (_b = params.authority) !== null && _b !== void 0 ? _b : auctionHouse.authorityAddress;
    if (!(0, types_1.isSigner)(buyer) && !(0, types_1.isSigner)(authority)) {
        throw new errors_1.WithdrawFromBuyerAccountRequiresSignerError();
    }
    const escrowPayment = (0, pdas_1.findAuctionHouseBuyerEscrowPda)(auctionHouse.address, (0, types_1.toPublicKey)(buyer));
    // Accounts,
    const accounts = {
        wallet: (0, types_1.toPublicKey)(buyer),
        receiptAccount: (0, types_1.toPublicKey)(buyer),
        escrowPaymentAccount: escrowPayment,
        treasuryMint: auctionHouse.treasuryMint.address,
        authority: (0, types_1.toPublicKey)(authority),
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
    };
    // Args.
    const args = {
        escrowPaymentBump: escrowPayment.bump,
        amount: amountBasisPoint,
    };
    // Withdraw Instruction.
    let withdrawInstruction = (0, mpl_auction_house_1.createWithdrawInstruction)(accounts, args);
    if (auctioneerAuthority) {
        const ahAuctioneerPda = (0, pdas_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority.publicKey);
        const accountsWithAuctioneer = Object.assign(Object.assign({}, accounts), { auctioneerAuthority: auctioneerAuthority.publicKey, ahAuctioneerPda });
        withdrawInstruction = (0, mpl_auction_house_1.createAuctioneerWithdrawInstruction)(accountsWithAuctioneer, args);
    }
    // Signers.
    const signer = (0, types_1.isSigner)(buyer) ? buyer : authority;
    const withdrawSigners = [signer, params.auctioneerAuthority].filter(types_1.isSigner);
    // Update the account to be a signer since it's not covered properly by MPL due to its dynamic nature.
    const signerKeyIndex = withdrawInstruction.keys.findIndex((key) => key.pubkey.equals(signer.publicKey));
    withdrawInstruction.keys[signerKeyIndex].isSigner = true;
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Withdraw.
        .add({
        instruction: withdrawInstruction,
        signers: withdrawSigners,
        key: (_c = params.instructionKey) !== null && _c !== void 0 ? _c : 'withdrawFromBuyerAccount',
    }));
};
exports.withdrawFromBuyerAccountBuilder = withdrawFromBuyerAccountBuilder;
//# sourceMappingURL=withdrawFromBuyerAccount.js.map
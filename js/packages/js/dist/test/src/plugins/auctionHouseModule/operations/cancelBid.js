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
exports.cancelBidBuilder = exports.cancelBidOperationHandler = exports.cancelBidOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
const errors_1 = require("../errors");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'CancelBidOperation';
/**
 * Cancels the user's bid in the given auction house.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .cancelBid({ auctionHouse, bid })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.cancelBidOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.cancelBidOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.cancelBidBuilder)(operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Cancels the user's bid in the given auction house.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .cancelBid({ auctionHouse, bid });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const cancelBidBuilder = (params) => {
    var _a;
    const { auctionHouse, auctioneerAuthority, bid } = params;
    // Data.
    const { asset, buyerAddress, tradeStateAddress, price, receiptAddress, tokens, isPublic, } = bid;
    const { authorityAddress, address: auctionHouseAddress, feeAccountAddress, hasAuctioneer, } = auctionHouse;
    if (hasAuctioneer && !auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    // Accounts.
    const tokenAccount = isPublic
        ? (0, tokenModule_1.findAssociatedTokenAccountPda)(asset.mint.address, (0, types_1.toPublicKey)(buyerAddress))
        : asset.token.address;
    const accounts = {
        wallet: buyerAddress,
        tokenAccount,
        tokenMint: asset.address,
        authority: authorityAddress,
        auctionHouse: auctionHouseAddress,
        auctionHouseFeeAccount: feeAccountAddress,
        tradeState: tradeStateAddress,
    };
    // Args.
    const args = {
        buyerPrice: price.basisPoints,
        tokenSize: tokens.basisPoints,
    };
    // Cancel Bid Instruction.
    let cancelBidInstruction = (0, mpl_auction_house_1.createCancelInstruction)(accounts, args);
    if (auctioneerAuthority) {
        cancelBidInstruction = (0, mpl_auction_house_1.createAuctioneerCancelInstruction)(Object.assign(Object.assign({}, accounts), { auctioneerAuthority: auctioneerAuthority.publicKey, ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouseAddress, auctioneerAuthority.publicKey) }), args);
    }
    // Signers.
    const cancelSigners = [auctioneerAuthority].filter(types_1.isSigner);
    return (utils_1.TransactionBuilder.make()
        // Cancel Bid.
        .add({
        instruction: cancelBidInstruction,
        signers: cancelSigners,
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'cancelBid',
    })
        // Cancel Bid Receipt.
        .when(Boolean(receiptAddress), (builder) => builder.add({
        instruction: (0, mpl_auction_house_1.createCancelBidReceiptInstruction)({
            receipt: receiptAddress,
            instruction: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        }),
        signers: [],
        key: 'cancelBidReceipt',
    })));
};
exports.cancelBidBuilder = cancelBidBuilder;
//# sourceMappingURL=cancelBid.js.map
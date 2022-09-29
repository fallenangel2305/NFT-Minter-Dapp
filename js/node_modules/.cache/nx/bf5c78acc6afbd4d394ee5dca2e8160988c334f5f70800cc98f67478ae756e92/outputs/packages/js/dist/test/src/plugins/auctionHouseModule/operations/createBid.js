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
exports.createBidBuilder = exports.createBidOperationHandler = exports.createBidOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../../../utils");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
const tokenModule_1 = require("../../tokenModule");
const nftModule_1 = require("../../nftModule");
const pdas_1 = require("../pdas");
const errors_1 = require("../errors");
// -----------------
// Operation
// -----------------
const Key = 'CreateBidOperation';
/**
 * Creates a bid on a given asset.
 *
 * You can post a public bid on a non-listed NFT by skipping seller and tokenAccount properties.
 * Public bids are specific to the token itself and not to any specific auction.
 * This means that a bid can stay active beyond the end of an auction
 * and be resolved if it meets the criteria for subsequent auctions of that token.
 *
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .createBid({ auctionHouse, mintAccount, seller })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createBidOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createBidOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auctionHouse, confirmOptions } = operation.input;
            const builder = yield (0, exports.createBidBuilder)(metaplex, operation.input);
            const output = yield builder.sendAndConfirm(metaplex, confirmOptions);
            scope.throwIfCanceled();
            if (output.receipt) {
                const bid = yield metaplex
                    .auctionHouse()
                    .findBidByReceipt({
                    auctionHouse,
                    receiptAddress: output.receipt,
                })
                    .run(scope);
                return Object.assign({ bid }, output);
            }
            scope.throwIfCanceled();
            const lazyBid = {
                model: 'bid',
                lazy: true,
                auctionHouse,
                tradeStateAddress: output.buyerTradeState,
                bookkeeperAddress: output.bookkeeper,
                tokenAddress: output.tokenAccount,
                buyerAddress: output.buyer,
                metadataAddress: output.metadata,
                receiptAddress: output.receipt,
                purchaseReceiptAddress: null,
                isPublic: Boolean(output.tokenAccount),
                price: output.price,
                tokens: output.tokens.basisPoints,
                createdAt: (0, types_1.now)(),
                canceledAt: null,
            };
            return Object.assign({ bid: yield metaplex.auctionHouse().loadBid({ lazyBid }).run(scope) }, output);
        });
    },
};
/**
 * Creates a bid on a given asset.
 *
 * You can post a public bid on a non-listed NFT by skipping seller and tokenAccount properties.
 * Public bids are specific to the token itself and not to any specific auction.
 * This means that a bid can stay active beyond the end of an auction
 * and be resolved if it meets the criteria for subsequent auctions of that token.
 *
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .createBid({ auctionHouse, mintAccount, seller })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createBidBuilder = (metaplex, params) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Data.
    const auctionHouse = params.auctionHouse;
    const tokens = (_a = params.tokens) !== null && _a !== void 0 ? _a : (0, types_1.token)(1);
    const priceBasisPoint = (_c = (_b = params.price) === null || _b === void 0 ? void 0 : _b.basisPoints) !== null && _c !== void 0 ? _c : 0;
    const price = auctionHouse.isNative
        ? (0, types_1.lamports)(priceBasisPoint)
        : (0, types_1.amount)(priceBasisPoint, auctionHouse.treasuryMint.currency);
    if (auctionHouse.hasAuctioneer && !params.auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    // Accounts.
    const buyer = (_d = params.buyer) !== null && _d !== void 0 ? _d : metaplex.identity();
    const authority = (_e = params.authority) !== null && _e !== void 0 ? _e : auctionHouse.authorityAddress;
    const metadata = (0, nftModule_1.findMetadataPda)(params.mintAccount);
    const paymentAccount = auctionHouse.isNative
        ? (0, types_1.toPublicKey)(buyer)
        : (0, tokenModule_1.findAssociatedTokenAccountPda)(auctionHouse.treasuryMint.address, (0, types_1.toPublicKey)(buyer));
    const escrowPayment = (0, pdas_1.findAuctionHouseBuyerEscrowPda)(auctionHouse.address, (0, types_1.toPublicKey)(buyer));
    const tokenAccount = (_f = params.tokenAccount) !== null && _f !== void 0 ? _f : (params.seller
        ? (0, tokenModule_1.findAssociatedTokenAccountPda)(params.mintAccount, params.seller)
        : null);
    const buyerTokenAccount = (0, tokenModule_1.findAssociatedTokenAccountPda)(params.mintAccount, (0, types_1.toPublicKey)(buyer));
    const buyerTradeState = (0, pdas_1.findAuctionHouseTradeStatePda)(auctionHouse.address, (0, types_1.toPublicKey)(buyer), auctionHouse.treasuryMint.address, params.mintAccount, price.basisPoints, tokens.basisPoints, tokenAccount);
    const accounts = {
        wallet: (0, types_1.toPublicKey)(buyer),
        paymentAccount,
        transferAuthority: (0, types_1.toPublicKey)(buyer),
        treasuryMint: auctionHouse.treasuryMint.address,
        metadata,
        escrowPaymentAccount: escrowPayment,
        authority: (0, types_1.toPublicKey)(authority),
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
        buyerTradeState,
    };
    // Args.
    const args = {
        tradeStateBump: buyerTradeState.bump,
        escrowPaymentBump: escrowPayment.bump,
        buyerPrice: price.basisPoints,
        tokenSize: tokens.basisPoints,
    };
    // Sell Instruction.
    let buyInstruction;
    if (params.auctioneerAuthority) {
        const ahAuctioneerPda = (0, pdas_1.findAuctioneerPda)(auctionHouse.address, params.auctioneerAuthority.publicKey);
        const accountsWithAuctioneer = Object.assign(Object.assign({}, accounts), { auctioneerAuthority: params.auctioneerAuthority.publicKey, ahAuctioneerPda });
        buyInstruction = tokenAccount
            ? (0, mpl_auction_house_1.createAuctioneerBuyInstruction)(Object.assign(Object.assign({}, accountsWithAuctioneer), { tokenAccount }), args)
            : (0, mpl_auction_house_1.createAuctioneerPublicBuyInstruction)(Object.assign(Object.assign({}, accountsWithAuctioneer), { tokenAccount: buyerTokenAccount }), args);
    }
    else {
        buyInstruction = tokenAccount
            ? (0, mpl_auction_house_1.createBuyInstruction)(Object.assign(Object.assign({}, accounts), { tokenAccount }), args)
            : (0, mpl_auction_house_1.createPublicBuyInstruction)(Object.assign(Object.assign({}, accounts), { tokenAccount: buyerTokenAccount }), args);
    }
    // Signers.
    const buySigners = [buyer, authority, params.auctioneerAuthority].filter(types_1.isSigner);
    // Receipt.
    // Since createPrintBidReceiptInstruction can't deserialize createAuctioneerBuyInstruction due to a bug
    // Don't print Auctioneer Bid receipt for the time being.
    const shouldPrintReceipt = ((_g = params.printReceipt) !== null && _g !== void 0 ? _g : true) && !params.auctioneerAuthority;
    const bookkeeper = (_h = params.bookkeeper) !== null && _h !== void 0 ? _h : metaplex.identity();
    const receipt = (0, pdas_1.findBidReceiptPda)(buyerTradeState);
    const builder = utils_1.TransactionBuilder.make().setContext({
        buyerTradeState,
        tokenAccount,
        metadata,
        buyer: (0, types_1.toPublicKey)(buyer),
        receipt: shouldPrintReceipt ? receipt : null,
        bookkeeper: shouldPrintReceipt ? bookkeeper.publicKey : null,
        price,
        tokens,
    });
    // Create a TA for public bid if it doesn't exist
    if (!tokenAccount) {
        const account = yield metaplex.rpc().getAccount(buyerTokenAccount);
        if (!account.exists) {
            builder.add(yield metaplex
                .tokens()
                .builders()
                .createToken({
                mint: params.mintAccount,
                owner: (0, types_1.toPublicKey)(buyer),
            }));
        }
    }
    return (builder
        // Create bid.
        .add({
        instruction: buyInstruction,
        signers: buySigners,
        key: 'buy',
    })
        // Print the Bid Receipt.
        .when(shouldPrintReceipt, (builder) => builder.add({
        instruction: (0, mpl_auction_house_1.createPrintBidReceiptInstruction)({
            receipt,
            bookkeeper: bookkeeper.publicKey,
            instruction: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        }, { receiptBump: receipt.bump }),
        signers: [bookkeeper],
        key: 'printBidReceipt',
    })));
});
exports.createBidBuilder = createBidBuilder;
//# sourceMappingURL=createBid.js.map
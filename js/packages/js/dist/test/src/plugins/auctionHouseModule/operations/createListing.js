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
exports.createListingBuilder = exports.createListingOperationHandler = exports.createListingOperation = void 0;
const web3_js_1 = require("@solana/web3.js");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const pdas_1 = require("../pdas");
const tokenModule_1 = require("../../tokenModule");
const nftModule_1 = require("../../nftModule");
const constants_1 = require("../constants");
const errors_1 = require("../errors");
// -----------------
// Operation
// -----------------
const Key = 'CreateListingOperation';
/**
 * Creates a listing on a given asset.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .createListing({ auctionHouse, mintAccount })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createListingOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createListingOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auctionHouse, confirmOptions } = operation.input;
            const output = yield (0, exports.createListingBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, confirmOptions);
            scope.throwIfCanceled();
            if (output.receipt) {
                const listing = yield metaplex
                    .auctionHouse()
                    .findListingByReceipt({
                    receiptAddress: output.receipt,
                    auctionHouse,
                })
                    .run(scope);
                return Object.assign({ listing }, output);
            }
            scope.throwIfCanceled();
            const lazyListing = {
                model: 'listing',
                lazy: true,
                auctionHouse,
                tradeStateAddress: output.sellerTradeState,
                bookkeeperAddress: output.bookkeeper,
                sellerAddress: output.seller,
                metadataAddress: output.metadata,
                receiptAddress: output.receipt,
                purchaseReceiptAddress: null,
                price: output.price,
                tokens: output.tokens.basisPoints,
                createdAt: (0, types_1.now)(),
                canceledAt: null,
            };
            return Object.assign({ listing: yield metaplex
                    .auctionHouse()
                    .loadListing({ lazyListing })
                    .run(scope) }, output);
        });
    },
};
/**
 * @group Transaction Builders
 * @category Constructors
 */
const createListingBuilder = (metaplex, params) => {
    var _a, _b, _c, _d, _e;
    const { auctionHouse, auctioneerAuthority, mintAccount, payer = metaplex.identity(), tokens = (0, types_1.token)(1), seller = metaplex.identity(), authority = auctionHouse.authorityAddress, } = params;
    // Data.
    const priceBasisPoint = auctioneerAuthority
        ? constants_1.AUCTIONEER_PRICE
        : (_b = (_a = params.price) === null || _a === void 0 ? void 0 : _a.basisPoints) !== null && _b !== void 0 ? _b : 0;
    const price = auctionHouse.isNative
        ? (0, types_1.lamports)(priceBasisPoint)
        : (0, types_1.amount)(priceBasisPoint, auctionHouse.treasuryMint.currency);
    if (auctionHouse.hasAuctioneer && !auctioneerAuthority) {
        throw new errors_1.AuctioneerAuthorityRequiredError();
    }
    if (!(0, types_1.isSigner)(seller) && !(0, types_1.isSigner)(authority)) {
        throw new errors_1.CreateListingRequiresSignerError();
    }
    // Accounts.
    const metadata = (0, nftModule_1.findMetadataPda)(mintAccount);
    const tokenAccount = (_c = params.tokenAccount) !== null && _c !== void 0 ? _c : (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAccount, (0, types_1.toPublicKey)(seller));
    const sellerTradeState = (0, pdas_1.findAuctionHouseTradeStatePda)(auctionHouse.address, (0, types_1.toPublicKey)(seller), auctionHouse.treasuryMint.address, mintAccount, price.basisPoints, tokens.basisPoints, tokenAccount);
    const freeSellerTradeState = (0, pdas_1.findAuctionHouseTradeStatePda)(auctionHouse.address, (0, types_1.toPublicKey)(seller), auctionHouse.treasuryMint.address, mintAccount, (0, types_1.lamports)(0).basisPoints, tokens.basisPoints, tokenAccount);
    const programAsSigner = (0, pdas_1.findAuctionHouseProgramAsSignerPda)();
    const accounts = {
        wallet: (0, types_1.toPublicKey)(seller),
        tokenAccount,
        metadata,
        authority: (0, types_1.toPublicKey)(authority),
        auctionHouse: auctionHouse.address,
        auctionHouseFeeAccount: auctionHouse.feeAccountAddress,
        sellerTradeState,
        freeSellerTradeState,
        programAsSigner,
    };
    // Args.
    const args = {
        tradeStateBump: sellerTradeState.bump,
        freeTradeStateBump: freeSellerTradeState.bump,
        programAsSignerBump: programAsSigner.bump,
        buyerPrice: price.basisPoints,
        tokenSize: tokens.basisPoints,
    };
    // Sell Instruction.
    let sellInstruction = (0, mpl_auction_house_1.createSellInstruction)(accounts, args);
    if (auctioneerAuthority) {
        sellInstruction = (0, mpl_auction_house_1.createAuctioneerSellInstruction)(Object.assign(Object.assign({}, accounts), { auctioneerAuthority: auctioneerAuthority.publicKey, ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority.publicKey) }), args);
    }
    // Signers.
    const signer = (0, types_1.isSigner)(seller) ? seller : authority;
    const sellSigners = [signer, auctioneerAuthority].filter(types_1.isSigner);
    // Update the account to be a signer since it's not covered properly by MPL due to its dynamic nature.
    const signerKeyIndex = sellInstruction.keys.findIndex((key) => key.pubkey.equals(signer.publicKey));
    sellInstruction.keys[signerKeyIndex].isSigner = true;
    // Receipt.
    // Since createPrintListingReceiptInstruction can't deserialize createAuctioneerSellInstruction due to a bug
    // Don't print Auctioneer Sell receipt for the time being.
    const shouldPrintReceipt = ((_d = params.printReceipt) !== null && _d !== void 0 ? _d : true) && !auctioneerAuthority;
    const bookkeeper = (_e = params.bookkeeper) !== null && _e !== void 0 ? _e : metaplex.identity();
    const receipt = (0, pdas_1.findListingReceiptPda)(sellerTradeState);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        sellerTradeState,
        freeSellerTradeState,
        tokenAccount,
        metadata,
        seller: (0, types_1.toPublicKey)(seller),
        receipt: shouldPrintReceipt ? receipt : null,
        bookkeeper: shouldPrintReceipt ? bookkeeper.publicKey : null,
        price,
        tokens,
    })
        // Create Listing.
        .add({
        instruction: sellInstruction,
        signers: sellSigners,
        key: 'sell',
    })
        // Print the Listing Receipt.
        .when(shouldPrintReceipt, (builder) => builder.add({
        instruction: (0, mpl_auction_house_1.createPrintListingReceiptInstruction)({
            receipt,
            bookkeeper: bookkeeper.publicKey,
            instruction: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
        }, { receiptBump: receipt.bump }),
        signers: [bookkeeper],
        key: 'printListingReceipt',
    })));
};
exports.createListingBuilder = createListingBuilder;
//# sourceMappingURL=createListing.js.map
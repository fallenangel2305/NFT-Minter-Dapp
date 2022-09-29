"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionHouseClient = void 0;
const AuctionHouseBuildersClient_1 = require("./AuctionHouseBuildersClient");
const operations_1 = require("./operations");
/**
 * This is a client for the Auction House module.
 *
 * It enables us to interact with the Auction House program in order to
 * create and update Auction House to configure a marketplace as well to allow
 * users to list, bid and execute sales.
 *
 * You may access this client via the `auctionHouse()` method of your `Metaplex` instance.
 *
 * ```ts
 * const auctionHouseClient = metaplex.auctionHouse();
 * ```
 *
 * @example
 * You can create a new Auction House with minimum input like so.
 * By default, the current identity of the Metaplex instance will be
 * the authority of the Auction House.
 *
 * ```ts
 * const { auctionHouse } = await metaplex
 *   .auctionHouse()
 *   .create({
 *     sellerFeeBasisPoints: 500, // 5% royalties
 *   })
 *   .run();
 * ```
 *
 * @see {@link AuctionHouse} The `AuctionHouse` model
 * @group Modules
 */
class AuctionHouseClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    /**
     * You may use the `builders()` client to access the
     * underlying Transaction Builders of this module.
     *
     * ```ts
     * const buildersClient = metaplex.auctions().builders();
     * ```
     */
    builders() {
        return new AuctionHouseBuildersClient_1.AuctionHouseBuildersClient(this.metaplex);
    }
    /** {@inheritDoc createBidOperation} */
    bid(input) {
        return this.metaplex.operations().getTask((0, operations_1.createBidOperation)(input));
    }
    /** {@inheritDoc cancelBidOperation} */
    cancelBid(input) {
        return this.metaplex.operations().getTask((0, operations_1.cancelBidOperation)(input));
    }
    /** {@inheritDoc cancelListingOperation} */
    cancelListing(input) {
        return this.metaplex.operations().getTask((0, operations_1.cancelListingOperation)(input));
    }
    /** {@inheritDoc createAuctionHouseOperation} */
    create(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.createAuctionHouseOperation)(input));
    }
    /** {@inheritDoc depositToBuyerAccountOperation} */
    depositToBuyerAccount(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.depositToBuyerAccountOperation)(input));
    }
    /** {@inheritDoc executeSaleOperation} */
    executeSale(input) {
        return this.metaplex.operations().getTask((0, operations_1.executeSaleOperation)(input));
    }
    /** {@inheritDoc findAuctionHouseByAddressOperation} */
    findByAddress(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findAuctionHouseByAddressOperation)(options));
    }
    /** {@inheritDoc findAuctionHouseByCreatorAndMintOperation} */
    findByCreatorAndMint(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findAuctionHouseByCreatorAndMintOperation)(options));
    }
    /** {@inheritDoc findBidByReceiptOperation} */
    findBidByReceipt(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findBidByReceiptOperation)(options));
    }
    /** {@inheritDoc findBidByTradeStateOperation} */
    findBidByTradeState(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findBidByTradeStateOperation)(options));
    }
    /** {@inheritDoc findBidsByPublicKeyFieldOperation} */
    findBidsBy(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findBidsByPublicKeyFieldOperation)(input));
    }
    /** {@inheritDoc findListingByTradeStateOperation} */
    findListingByTradeState(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findListingByTradeStateOperation)(options));
    }
    /** {@inheritDoc findListingByReceiptOperation} */
    findListingByReceipt(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findListingByReceiptOperation)(options));
    }
    /** {@inheritDoc findListingsByPublicKeyFieldOperation} */
    findListingsBy(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findListingsByPublicKeyFieldOperation)(input));
    }
    /** {@inheritDoc findPurchaseByTradeStateOperation} */
    findPurchaseByTradeState(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findPurchaseByTradeStateOperation)(options));
    }
    /** {@inheritDoc findPurchaseByReceiptOperation} */
    findPurchaseByReceipt(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findPurchaseByReceiptOperation)(options));
    }
    /** {@inheritDoc findPurchasesByPublicKeyFieldOperation} */
    findPurchasesBy(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findPurchasesByPublicKeyFieldOperation)(input));
    }
    /** {@inheritDoc getBuyerBalanceOperation} */
    getBuyerBalance(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.getBuyerBalanceOperation)(options));
    }
    /** {@inheritDoc createListingOperation} */
    list(input) {
        return this.metaplex.operations().getTask((0, operations_1.createListingOperation)(input));
    }
    /** {@inheritDoc loadBidOperation} */
    loadBid(options) {
        return this.metaplex.operations().getTask((0, operations_1.loadBidOperation)(options));
    }
    /** {@inheritDoc loadListingOperation} */
    loadListing(options) {
        return this.metaplex.operations().getTask((0, operations_1.loadListingOperation)(options));
    }
    /** {@inheritDoc loadPurchaseOperation} */
    loadPurchase(options) {
        return this.metaplex.operations().getTask((0, operations_1.loadPurchaseOperation)(options));
    }
    /** {@inheritDoc updateAuctionHouseOperation} */
    update(options) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.updateAuctionHouseOperation)(options));
    }
    /** {@inheritDoc withdrawFromBuyerAccountOperation} */
    withdrawFromBuyerAccount(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.withdrawFromBuyerAccountOperation)(input));
    }
    /** {@inheritDoc withdrawFromFeeAccountOperation} */
    withdrawFromFeeAccount(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.withdrawFromFeeAccountOperation)(input));
    }
    /** {@inheritDoc withdrawFromTreasuryAccountOperation} */
    withdrawFromTreasuryAccount(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.withdrawFromTreasuryAccountOperation)(input));
    }
}
exports.AuctionHouseClient = AuctionHouseClient;
//# sourceMappingURL=AuctionHouseClient.js.map
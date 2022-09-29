"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionHouseBuildersClient = void 0;
const operations_1 = require("./operations");
const createAuctionHouse_1 = require("./operations/createAuctionHouse");
const createBid_1 = require("./operations/createBid");
const createListing_1 = require("./operations/createListing");
const executeSale_1 = require("./operations/executeSale");
const updateAuctionHouse_1 = require("./operations/updateAuctionHouse");
/**
 * This client allows you to access the underlying Transaction Builders
 * for the write operations of the Auction House module.
 *
 * @see {@link AuctionsClient}
 * @group Module Builders
 * */
class AuctionHouseBuildersClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    /** {@inheritDoc createBidBuilder} */
    bid(input) {
        return (0, createBid_1.createBidBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc cancelBidBuilder} */
    cancelBid(input) {
        return (0, operations_1.cancelBidBuilder)(input);
    }
    /** {@inheritDoc cancelListingBuilder} */
    cancelListing(input) {
        return (0, operations_1.cancelListingBuilder)(input);
    }
    /** {@inheritDoc createAuctionHouseBuilder} */
    createAuctionHouse(input) {
        return (0, createAuctionHouse_1.createAuctionHouseBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc depositToBuyerAccountBuilder} */
    depositToBuyerAccount(input) {
        return (0, operations_1.depositToBuyerAccountBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc executeSaleBuilder} */
    executeSale(input) {
        return (0, executeSale_1.executeSaleBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc createListingBuilder} */
    list(input) {
        return (0, createListing_1.createListingBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc updateAuctionHouseBuilder} */
    updateAuctionHouse(input) {
        return (0, updateAuctionHouse_1.updateAuctionHouseBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc withdrawFromBuyerAccountBuilder} */
    withdrawFromBuyerAccount(input) {
        return (0, operations_1.withdrawFromBuyerAccountBuilder)(this.metaplex, input);
    }
}
exports.AuctionHouseBuildersClient = AuctionHouseBuildersClient;
//# sourceMappingURL=AuctionHouseBuildersClient.js.map
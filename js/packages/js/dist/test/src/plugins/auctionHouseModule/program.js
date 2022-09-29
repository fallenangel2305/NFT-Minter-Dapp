"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuctionHouseProgram = void 0;
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const gpaBuilders_1 = require("./gpaBuilders");
/** @group Programs */
exports.AuctionHouseProgram = {
    publicKey: mpl_auction_house_1.PROGRAM_ID,
    bidAccounts(metaplex) {
        return new gpaBuilders_1.BidReceiptGpaBuilder(metaplex, this.publicKey);
    },
    listingAccounts(metaplex) {
        return new gpaBuilders_1.ListingReceiptGpaBuilder(metaplex, this.publicKey);
    },
    purchaseAccounts(metaplex) {
        return new gpaBuilders_1.PurchaseReceiptGpaBuilder(metaplex, this.publicKey);
    },
};
//# sourceMappingURL=program.js.map
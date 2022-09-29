"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingReceiptGpaBuilder = void 0;
const utils_1 = require("../../../utils");
const web3_js_1 = require("@solana/web3.js");
// TODO: copied from auction house SDK
// SDK should either provide a GPA builder or expose this discriminator
const listingReceiptDiscriminator = [
    240, 71, 225, 94, 200, 75, 84, 231,
];
const PUBLIC_KEY_LENGTH = web3_js_1.PublicKey.default.toBytes().byteLength;
const TRADE_STATE = listingReceiptDiscriminator.length;
const BOOKKEEPER = TRADE_STATE + PUBLIC_KEY_LENGTH;
const AUCTION_HOUSE = BOOKKEEPER + PUBLIC_KEY_LENGTH;
const SELLER = AUCTION_HOUSE + PUBLIC_KEY_LENGTH;
const METADATA = SELLER + PUBLIC_KEY_LENGTH;
class ListingReceiptGpaBuilder extends utils_1.GpaBuilder {
    whereDiscriminator(discrimator) {
        return this.where(0, Buffer.from(discrimator));
    }
    listingReceiptAccounts() {
        return this.whereDiscriminator(listingReceiptDiscriminator);
    }
    whereAuctionHouse(auctionHouseAddress) {
        return this.listingReceiptAccounts().where(AUCTION_HOUSE, auctionHouseAddress);
    }
    whereSeller(sellerAddress) {
        return this.listingReceiptAccounts().where(SELLER, sellerAddress);
    }
    whereMetadata(metadataAddress) {
        return this.listingReceiptAccounts().where(METADATA, metadataAddress);
    }
}
exports.ListingReceiptGpaBuilder = ListingReceiptGpaBuilder;
//# sourceMappingURL=ListingReceiptGpaBuilder.js.map
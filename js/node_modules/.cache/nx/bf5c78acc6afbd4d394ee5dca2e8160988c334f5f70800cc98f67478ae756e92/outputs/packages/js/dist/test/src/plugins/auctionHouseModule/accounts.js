"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPurchaseReceiptAccount = exports.parsePurchaseReceiptAccount = exports.toBidReceiptAccount = exports.parseBidReceiptAccount = exports.toListingReceiptAccount = exports.parseListingReceiptAccount = exports.toAuctionHouseAccount = exports.parseAuctionHouseAccount = exports.toAuctioneerAccount = exports.parseAuctioneerAccount = void 0;
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../types");
/** @group Account Helpers */
exports.parseAuctioneerAccount = (0, types_1.getAccountParsingFunction)(mpl_auction_house_1.Auctioneer);
/** @group Account Helpers */
exports.toAuctioneerAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_auction_house_1.Auctioneer);
/** @group Account Helpers */
exports.parseAuctionHouseAccount = (0, types_1.getAccountParsingFunction)(mpl_auction_house_1.AuctionHouse);
/** @group Account Helpers */
exports.toAuctionHouseAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_auction_house_1.AuctionHouse);
/** @group Account Helpers */
exports.parseListingReceiptAccount = (0, types_1.getAccountParsingFunction)(mpl_auction_house_1.ListingReceipt);
/** @group Account Helpers */
exports.toListingReceiptAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_auction_house_1.ListingReceipt);
/** @group Account Helpers */
exports.parseBidReceiptAccount = (0, types_1.getAccountParsingFunction)(mpl_auction_house_1.BidReceipt);
/** @group Account Helpers */
exports.toBidReceiptAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_auction_house_1.BidReceipt);
/** @group Account Helpers */
exports.parsePurchaseReceiptAccount = (0, types_1.getAccountParsingFunction)(mpl_auction_house_1.PurchaseReceipt);
/** @group Account Helpers */
exports.toPurchaseReceiptAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_auction_house_1.PurchaseReceipt);
//# sourceMappingURL=accounts.js.map
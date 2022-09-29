"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUCTIONEER_ALL_SCOPES = exports.AUCTIONEER_PRICE = void 0;
const types_1 = require("../../types");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
// Auctioneer uses "u64::MAX" for the price which is "2^64 − 1".
exports.AUCTIONEER_PRICE = (0, types_1.toBigNumber)('18446744073709551615');
exports.AUCTIONEER_ALL_SCOPES = [
    mpl_auction_house_1.AuthorityScope.Deposit,
    mpl_auction_house_1.AuthorityScope.Buy,
    mpl_auction_house_1.AuthorityScope.PublicBuy,
    mpl_auction_house_1.AuthorityScope.ExecuteSale,
    mpl_auction_house_1.AuthorityScope.Sell,
    mpl_auction_house_1.AuthorityScope.Cancel,
    mpl_auction_house_1.AuthorityScope.Withdraw,
];
//# sourceMappingURL=constants.js.map
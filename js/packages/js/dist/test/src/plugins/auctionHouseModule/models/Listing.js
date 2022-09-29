"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLazyListing = exports.assertLazyListing = exports.isLazyListing = exports.toListing = exports.assertListing = exports.isListing = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
/** @group Model Helpers */
const isListing = (value) => typeof value === 'object' && value.model === 'listing' && !value.lazy;
exports.isListing = isListing;
/** @group Model Helpers */
function assertListing(value) {
    (0, utils_1.assert)((0, exports.isListing)(value), `Expected Listing type`);
}
exports.assertListing = assertListing;
/** @group Model Helpers */
const toListing = (account, auctionHouse, asset) => {
    const lazyListing = (0, exports.toLazyListing)(account, auctionHouse);
    return Object.assign(Object.assign({}, lazyListing), { model: 'listing', lazy: false, asset, tokens: (0, types_1.amount)(lazyListing.tokens, asset.mint.currency) });
};
exports.toListing = toListing;
/** @group Model Helpers */
const isLazyListing = (value) => typeof value === 'object' && value.model === 'listing' && value.lazy;
exports.isLazyListing = isLazyListing;
/** @group Model Helpers */
function assertLazyListing(value) {
    (0, utils_1.assert)((0, exports.isLazyListing)(value), `Expected LazyListing type`);
}
exports.assertLazyListing = assertLazyListing;
/** @group Model Helpers */
const toLazyListing = (account, auctionHouse) => {
    return {
        model: 'listing',
        lazy: true,
        auctionHouse: auctionHouse,
        tradeStateAddress: new types_1.Pda(account.data.tradeState, account.data.tradeStateBump),
        bookkeeperAddress: account.data.bookkeeper,
        sellerAddress: account.data.seller,
        metadataAddress: account.data.metadata,
        receiptAddress: new types_1.Pda(account.publicKey, account.data.bump),
        purchaseReceiptAddress: account.data.purchaseReceipt,
        // Data.
        price: auctionHouse.isNative
            ? (0, types_1.lamports)(account.data.price)
            : (0, types_1.amount)(account.data.price, auctionHouse.treasuryMint.currency),
        tokens: (0, types_1.toBigNumber)(account.data.tokenSize),
        createdAt: (0, types_1.toDateTime)(account.data.createdAt),
        canceledAt: (0, types_1.toOptionDateTime)(account.data.canceledAt),
    };
};
exports.toLazyListing = toLazyListing;
//# sourceMappingURL=Listing.js.map
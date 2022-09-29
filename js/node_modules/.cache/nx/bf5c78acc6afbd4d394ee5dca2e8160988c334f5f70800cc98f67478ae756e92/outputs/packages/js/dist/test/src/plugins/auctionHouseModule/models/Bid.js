"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLazyBid = exports.assertLazyBid = exports.isLazyBid = exports.toBid = exports.assertBid = exports.isBid = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
/** @group Model Helpers */
const isBid = (value) => typeof value === 'object' && value.model === 'bid' && !value.lazy;
exports.isBid = isBid;
/** @group Model Helpers */
function assertBid(value) {
    (0, utils_1.assert)((0, exports.isBid)(value), `Expected Bid type`);
}
exports.assertBid = assertBid;
/** @group Model Helpers */
const toBid = (account, auctionHouse, asset) => {
    const lazyBid = (0, exports.toLazyBid)(account, auctionHouse);
    return Object.assign(Object.assign(Object.assign({}, lazyBid), { model: 'bid', lazy: false }), ('token' in asset
        ? {
            asset,
            tokens: (0, types_1.amount)(lazyBid.tokens, asset.mint.currency),
            isPublic: false,
        }
        : {
            asset,
            tokens: (0, types_1.amount)(lazyBid.tokens, asset.mint.currency),
            isPublic: true,
        }));
};
exports.toBid = toBid;
/** @group Model Helpers */
const isLazyBid = (value) => typeof value === 'object' && value.model === 'bid' && value.lazy;
exports.isLazyBid = isLazyBid;
/** @group Model Helpers */
function assertLazyBid(value) {
    (0, utils_1.assert)((0, exports.isLazyBid)(value), `Expected LazyBid type`);
}
exports.assertLazyBid = assertLazyBid;
/** @group Model Helpers */
const toLazyBid = (account, auctionHouse) => {
    return {
        model: 'bid',
        lazy: true,
        auctionHouse,
        tradeStateAddress: new types_1.Pda(account.data.tradeState, account.data.tradeStateBump),
        bookkeeperAddress: account.data.bookkeeper,
        buyerAddress: account.data.buyer,
        metadataAddress: account.data.metadata,
        tokenAddress: account.data.tokenAccount,
        receiptAddress: new types_1.Pda(account.publicKey, account.data.bump),
        purchaseReceiptAddress: account.data.purchaseReceipt,
        isPublic: Boolean(account.data.tokenAccount),
        // Data.
        price: auctionHouse.isNative
            ? (0, types_1.lamports)(account.data.price)
            : (0, types_1.amount)(account.data.price, auctionHouse.treasuryMint.currency),
        tokens: (0, types_1.toBigNumber)(account.data.tokenSize),
        createdAt: (0, types_1.toDateTime)(account.data.createdAt),
        canceledAt: (0, types_1.toOptionDateTime)(account.data.canceledAt),
    };
};
exports.toLazyBid = toLazyBid;
//# sourceMappingURL=Bid.js.map
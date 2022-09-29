"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLazyPurchase = exports.assertLazyPurchase = exports.isLazyPurchase = exports.toPurchase = exports.assertPurchase = exports.isPurchase = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const isPurchase = (value) => typeof value === 'object' && value.model === 'purchase' && !value.lazy;
exports.isPurchase = isPurchase;
function assertPurchase(value) {
    (0, utils_1.assert)((0, exports.isPurchase)(value), `Expected Purchase type`);
}
exports.assertPurchase = assertPurchase;
const toPurchase = (account, auctionHouseModel, asset) => {
    const lazyPurchase = (0, exports.toLazyPurchase)(account, auctionHouseModel);
    return Object.assign(Object.assign({}, lazyPurchase), { model: 'purchase', lazy: false, asset, tokens: (0, types_1.amount)(lazyPurchase.tokens, asset.mint.currency) });
};
exports.toPurchase = toPurchase;
const isLazyPurchase = (value) => typeof value === 'object' && value.model === 'purchase' && value.lazy;
exports.isLazyPurchase = isLazyPurchase;
function assertLazyPurchase(value) {
    (0, utils_1.assert)((0, exports.isLazyPurchase)(value), `Expected LazyPurchase type`);
}
exports.assertLazyPurchase = assertLazyPurchase;
const toLazyPurchase = (account, auctionHouseModel) => {
    return {
        model: 'purchase',
        lazy: true,
        auctionHouse: auctionHouseModel,
        buyerAddress: account.data.buyer,
        sellerAddress: account.data.seller,
        metadataAddress: account.data.metadata,
        bookkeeperAddress: account.data.bookkeeper,
        receiptAddress: account.publicKey,
        price: auctionHouseModel.isNative
            ? (0, types_1.lamports)(account.data.price)
            : (0, types_1.amount)(account.data.price, auctionHouseModel.treasuryMint.currency),
        tokens: (0, types_1.toBigNumber)(account.data.tokenSize),
        createdAt: (0, types_1.toDateTime)(account.data.createdAt),
    };
};
exports.toLazyPurchase = toLazyPurchase;
//# sourceMappingURL=Purchase.js.map
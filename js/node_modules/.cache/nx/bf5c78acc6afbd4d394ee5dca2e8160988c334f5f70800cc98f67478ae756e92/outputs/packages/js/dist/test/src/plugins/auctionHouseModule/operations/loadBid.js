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
exports.loadBidOperationHandler = exports.loadBidOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const nftModule_1 = require("../../nftModule");
// -----------------
// Operation
// -----------------
const Key = 'LoadBidOperation';
/**
 * Transforms a `LazyBid` model into a `Bid` model.
 *
 * ```ts
 * const bid = await metaplex
 *   .auctionHouse()
 *   .loadBid({ lazyBid })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.loadBidOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.loadBidOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { lazyBid, loadJsonMetadata = true, commitment } = operation.input;
        const bid = Object.assign(Object.assign({}, lazyBid), { model: 'bid', lazy: false });
        if (lazyBid.tokenAddress) {
            const asset = yield metaplex
                .nfts()
                .findByToken({
                token: lazyBid.tokenAddress,
                commitment,
                loadJsonMetadata,
            })
                .run(scope);
            scope.throwIfCanceled();
            (0, nftModule_1.assertNftOrSftWithToken)(asset);
            (0, utils_1.assert)(asset.metadataAddress.equals(lazyBid.metadataAddress), `Asset metadata address must be ${lazyBid.metadataAddress}`);
            return Object.assign(Object.assign({}, bid), { isPublic: false, asset, tokens: (0, types_1.amount)(lazyBid.tokens, asset.mint.currency) });
        }
        else {
            const asset = yield metaplex
                .nfts()
                .findByMetadata({
                metadata: lazyBid.metadataAddress,
                commitment,
                loadJsonMetadata,
            })
                .run(scope);
            scope.throwIfCanceled();
            return Object.assign(Object.assign({}, bid), { isPublic: true, asset, tokens: (0, types_1.amount)(lazyBid.tokens, asset.mint.currency) });
        }
    }),
};
//# sourceMappingURL=loadBid.js.map
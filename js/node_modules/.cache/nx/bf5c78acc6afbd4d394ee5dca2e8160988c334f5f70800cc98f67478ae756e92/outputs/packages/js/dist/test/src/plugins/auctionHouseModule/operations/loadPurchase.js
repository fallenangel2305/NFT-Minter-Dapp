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
exports.loadPurchaseOperationHandler = exports.loadPurchaseOperation = void 0;
const types_1 = require("../../../types");
const nftModule_1 = require("../../nftModule");
// -----------------
// Operation
// -----------------
const Key = 'LoadPurchaseOperation';
/**
 * Transforms a `LazyPurchase` model into a `Purchase` model.
 *
 * ```ts
 * const purchase = await metaplex
 *   .auctionHouse()
 *   .loadPurchase({ lazyPurchase })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.loadPurchaseOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.loadPurchaseOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { lazyPurchase, loadJsonMetadata = true, commitment, } = operation.input;
        const asset = yield metaplex
            .nfts()
            .findByMetadata({
            metadata: lazyPurchase.metadataAddress,
            tokenOwner: lazyPurchase.buyerAddress,
            commitment,
            loadJsonMetadata,
        })
            .run(scope);
        (0, nftModule_1.assertNftOrSftWithToken)(asset);
        return Object.assign(Object.assign({}, lazyPurchase), { lazy: false, isPublic: false, asset, tokens: (0, types_1.amount)(lazyPurchase.tokens, asset.mint.currency) });
    }),
};
//# sourceMappingURL=loadPurchase.js.map
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
exports.findPurchasesByPublicKeyFieldOperationHandler = exports.findPurchasesByPublicKeyFieldOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const nftModule_1 = require("../../nftModule");
const models_1 = require("../models");
const program_1 = require("../program");
const accounts_1 = require("../accounts");
// -----------------
// Operation
// -----------------
const Key = 'FindPurchasesByPublicKeyOperation';
/**
 * Finds multiple Purchases by specific criteria.
 *
 * ```ts
 * // Find purchases by seller.
 * const purchases = await metaplex
 *   .auctionHouse()
 *   .findPurchasesBy({ auctionHouse, type: 'seller', publicKey: seller })
 *   .run();
 *
 * // Find purchases by buyer.
 * const purchases = await metaplex
 *   .auctionHouse()
 *   .findPurchasesBy({ auctionHouse, type: 'buyer', publicKey: buyer })
 *   .run();
 *
 * // Find purchases by metadata.
 * const purchases = await metaplex
 *   .auctionHouse()
 *   .findPurchasesBy({ auctionHouse, type: 'metadata', publicKey: metadata })
 *   .run();
 *
 * // Find purchases by mint.
 * const purchases = await metaplex
 *   .auctionHouse()
 *   .findPurchasesBy({ auctionHouse, type: 'mint', publicKey: mint })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findPurchasesByPublicKeyFieldOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findPurchasesByPublicKeyFieldOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { auctionHouse, type, publicKey, commitment } = operation.input;
        const accounts = program_1.AuctionHouseProgram.purchaseAccounts(metaplex).mergeConfig({
            commitment,
        });
        let purchaseQuery = accounts.whereAuctionHouse(auctionHouse.address);
        switch (type) {
            case 'buyer':
                purchaseQuery = purchaseQuery.whereBuyer(publicKey);
                break;
            case 'seller':
                purchaseQuery = purchaseQuery.whereSeller(publicKey);
                break;
            case 'metadata':
                purchaseQuery = purchaseQuery.whereMetadata(publicKey);
                break;
            case 'mint':
                purchaseQuery = purchaseQuery.whereMetadata((0, nftModule_1.findMetadataPda)(publicKey));
                break;
            default:
                throw new errors_1.UnreachableCaseError(type);
        }
        scope.throwIfCanceled();
        return purchaseQuery.getAndMap((account) => (0, models_1.toLazyPurchase)((0, accounts_1.toPurchaseReceiptAccount)(account), auctionHouse));
    }),
};
//# sourceMappingURL=findPurchasesByPublicKeyField.js.map
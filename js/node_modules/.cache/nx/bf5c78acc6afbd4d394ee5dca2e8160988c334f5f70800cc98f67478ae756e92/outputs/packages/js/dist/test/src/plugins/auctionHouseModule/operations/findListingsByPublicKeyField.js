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
exports.findListingsByPublicKeyFieldOperationHandler = exports.findListingsByPublicKeyFieldOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const nftModule_1 = require("../../nftModule");
const models_1 = require("../models");
const program_1 = require("../program");
const accounts_1 = require("../accounts");
// -----------------
// Operation
// -----------------
const Key = 'FindListingsByPublicKeyOperation';
/**
 * Finds multiple Listings by specific criteria.
 *
 * ```ts
 * // Find listings by seller.
 * const listings = await metaplex
 *   .auctionHouse()
 *   .findListingsBy({ auctionHouse, type: 'seller', publicKey: seller })
 *   .run();
 *
 * // Find listings by metadata.
 * const listings = await metaplex
 *   .auctionHouse()
 *   .findListingsBy({ auctionHouse, type: 'metadata', publicKey: metadata })
 *   .run();
 *
 * // Find listings by mint.
 * const listings = await metaplex
 *   .auctionHouse()
 *   .findListingsBy({ auctionHouse, type: 'mint', publicKey: mint })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findListingsByPublicKeyFieldOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findListingsByPublicKeyFieldOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { auctionHouse, type, publicKey, commitment } = operation.input;
        const accounts = program_1.AuctionHouseProgram.listingAccounts(metaplex).mergeConfig({
            commitment,
        });
        let listingQuery = accounts.whereAuctionHouse(auctionHouse.address);
        switch (type) {
            case 'seller':
                listingQuery = listingQuery.whereSeller(publicKey);
                break;
            case 'metadata':
                listingQuery = listingQuery.whereMetadata(publicKey);
                break;
            case 'mint':
                listingQuery = listingQuery.whereMetadata((0, nftModule_1.findMetadataPda)(publicKey));
                break;
            default:
                throw new errors_1.UnreachableCaseError(type);
        }
        scope.throwIfCanceled();
        return listingQuery.getAndMap((account) => (0, models_1.toLazyListing)((0, accounts_1.toListingReceiptAccount)(account), auctionHouse));
    }),
};
//# sourceMappingURL=findListingsByPublicKeyField.js.map
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
exports.findBidsByPublicKeyFieldOperationHandler = exports.findBidsByPublicKeyFieldOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const nftModule_1 = require("../../nftModule");
const models_1 = require("../models");
const program_1 = require("../program");
const accounts_1 = require("../accounts");
// -----------------
// Operation
// -----------------
const Key = 'FindBidsByPublicKeyOperation';
/**
 * Finds multiple Bids by specific criteria.
 *
 * ```ts
 * // Find bids by buyer.
 * const bids = await metaplex
 *   .auctionHouse()
 *   .findBidsBy({ auctionHouse, type: 'buyer', publicKey: buyer })
 *   .run();
 *
 * // Find bids by metadata.
 * const bids = await metaplex
 *   .auctionHouse()
 *   .findBidsBy({ auctionHouse, type: 'metadata', publicKey: metadata })
 *   .run();
 *
 * // Find bids by mint.
 * const bids = await metaplex
 *   .auctionHouse()
 *   .findBidsBy({ auctionHouse, type: 'mint', publicKey: mint })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findBidsByPublicKeyFieldOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findBidsByPublicKeyFieldOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { auctionHouse, type, publicKey, commitment } = operation.input;
        const accounts = program_1.AuctionHouseProgram.bidAccounts(metaplex).mergeConfig({
            commitment,
        });
        let bidQuery = accounts.whereAuctionHouse(auctionHouse.address);
        switch (type) {
            case 'buyer':
                bidQuery = bidQuery.whereBuyer(publicKey);
                break;
            case 'metadata':
                bidQuery = bidQuery.whereMetadata(publicKey);
                break;
            case 'mint':
                bidQuery = bidQuery.whereMetadata((0, nftModule_1.findMetadataPda)(publicKey));
                break;
            default:
                throw new errors_1.UnreachableCaseError(type);
        }
        scope.throwIfCanceled();
        return bidQuery.getAndMap((account) => (0, models_1.toLazyBid)((0, accounts_1.toBidReceiptAccount)(account), auctionHouse));
    }),
};
//# sourceMappingURL=findBidsByPublicKeyField.js.map
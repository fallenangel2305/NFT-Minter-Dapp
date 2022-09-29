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
exports.findListingByReceiptOperationHandler = exports.findListingByReceiptOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const models_1 = require("../models");
// -----------------
// Operation
// -----------------
const Key = 'FindListingByReceiptOperation';
/**
 * Finds a Listing by its receipt address.
 *
 * ```ts
 * const nft = await metaplex
 *   .auctionHouse()
 *   .findListingByReceipt({ receiptAddress, auctionHouse })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findListingByReceiptOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findListingByReceiptOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { receiptAddress, auctionHouse, commitment } = operation.input;
        const account = (0, accounts_1.toListingReceiptAccount)(yield metaplex.rpc().getAccount(receiptAddress, commitment));
        scope.throwIfCanceled();
        const lazyListing = (0, models_1.toLazyListing)(account, auctionHouse);
        return metaplex
            .auctionHouse()
            .loadListing(Object.assign({ lazyListing }, operation.input))
            .run(scope);
    }),
};
//# sourceMappingURL=findListingByReceipt.js.map
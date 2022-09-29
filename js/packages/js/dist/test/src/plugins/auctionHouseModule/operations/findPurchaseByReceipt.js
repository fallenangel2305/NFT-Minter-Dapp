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
exports.findPurchaseByReceiptOperationHandler = exports.findPurchaseByReceiptOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const models_1 = require("../models");
// -----------------
// Operation
// -----------------
const Key = 'FindPurchaseByReceiptOperation';
/**
 * Finds a Purchase by its receipt address.
 *
 * ```ts
 * const nft = await metaplex
 *   .auctionHouse()
 *   .findPurchaseByReceipt({ receiptAddress, auctionHouse })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findPurchaseByReceiptOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findPurchaseByReceiptOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { receiptAddress, auctionHouse, commitment } = operation.input;
        const account = (0, accounts_1.toPurchaseReceiptAccount)(yield metaplex.rpc().getAccount(receiptAddress, commitment));
        scope.throwIfCanceled();
        const lazyPurchase = (0, models_1.toLazyPurchase)(account, auctionHouse);
        return metaplex
            .auctionHouse()
            .loadPurchase(Object.assign({ lazyPurchase }, operation.input))
            .run(scope);
    }),
};
//# sourceMappingURL=findPurchaseByReceipt.js.map
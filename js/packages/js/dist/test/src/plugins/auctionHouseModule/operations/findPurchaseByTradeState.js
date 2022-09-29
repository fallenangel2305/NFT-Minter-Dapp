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
exports.findPurchaseByTradeStateOperationHandler = exports.findPurchaseByTradeStateOperation = void 0;
const types_1 = require("../../../types");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'FindPurchaseByTradeStateOperation';
/**
 * Finds a Purchase by its trade state address.
 *
 * ```ts
 * const nft = await metaplex
 *   .auctionHouse()
 *   .findPurchaseByTradeState({ sellerTradeState, buyerTradeState, auctionHouse })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findPurchaseByTradeStateOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findPurchaseByTradeStateOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { sellerTradeState, buyerTradeState } = operation.input;
        const receiptAddress = (0, pdas_1.findPurchaseReceiptPda)(sellerTradeState, buyerTradeState);
        return metaplex
            .auctionHouse()
            .findPurchaseByReceipt(Object.assign({ receiptAddress }, operation.input))
            .run(scope);
    }),
};
//# sourceMappingURL=findPurchaseByTradeState.js.map
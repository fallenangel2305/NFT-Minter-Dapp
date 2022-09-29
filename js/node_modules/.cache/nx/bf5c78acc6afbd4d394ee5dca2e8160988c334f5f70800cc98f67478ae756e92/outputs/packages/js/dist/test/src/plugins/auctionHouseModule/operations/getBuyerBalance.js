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
exports.getBuyerBalanceOperationHandler = exports.getBuyerBalanceOperation = void 0;
const types_1 = require("../../../types");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'GetBuyerBalanceOperation';
/**
 * Gets the balance of a buyer's escrow account for a given Auction House.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .getBuyerBalance({ auctionHouse, buyerAddress })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.getBuyerBalanceOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.getBuyerBalanceOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const { auctionHouse, buyerAddress, commitment } = operation.input;
        const buyerEscrow = (0, pdas_1.findAuctionHouseBuyerEscrowPda)(auctionHouse, buyerAddress);
        return metaplex.rpc().getBalance(buyerEscrow, commitment);
    }),
};
//# sourceMappingURL=getBuyerBalance.js.map
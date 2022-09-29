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
exports.findAuctionHouseByCreatorAndMintOperationHandler = exports.findAuctionHouseByCreatorAndMintOperation = void 0;
const types_1 = require("../../../types");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'FindAuctionHouseByCreatorAndMintOperation';
/**
 * Finds an Auction House by its creator and treasury mint.
 *
 * ```ts
 * const nft = await metaplex
 *   .auctionHouse()
 *   .findByCreatorAndMint({ creator, treasuryMint })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findAuctionHouseByCreatorAndMintOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findAuctionHouseByCreatorAndMintOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const { creator, treasuryMint } = operation.input;
        return metaplex
            .auctionHouse()
            .findByAddress(Object.assign({ address: (0, pdas_1.findAuctionHousePda)(creator, treasuryMint) }, operation.input))
            .run();
    }),
};
//# sourceMappingURL=findAuctionHouseByCreatorAndMint.js.map
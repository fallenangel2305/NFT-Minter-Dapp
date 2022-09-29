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
exports.findAuctionHouseByAddressOperationHandler = exports.findAuctionHouseByAddressOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const pdas_1 = require("../pdas");
const errors_1 = require("../errors");
const AuctionHouse_1 = require("../models/AuctionHouse");
// -----------------
// Operation
// -----------------
const Key = 'FindAuctionHouseByAddressOperation';
/**
 * Finds an Auction House by its address.
 *
 * ```ts
 * const nft = await metaplex
 *   .auctionHouse()
 *   .findByAddress({ address })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findAuctionHouseByAddressOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findAuctionHouseByAddressOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { address, auctioneerAuthority, commitment } = operation.input;
        const auctioneerPda = auctioneerAuthority
            ? (0, pdas_1.findAuctioneerPda)(address, auctioneerAuthority)
            : undefined;
        const accountsToFetch = [address, auctioneerPda].filter((account) => !!account);
        const accounts = yield metaplex
            .rpc()
            .getMultipleAccounts(accountsToFetch, commitment);
        scope.throwIfCanceled();
        const auctionHouseAccount = (0, accounts_1.toAuctionHouseAccount)(accounts[0]);
        const mintModel = yield metaplex
            .tokens()
            .findMintByAddress({
            address: auctionHouseAccount.data.treasuryMint,
            commitment,
        })
            .run(scope);
        scope.throwIfCanceled();
        if (!auctionHouseAccount.data.hasAuctioneer) {
            return (0, AuctionHouse_1.toAuctionHouse)(auctionHouseAccount, mintModel);
        }
        if (!accounts[1] || !accounts[1].exists) {
            throw new errors_1.AuctioneerAuthorityRequiredError();
        }
        const auctioneerAccount = (0, accounts_1.toAuctioneerAccount)(accounts[1]);
        return (0, AuctionHouse_1.toAuctionHouse)(auctionHouseAccount, mintModel, auctioneerAccount);
    }),
};
//# sourceMappingURL=findAuctionHouseByAddress.js.map
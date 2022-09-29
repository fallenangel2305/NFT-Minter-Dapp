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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const types_1 = require("../../../src/types");
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] cancel a Listing on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And we listed that NFT for 1 SOL.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // The NFT will have delegated authority.
    t.ok(listing.asset.token.delegateAddress);
    // When we cancel the given listing.
    yield mx.auctionHouse().cancelListing({ auctionHouse, listing }).run();
    // Then the delegate's authority is revoked and receipt has canceledAt date.
    const canceledListing = yield mx
        .auctionHouse()
        .findListingByTradeState({
        tradeStateAddress: listing.tradeStateAddress,
        auctionHouse,
    })
        .run();
    t.false(canceledListing.asset.token.delegateAddress);
    t.ok(canceledListing.canceledAt);
    // And the trade state account no longer exists.
    const listingAccount = yield mx.rpc().getAccount(listing.tradeStateAddress);
    t.false(listingAccount.exists, 'listing account no longer exists');
}));
(0, tape_1.default)('[auctionHouseModule] cancel a Listing on an Auctioneer Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auctioneer Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // And we list that NFT.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
    })
        .run();
    // When we cancel the given listing.
    yield mx
        .auctionHouse()
        .cancelListing({ auctionHouse, auctioneerAuthority, listing })
        .run();
    // Then the trade state account no longer exists.
    const listingAccount = yield mx.rpc().getAccount(listing.tradeStateAddress);
    t.false(listingAccount.exists, 'listing account no longer exists');
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if executing a sale with a canceled Listing', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And we listed that NFT for 1 SOL.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And we put a public bid on that NFT for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And we cancel the given listing.
    yield mx.auctionHouse().cancelListing({ auctionHouse, listing }).run();
    // When we execute a sale with given canceled listing and bid.
    const canceledListing = yield mx
        .auctionHouse()
        .findListingByTradeState({
        tradeStateAddress: listing.tradeStateAddress,
        auctionHouse,
    })
        .run();
    const promise = mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: canceledListing, bid })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /You are trying to execute a sale using a canceled Listing./);
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Auctioneer Authority is not provided in Listing Cancel', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // And we listed that NFT.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
    })
        .run();
    // When we cancel the listing but without providing Auctioneer Authority.
    const promise = mx
        .auctionHouse()
        .cancelListing({ auctionHouse, listing })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /you have not provided the required "auctioneerAuthority" parameter/);
}));
//# sourceMappingURL=cancelListing.test.js.map
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
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const spok_1 = __importDefault(require("spok"));
const types_1 = require("../../../src/types");
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
const index_1 = require("../../../src/index");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] create a new listing on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // When we list that NFT for 6.5 SOL.
    const { listing, sellerTradeState } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(6.5),
    })
        .run();
    // Then we created and returned the new Listing with appropriate defaults.
    const expectedListing = {
        tradeStateAddress: (0, helpers_1.spokSamePubkey)(sellerTradeState),
        price: (0, helpers_1.spokSameAmount)((0, types_1.sol)(6.5)),
        tokens: (0, helpers_1.spokSameAmount)((0, types_1.token)(1)),
        auctionHouse: {
            address: (0, helpers_1.spokSamePubkey)(auctionHouse.address),
        },
        asset: {
            model: 'nft',
            address: (0, helpers_1.spokSamePubkey)(nft.address),
            token: {
                address: (0, index_1.findAssociatedTokenAccountPda)(nft.address, mx.identity().publicKey),
            },
        },
        receiptAddress: spok_1.default.defined,
    };
    (0, spok_1.default)(t, listing, Object.assign({ $topic: 'Listing' }, expectedListing));
    // And we get the same result when we fetch the Listing by address.
    const retrieveListing = yield mx
        .auctionHouse()
        .findListingByReceipt({
        receiptAddress: listing.receiptAddress,
        auctionHouse,
    })
        .run();
    (0, spok_1.default)(t, retrieveListing, Object.assign({ $topic: 'Retrieved Listing' }, expectedListing));
}));
(0, tape_1.default)('[auctionHouseModule] create a new listing using external seller on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // When we list that NFT for 1 SOL.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        seller,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then listing has correct seller.
    t.same(listing.sellerAddress.toBase58(), seller.publicKey.toBase58());
}));
(0, tape_1.default)('[auctionHouseModule] create receipt-less listings but can fetch them afterwards by default', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // When we list that NFT without printing a receipt.
    const { listing, sellerTradeState } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
        printReceipt: false,
    })
        .run();
    // Then we still get a listing model.
    t.equal(listing.tradeStateAddress, sellerTradeState);
    t.same(listing.price, (0, types_1.sol)(1));
    t.same(listing.tokens, (0, types_1.token)(1));
    t.false(listing.receiptAddress);
    // But we cannot retrieve it later with the default operation handler.
    try {
        yield mx
            .auctionHouse()
            .findListingByTradeState({
            tradeStateAddress: sellerTradeState,
            auctionHouse,
        })
            .run();
        t.fail('expected to throw AccountNotFoundError');
    }
    catch (error) {
        const hasNotFoundMessage = /The account of type \[ListingReceipt.*\] was not found/.test(error.message);
        t.ok(error instanceof index_1.AccountNotFoundError, 'throws AccountNotFoundError');
        t.ok(hasNotFoundMessage, 'has ListingReceipt Not Found message');
    }
}));
(0, tape_1.default)('[auctionHouseModule] create a new receipt-less Auctioneer listing on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // Create a simple Auctioneer Auction House.
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // When we list that NFT.
    const { listing, sellerTradeState } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
    })
        .run();
    // Then we still get a listing model.
    t.equal(listing.tradeStateAddress, sellerTradeState);
    t.false(listing.receiptAddress);
}));
(0, tape_1.default)('[auctionHouseModule] create a new receipt-less Auctioneer listing on an Auction House with late Auctioneer delegation', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // Create a simple Auction House.
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // Delegate Auctioneer on update.
    yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: auctioneerAuthority.publicKey,
    })
        .run();
    // Get a client for updated Auction House.
    const client = mx.auctionHouse();
    // When we list that NFT.
    const { listing, sellerTradeState } = yield client
        .list({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
    })
        .run();
    // Then we still get a listing model.
    t.equal(listing.tradeStateAddress, sellerTradeState);
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Sell is not included in Auctioneer scopes', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // Create Auctioneer Auction House to only allow Buy.
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Buy],
    });
    // When we list that NFT.
    const promise = mx
        .auctionHouse()
        .list({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /The Auctioneer does not have the correct scope for this action/);
}));
(0, tape_1.default)('[auctionHouseModule] it allows to List after Auctioneer scope update', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // Create Auctioneer Auction House to only allow Buy.
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Buy],
    });
    // When we update scope to allow Listing.
    yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: auctioneerAuthority.publicKey,
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell, mpl_auction_house_1.AuthorityScope.Buy],
    })
        .run();
    // When we list that NFT.
    const { listing, sellerTradeState } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
    })
        .run();
    // Then we still get a listing model.
    t.equal(listing.tradeStateAddress, sellerTradeState);
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Auctioneer Authority is not provided in Auctioneer Listing', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // Create Auctioneer Auction House.
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // When we list that NFT without providing auctioneer authority.
    const promise = mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /you have not provided the required "auctioneerAuthority" parameter/);
}));
//# sourceMappingURL=createListing.test.js.map
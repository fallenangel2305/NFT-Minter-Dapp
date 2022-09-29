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
const spok_1 = __importDefault(require("spok"));
const types_1 = require("../../../src/types");
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
const index_1 = require("../../../src/index");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] create a new public bid on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // When we create a public bid on that NFT for 6.5 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(6.5),
    })
        .run();
    // Then we created and returned the new Bid with appropriate defaults.
    const expectedBid = {
        tradeStateAddress: (0, helpers_1.spokSamePubkey)(buyerTradeState),
        price: (0, helpers_1.spokSameAmount)((0, types_1.sol)(6.5)),
        tokens: (0, helpers_1.spokSameAmount)((0, types_1.token)(1)),
        auctionHouse: {
            address: (0, helpers_1.spokSamePubkey)(auctionHouse.address),
        },
        asset: {
            model: 'nft',
            address: (0, helpers_1.spokSamePubkey)(nft.address),
            token: spok_1.default.notDefined,
        },
        receiptAddress: spok_1.default.defined,
        isPublic: true,
    };
    (0, spok_1.default)(t, bid, Object.assign({ $topic: 'Bid' }, expectedBid));
    // And we get the same result when we fetch the Bid by address.
    const retrieveBid = yield mx
        .auctionHouse()
        .findBidByReceipt({
        auctionHouse,
        receiptAddress: bid.receiptAddress,
    })
        .run();
    (0, spok_1.default)(t, retrieveBid, Object.assign({ $topic: 'Retrieved Bid' }, expectedBid));
}));
(0, tape_1.default)('[auctionHouseModule] create a new private bid by token account on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    const tokenAddress = (0, index_1.findAssociatedTokenAccountPda)(nft.address, seller.publicKey);
    // When we create a private bid on that NFT for 1 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        tokenAccount: tokenAddress,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then we created and returned the new Bid with appropriate defaults.
    const expectedBid = {
        tradeStateAddress: (0, helpers_1.spokSamePubkey)(buyerTradeState),
        price: (0, helpers_1.spokSameAmount)((0, types_1.sol)(1)),
        tokens: (0, helpers_1.spokSameAmount)((0, types_1.token)(1)),
        auctionHouse: {
            address: (0, helpers_1.spokSamePubkey)(auctionHouse.address),
        },
        asset: {
            model: 'nft',
            address: (0, helpers_1.spokSamePubkey)(nft.address),
            token: {
                address: (0, index_1.findAssociatedTokenAccountPda)(nft.address, seller.publicKey),
            },
        },
        isPublic: false,
    };
    (0, spok_1.default)(t, bid, Object.assign({ $topic: 'Bid' }, expectedBid));
}));
(0, tape_1.default)('[auctionHouseModule] create a new private bid by seller account on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // When we create a private bid on that NFT for 1 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        seller: seller.publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then we created and returned the new Bid with appropriate defaults.
    const expectedBid = {
        tradeStateAddress: (0, helpers_1.spokSamePubkey)(buyerTradeState),
        price: (0, helpers_1.spokSameAmount)((0, types_1.sol)(1)),
        tokens: (0, helpers_1.spokSameAmount)((0, types_1.token)(1)),
        auctionHouse: {
            address: (0, helpers_1.spokSamePubkey)(auctionHouse.address),
        },
        asset: {
            model: 'nft',
            address: (0, helpers_1.spokSamePubkey)(nft.address),
            token: {
                address: (0, index_1.findAssociatedTokenAccountPda)(nft.address, seller.publicKey),
            },
        },
        isPublic: false,
    };
    (0, spok_1.default)(t, bid, Object.assign({ $topic: 'Bid' }, expectedBid));
}));
(0, tape_1.default)('[auctionHouseModule] create private receipt-less bid but cannot fetch it afterwards by default', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // When we create a private bid on that NFT for 1 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        seller: seller.publicKey,
        price: (0, types_1.sol)(1),
        printReceipt: false,
    })
        .run();
    // Then we still get a bid model.
    t.equal(bid.tradeStateAddress, buyerTradeState);
    t.same(bid.price, (0, types_1.sol)(1));
    t.same(bid.tokens, (0, types_1.token)(1));
    t.false(bid.isPublic);
    t.false(bid.receiptAddress);
    // But we cannot retrieve it later with the default operation handler.
    const promise = mx
        .auctionHouse()
        .findBidByTradeState({
        tradeStateAddress: bid.tradeStateAddress,
        auctionHouse,
    })
        .run();
    yield (0, helpers_1.assertThrows)(t, promise, /The account of type \[BidReceipt\] was not found/);
}));
(0, tape_1.default)('[auctionHouseModule] create public receipt-less bid but cannot fetch it afterwards by default', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // When we create a public bid on that NFT for 1 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
        printReceipt: false,
    })
        .run();
    // Then we still get a bid model.
    t.equal(bid.tradeStateAddress, buyerTradeState);
    t.same(bid.price, (0, types_1.sol)(1));
    t.same(bid.tokens, (0, types_1.token)(1));
    t.ok(bid.isPublic);
    // But we cannot retrieve it later with the default operation handler.
    const promise = mx
        .auctionHouse()
        .findBidByTradeState({
        tradeStateAddress: bid.tradeStateAddress,
        auctionHouse,
    })
        .run();
    yield (0, helpers_1.assertThrows)(t, promise, /The account of type \[BidReceipt\] was not found/);
}));
(0, tape_1.default)('[auctionHouseModule] create private receipt-less Auctioneer bid', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auctioneer Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // When we create a private bid on that NFT for 1 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
        seller: seller.publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then we created and returned the new Bid with appropriate defaults.
    t.equal(bid.tradeStateAddress, buyerTradeState);
    t.same(bid.price, (0, types_1.sol)(1));
    t.same(bid.tokens, (0, types_1.token)(1));
    t.false(bid.isPublic);
    t.false(bid.receiptAddress);
}));
(0, tape_1.default)('[auctionHouseModule] create public receipt-less Auctioneer bid', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auctioneer Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // When we create a public bid on that NFT for 1 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then we created and returned the new Bid with appropriate defaults.
    t.equal(bid.tradeStateAddress, buyerTradeState);
    t.same(bid.price, (0, types_1.sol)(1));
    t.same(bid.tokens, (0, types_1.token)(1));
    t.ok(bid.isPublic);
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Buy is not included in Auctioneer scopes', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // Create Auctioneer Auction House to only allow Sell.
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell],
    });
    // When we create a private bid on that NFT for 1 SOL.
    const promise = mx
        .auctionHouse()
        .bid({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
        seller: seller.publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /The Auctioneer does not have the correct scope for this action/);
}));
(0, tape_1.default)('[auctionHouseModule] it allows to Buy after Auctioneer scope update', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // And an Auctioneer Auction House that, at first, could only Sell.
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell],
    });
    // But was later on updated to also allow the Buy scope.
    yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: auctioneerAuthority.publicKey,
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell, mpl_auction_house_1.AuthorityScope.Buy],
    })
        .run();
    // When we create a private bid on that NFT for 1 SOL.
    const { bid, buyerTradeState } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: nft.address,
        seller: seller.publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then we still get a listing model.
    t.equal(bid.tradeStateAddress, buyerTradeState);
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Auctioneer Authority is not provided in Auctioneer Bid', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    // And an Auctioneer Auction House.
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    // And we create a private bid on that NFT for 1 SOL without providing auctioneerAuthority.
    const promise = mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        seller: seller.publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /you have not provided the required "auctioneerAuthority" parameter/);
}));
//# sourceMappingURL=createBid.test.js.map
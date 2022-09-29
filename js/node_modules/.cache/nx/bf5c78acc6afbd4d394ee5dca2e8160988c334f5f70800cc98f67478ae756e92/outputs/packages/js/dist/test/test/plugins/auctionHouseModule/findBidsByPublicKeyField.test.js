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
const tape_1 = __importDefault(require("tape"));
const types_1 = require("../../../src/types");
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] find all lazy bids by buyer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we create a public bid on that NFT for 6.5 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(6.5),
    })
        .run();
    // And given we create another public bid on that NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And given we create public bid on that NFT for 1 SOL from different wallet.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
        buyer: seller,
    })
        .run();
    // When I find all lazy bids by buyer.
    const bids = yield mx
        .auctionHouse()
        .findBidsBy({
        type: 'buyer',
        auctionHouse,
        publicKey: mx.identity().publicKey,
    })
        .run();
    // Then we got two lazy bids for given buyer.
    t.equal(bids.length, 2, 'returns two accounts');
    // And they both are from buyer.
    bids.forEach((bid) => {
        t.ok(bid.buyerAddress.equals(mx.identity().publicKey), 'wallet matches');
    });
}));
(0, tape_1.default)('[auctionHouseModule] find all lazy bids by metadata', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const firstNft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const secondNft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we create a public bid on first NFT for 6.5 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(6.5),
    })
        .run();
    // And given we create another public bid on first NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And given we create public bid on second NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When I find all lazy bids by first NFT metadata.
    const bids = yield mx
        .auctionHouse()
        .findBidsBy({
        type: 'metadata',
        auctionHouse,
        publicKey: firstNft.metadataAddress,
    })
        .run();
    // Then we got two lazy bids.
    t.equal(bids.length, 2, 'returns two accounts');
    // And they both are for first NFT.
    bids.forEach((bid) => {
        t.ok(bid.metadataAddress.equals(firstNft.metadataAddress), 'metadata matches');
    });
}));
(0, tape_1.default)('[auctionHouseModule] find all bids by mint', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const seller = yield (0, helpers_1.createWallet)(mx);
    const firstNft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const secondNft = yield (0, helpers_1.createNft)(mx, { tokenOwner: seller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we create a public bid on first NFT for 6.5 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(6.5),
    })
        .run();
    // And given we create another public bid on first NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And given we create public bid on second NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When I find all bids by mint.
    const bids = yield mx
        .auctionHouse()
        .findBidsBy({
        type: 'mint',
        auctionHouse,
        publicKey: firstNft.address,
    })
        .run();
    // Then we got two bids.
    t.equal(bids.length, 2, 'returns two accounts');
    // And they both are for first NFT.
    bids.forEach((bid) => {
        t.ok(bid.metadataAddress.equals(firstNft.metadataAddress), 'metadata matches');
    });
}));
//# sourceMappingURL=findBidsByPublicKeyField.test.js.map
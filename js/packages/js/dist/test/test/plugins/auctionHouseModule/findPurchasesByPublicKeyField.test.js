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
(0, tape_1.default)('[auctionHouseModule] find all lazy purchases by buyer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and 2 NFTs.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const secondBuyer = yield (0, helpers_1.createWallet)(mx);
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const thirdNft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we execute sale on first NFT for 1 SOL.
    const { listing: firstListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: firstBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: firstNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: firstListing, bid: firstBid })
        .run();
    // And given we execute sale on second NFT for 1 SOL.
    const { listing: secondListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: secondBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: secondNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: secondListing, bid: secondBid })
        .run();
    // And given we execute sale on third NFT from second buyer for 1 SOL.
    const { listing: thirdListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: thirdNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: thirdBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer: secondBuyer,
        mintAccount: thirdNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: thirdListing, bid: thirdBid })
        .run();
    // When I find all lazy purchases by first buyer.
    const purchases = yield mx
        .auctionHouse()
        .findPurchasesBy({
        type: 'buyer',
        auctionHouse,
        publicKey: buyer.publicKey,
    })
        .run();
    // Then we got two lazy purchases for given buyer.
    t.equal(purchases.length, 2, 'returns two accounts');
    // And they both are from buyer.
    purchases.forEach((purchase) => {
        t.ok(purchase.buyerAddress.equals(buyer.publicKey), 'buyer matches');
    });
}));
(0, tape_1.default)('[auctionHouseModule] find all lazy purchases by seller', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and 2 NFTs.
    const mx = yield (0, helpers_1.metaplex)();
    const secondSeller = yield (0, helpers_1.createWallet)(mx);
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const thirdNft = yield (0, helpers_1.createNft)(mx, { tokenOwner: secondSeller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we execute sale on first NFT for 1 SOL.
    const { listing: firstListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: firstBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: firstNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: firstListing, bid: firstBid })
        .run();
    // And given we execute sale on second NFT for 1 SOL.
    const { listing: secondListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: secondBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: secondNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: secondListing, bid: secondBid })
        .run();
    // And given we execute sale on third NFT from different seller for 1 SOL.
    const { listing: thirdListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: thirdNft.address,
        seller: secondSeller,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: thirdBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: thirdNft.address,
        seller: secondSeller.publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: thirdListing, bid: thirdBid })
        .run();
    // When I find all lazy purchases by seller.
    const purchases = yield mx
        .auctionHouse()
        .findPurchasesBy({
        type: 'seller',
        auctionHouse,
        publicKey: mx.identity().publicKey,
    })
        .run();
    // Then we got two lazy purchases for given seller.
    t.equal(purchases.length, 2, 'returns two accounts');
    // And they both are from seller.
    purchases.forEach((purchase) => {
        t.ok(purchase.sellerAddress.equals(mx.identity().publicKey), 'seller matches');
    });
}));
(0, tape_1.default)('[auctionHouseModule] find all lazy purchases by metadata', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and 2 NFTs.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we execute sale on first NFT for 1 SOL.
    const { listing: firstListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: firstBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: firstNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: firstListing, bid: firstBid })
        .run();
    // And given we execute sale on second NFT for 1 SOL.
    const { listing: secondListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: secondBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: secondNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: secondListing, bid: secondBid })
        .run();
    // When I find all lazy purchases by metadata.
    const purchases = yield mx
        .auctionHouse()
        .findPurchasesBy({
        type: 'metadata',
        auctionHouse,
        publicKey: firstNft.metadataAddress,
    })
        .run();
    // Then we got one lazy purchase for given nft.
    t.equal(purchases.length, 1, 'returns one account');
    // And it is from given metadata.
    purchases.forEach((purchase) => {
        t.ok(purchase.metadataAddress.equals(firstNft.metadataAddress), 'metadata matches');
    });
}));
(0, tape_1.default)('[auctionHouseModule] find all purchases by mint', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and 2 NFTs.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we execute sale on first NFT for 1 SOL.
    const { listing: firstListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: firstBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: firstNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: firstListing, bid: firstBid })
        .run();
    // And given we execute sale on second NFT for 1 SOL.
    const { listing: secondListing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    const { bid: secondBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: secondNft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing: secondListing, bid: secondBid })
        .run();
    // When I find all purchases by mint.
    const purchases = yield mx
        .auctionHouse()
        .findPurchasesBy({
        type: 'mint',
        auctionHouse,
        publicKey: firstNft.address,
    })
        .run();
    // Then we got one purchase for given nft.
    t.equal(purchases.length, 1, 'returns one account');
    // And it is from given metadata.
    purchases.forEach((purchase) => {
        t.ok(purchase.metadataAddress.equals(firstNft.metadataAddress), 'metadata matches');
    });
}));
//# sourceMappingURL=findPurchasesByPublicKeyField.test.js.map
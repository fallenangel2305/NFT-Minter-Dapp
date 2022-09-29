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
(0, tape_1.default)('[auctionHouseModule] find all lazy listings by seller', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and 2 NFTs.
    const mx = yield (0, helpers_1.metaplex)();
    const secondSeller = yield (0, helpers_1.createWallet)(mx);
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const thirdNft = yield (0, helpers_1.createNft)(mx, { tokenOwner: secondSeller.publicKey });
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we create a listing on first NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And given we create a listing on second NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And given we create a listing on third NFT for 1 SOL from different wallet.
    yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: thirdNft.address,
        seller: secondSeller,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When I find all listings by seller.
    const listings = yield mx
        .auctionHouse()
        .findListingsBy({
        type: 'seller',
        auctionHouse,
        publicKey: mx.identity().publicKey,
    })
        .run();
    // Then we got two lazy listings for given seller.
    t.equal(listings.length, 2, 'returns two accounts');
    // And they both are from seller.
    listings.forEach((listing) => {
        t.ok(listing.sellerAddress.equals(mx.identity().publicKey), 'wallet matches');
    });
}));
(0, tape_1.default)('[auctionHouseModule] find all lazy listings by metadata', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we create a listing on first NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And given we create a listing on second NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When I find all listings by metadata.
    const listings = yield mx
        .auctionHouse()
        .findListingsBy({
        type: 'metadata',
        auctionHouse,
        publicKey: firstNft.metadataAddress,
    })
        .run();
    // Then we got one lazy listing.
    t.equal(listings.length, 1, 'returns one account');
    // And it is for given metadata.
    listings.forEach((listing) => {
        t.ok(listing.metadataAddress.equals(firstNft.metadataAddress), 'metadata matches');
    });
}));
(0, tape_1.default)('[auctionHouseModule] find all listings by mint', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And given we create a listing on first NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And given we create a listing on second NFT for 1 SOL.
    yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When I find all listings by mint.
    const listings = yield mx
        .auctionHouse()
        .findListingsBy({
        type: 'mint',
        auctionHouse,
        publicKey: firstNft.address,
    })
        .run();
    // Then we got one listing.
    t.equal(listings.length, 1, 'returns one account');
    // And it is for given metadata.
    listings.forEach((listing) => {
        t.ok(listing.metadataAddress.equals(firstNft.metadataAddress), 'metadata matches');
    });
}));
//# sourceMappingURL=findListingsByPublicKeyField.test.js.map
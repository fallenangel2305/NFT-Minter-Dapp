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
const spok_1 = __importDefault(require("spok"));
const types_1 = require("../../../src/types");
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
const index_1 = require("../../../src/index");
const web3_js_1 = require("@solana/web3.js");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] execute sale on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
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
    // And we created a private bid on that NFT for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: nft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we execute a sale with given listing and bid.
    const { purchase } = yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing, bid })
        .run();
    // Then we created and returned the new Purchase with appropriate values.
    const expectedPurchase = {
        price: (0, helpers_1.spokSameAmount)((0, types_1.sol)(1)),
        tokens: (0, helpers_1.spokSameAmount)((0, types_1.token)(1)),
        buyerAddress: (0, helpers_1.spokSamePubkey)(buyer.publicKey),
        sellerAddress: (0, helpers_1.spokSamePubkey)(mx.identity().publicKey),
        auctionHouse: {
            address: (0, helpers_1.spokSamePubkey)(auctionHouse.address),
        },
        asset: {
            address: (0, helpers_1.spokSamePubkey)(nft.address),
            token: {
                address: (0, index_1.findAssociatedTokenAccountPda)(nft.address, buyer.publicKey),
                ownerAddress: (0, helpers_1.spokSamePubkey)(buyer.publicKey),
            },
        },
        receiptAddress: spok_1.default.defined,
    };
    (0, spok_1.default)(t, purchase, Object.assign({ $topic: 'Purchase' }, expectedPurchase));
    // And we get the same result when we fetch the Purchase by address.
    const retrievePurchase = yield mx
        .auctionHouse()
        .findPurchaseByReceipt({
        receiptAddress: purchase.receiptAddress,
        auctionHouse,
    })
        .run();
    (0, spok_1.default)(t, retrievePurchase, Object.assign({ $topic: 'Retrieved Purchase' }, expectedPurchase));
}));
(0, tape_1.default)('[auctionHouseModule] it executes sale on an Auction House with separate authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House with separate authority and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const authority = yield (0, helpers_1.createWallet)(mx);
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, {
        authority,
    });
    // And we listed that NFT for 1 SOL.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And we created a private bid on that NFT for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: nft.address,
        seller: mx.identity().publicKey,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we execute a sale with given listing and bid.
    const { purchase } = yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing, bid })
        .run();
    // Then we created and returned the new Purchase
    t.equal(purchase.asset.address.toBase58(), nft.address.toBase58());
}));
(0, tape_1.default)('[auctionHouseModule] it executes receipt-less sale on an Auction House when Bid is receipt-less but cannot fetch it afterwards by default', (t) => __awaiter(void 0, void 0, void 0, function* () {
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
    // And we created a private receipt-less bid on that NFT for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: nft.address,
        tokenAccount: nft.token.address,
        price: (0, types_1.sol)(1),
        printReceipt: false,
    })
        .run();
    // When we execute a sale with given listing and receipt-less bid.
    const { purchase } = yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing, bid })
        .run();
    // Then we still get a purchase model but without a generated receipt.
    t.same(purchase.asset.address, nft.address);
    t.false(purchase.receiptAddress);
    // But we cannot retrieve it later with the default operation handler.
    try {
        yield mx
            .auctionHouse()
            .findPurchaseByTradeState({
            auctionHouse,
            sellerTradeState: listing.tradeStateAddress,
            buyerTradeState: bid.tradeStateAddress,
        })
            .run();
        t.fail('expected to throw AccountNotFoundError');
    }
    catch (error) {
        const hasNotFoundMessage = error.message.includes('The account of type [PurchaseReceipt] was not found');
        t.ok(error instanceof index_1.AccountNotFoundError, 'throws AccountNotFoundError');
        t.ok(hasNotFoundMessage, 'has PurchaseReceipt Not Found message');
    }
}));
(0, tape_1.default)('[auctionHouseModule] it executes receipt-less sale on an Auction House when Listing is receipt-less', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And we listed that NFT for 1 SOL without receipt.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
        printReceipt: false,
    })
        .run();
    // And we created a private bid on that NFT for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: nft.address,
        tokenAccount: nft.token.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we execute a sale with given bid and receipt-less listing.
    const { purchase } = yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing, bid })
        .run();
    // Then we still get a purchase model but without a generated receipt.
    t.same(purchase.asset.address, nft.address);
    t.false(purchase.receiptAddress);
}));
(0, tape_1.default)('[auctionHouseModule] it executes sale on an Auction House when Bid is public', (t) => __awaiter(void 0, void 0, void 0, function* () {
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
    // And we created a public bid on that NFT for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we execute a sale with given listing and bid.
    const { purchase } = yield mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing, bid })
        .run();
    // Then we created and returned the new Purchase
    t.equal(purchase.asset.address.toBase58(), nft.address.toBase58());
}));
(0, tape_1.default)('[auctionHouseModule] it executes sale on an Auction House with Auctioneer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auctioneer Auction House and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
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
    // And we created a public bid on that NFT for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        auctioneerAuthority,
        buyer,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we execute an auctioneer sale with given listing and bid.
    const { purchase } = yield mx
        .auctionHouse()
        .executeSale({
        auctionHouse,
        auctioneerAuthority,
        listing,
        bid,
    })
        .run();
    // Then we created and returned the new Purchase
    t.equal(purchase.asset.address.toBase58(), nft.address.toBase58());
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Bid and Listing have different Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have two Auction Houses and an NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const nft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    const buyerAuctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, {
        authority: buyer,
    });
    // And we listed that NFT for 1 SOL.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And we created a public bid on that NFT for 1 SOL but with different AH.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse: buyerAuctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we execute a sale with given listing and bid.
    const promise = mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing, bid })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /You are trying to use a Bid and a Listing from different Auction Houses./);
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if Bid and Listing have different Token', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and two NFTs.
    const mx = yield (0, helpers_1.metaplex)();
    const firstNft = yield (0, helpers_1.createNft)(mx);
    const secondNft = yield (0, helpers_1.createNft)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    // And we listed that First NFT for 1 SOL.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: firstNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // And we created a public bid on that Second NFT.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        mintAccount: secondNft.address,
        price: (0, types_1.sol)(1),
    })
        .run();
    // When we execute a sale with given listing and bid.
    const promise = mx
        .auctionHouse()
        .executeSale({ auctionHouse, listing, bid })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /You are trying to execute a sale using a Bid and a Listing that have different mint addresses./);
}));
(0, tape_1.default)('[auctionHouseModule] it executes sale on an Auction House with SPL treasury', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    // And an existing SPL treasury.
    const { token: treasuryToken } = yield mx
        .tokens()
        .createTokenWithMint()
        .run();
    // And airdrop 2 Tokens to buyer.
    yield mx
        .tokens()
        .mint({
        mintAddress: treasuryToken.mint.address,
        amount: (0, types_1.token)(2),
        toOwner: buyer.publicKey,
    })
        .run();
    // And we created a new Auction House using that treasury with NFT to sell.
    const treasuryMint = treasuryToken.mint.address;
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, {
        treasuryMint,
    });
    const nft = yield (0, helpers_1.createNft)(mx);
    // And we listed that NFT for 2 Tokens.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: nft.address,
        price: (0, types_1.token)(2),
    })
        .run();
    // And we created a private bid on that NFT for 2 Tokens.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: nft.address,
        tokenAccount: nft.token.address,
        price: (0, types_1.token)(2),
    })
        .run();
    // When we execute a sale with given listing and bid.
    const { purchase } = yield mx
        .auctionHouse()
        .executeSale({
        auctionHouse,
        listing,
        bid,
    })
        .run();
    // Then we created and returned the new Purchase
    t.equal(purchase.asset.address.toBase58(), nft.address.toBase58());
    // And treasury tokens left buyer's account.
    const paymentAccount = (0, index_1.findAssociatedTokenAccountPda)(auctionHouse.treasuryMint.address, buyer.publicKey);
    const buyerToken = yield mx
        .tokens()
        .findTokenByAddress({ address: paymentAccount })
        .run();
    t.equal(buyerToken.amount.basisPoints.toNumber(), 0);
}));
//# sourceMappingURL=executeSale.test.js.map
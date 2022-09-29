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
const web3_js_1 = require("@solana/web3.js");
const plugins_1 = require("../../../src/plugins");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] execute partial sale on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and a SFT with 5 supply.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    const sft = yield (0, helpers_1.createSft)(mx);
    yield mx
        .tokens()
        .mint({
        mintAddress: sft.address,
        amount: (0, types_1.token)(10),
    })
        .run();
    // And we listed that 5 SFTs for 1 SOL each.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: sft.address,
        price: (0, types_1.sol)(5),
        tokens: (0, types_1.token)(5),
    })
        .run();
    // And we created a public bid on that SFT to buy only 3 Tokens.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: sft.address,
        price: (0, types_1.sol)(3),
        tokens: (0, types_1.token)(3),
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
    // Then the user must receive 3 Tokens.
    const buyerTokens = yield mx
        .nfts()
        .findByToken({ token: purchase.asset.token.address })
        .run();
    t.equal(buyerTokens.token.amount.basisPoints.toNumber(), 3);
    // And then the seller must have 2 Tokens on sale left.
    const sellerTokens = yield mx
        .nfts()
        .findByToken({ token: listing.asset.token.address })
        .run();
    t.equal(sellerTokens.token.delegateAmount.basisPoints.toNumber(), 2);
}));
(0, tape_1.default)('[auctionHouseModule] execute partial sale on an Auction House with SPL treasury', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance and SFT.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const sft = yield (0, helpers_1.createSft)(mx);
    yield mx
        .tokens()
        .mint({
        mintAddress: sft.address,
        amount: (0, types_1.token)(10),
    })
        .run();
    // And an existing SPL treasury.
    const { token: treasuryToken } = yield mx
        .tokens()
        .createTokenWithMint()
        .run();
    // And airdrop 4 Payment SPL Tokens to buyer.
    yield mx
        .tokens()
        .mint({
        mintAddress: treasuryToken.mint.address,
        amount: (0, types_1.token)(4),
        toOwner: buyer.publicKey,
    })
        .run();
    // And we created a new Auction House using that treasury.
    const treasuryMint = treasuryToken.mint.address;
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, {
        treasuryMint,
    });
    // And we listed that 5 SFTs for 2 Payment Tokens each.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: sft.address,
        price: (0, types_1.token)(10),
        tokens: (0, types_1.token)(5),
    })
        .run();
    // And we created a private bid on 2 SFTs for 4 Payment Tokens.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: sft.address,
        price: (0, types_1.token)(4),
        tokens: (0, types_1.token)(2),
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
    // Then the user must receive 2 SFTs.
    const buyerTokens = yield mx
        .nfts()
        .findByToken({ token: purchase.asset.token.address })
        .run();
    t.equal(buyerTokens.token.amount.basisPoints.toNumber(), 2);
    // And then the seller must have 3 SFTs on sale left.
    const sellerTokens = yield mx
        .nfts()
        .findByToken({ token: listing.asset.token.address })
        .run();
    t.equal(sellerTokens.token.delegateAmount.basisPoints.toNumber(), 3);
    // And payment tokens left buyer's account.
    const paymentAccount = (0, plugins_1.findAssociatedTokenAccountPda)(auctionHouse.treasuryMint.address, buyer.publicKey);
    const buyerToken = yield mx
        .tokens()
        .findTokenByAddress({ address: paymentAccount })
        .run();
    t.equal(buyerToken.amount.basisPoints.toNumber(), 0);
}));
(0, tape_1.default)('[auctionHouseModule] it throws when executing partial sale with wrong price on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance and SFT with 10 Supply.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const sft = yield (0, helpers_1.createSft)(mx);
    yield mx
        .tokens()
        .mint({
        mintAddress: sft.address,
        amount: (0, types_1.token)(10),
    })
        .run();
    // And existing SPL treasury SFT.
    const paymentSft = yield (0, helpers_1.createSft)(mx);
    // And airdrop 4 Payment SPL Tokens to buyer.
    yield mx
        .tokens()
        .mint({
        mintAddress: paymentSft.mint.address,
        amount: (0, types_1.token)(4),
        toOwner: buyer.publicKey,
    })
        .run();
    // And we created a new Auction House using that treasury.
    const treasuryMint = paymentSft.mint.address;
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, {
        treasuryMint,
    });
    // And we listed that 5 SFTs for 2 Payment Tokens each.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: sft.address,
        price: (0, types_1.token)(10),
        tokens: (0, types_1.token)(5),
    })
        .run();
    // And we created a private bid on 2 SFTs for 2 Payment Tokens only.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: sft.address,
        price: (0, types_1.token)(2),
        tokens: (0, types_1.token)(2),
    })
        .run();
    // When we execute a sale with the price that is lower than required.
    const promise = mx
        .auctionHouse()
        .executeSale({
        auctionHouse,
        listing,
        bid,
    })
        .run();
    // Then we expect an error with expected and provided amounts.
    yield (0, helpers_1.assertThrows)(t, promise, /Expected to receive Token 2 per SFT but provided Token 1 per SFT/);
}));
(0, tape_1.default)('[auctionHouseModule] it throws when executing partial sale with wrong price on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and a SFT with 5 supply.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    const sft = yield (0, helpers_1.createSft)(mx);
    yield mx
        .tokens()
        .mint({
        mintAddress: sft.address,
        amount: (0, types_1.token)(5),
    })
        .run();
    // And we listed that 5 SFTs for 1 SOL each.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: sft.address,
        price: (0, types_1.sol)(5),
        tokens: (0, types_1.token)(5),
    })
        .run();
    // And we created a public bid on that SFT to buy only 3 Tokens but for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: sft.address,
        price: (0, types_1.sol)(1),
        tokens: (0, types_1.token)(3),
    })
        .run();
    // When we execute a sale with the price that is lower than required.
    const promise = mx
        .auctionHouse()
        .executeSale({
        auctionHouse,
        listing,
        bid,
    })
        .run();
    // Then we expect an error with expected and provided amounts.
    yield (0, helpers_1.assertThrows)(t, promise, /Expected to receive SOL 1.000000000 per SFT but provided SOL 0.333333333 per SFT/);
}));
(0, tape_1.default)('[auctionHouseModule] it throws when executing partial sale when no supply left on an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and a SFT with 5 supply.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    const sft = yield (0, helpers_1.createSft)(mx);
    yield mx
        .tokens()
        .mint({
        mintAddress: sft.address,
        amount: (0, types_1.token)(5),
    })
        .run();
    // And we listed that 5 SFTs for 1 SOL each.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        mintAccount: sft.address,
        price: (0, types_1.sol)(5),
        tokens: (0, types_1.token)(5),
    })
        .run();
    // And we bought only 3 Tokens but for 1 SOL.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: sft.address,
        price: (0, types_1.sol)(3),
        tokens: (0, types_1.token)(3),
    })
        .run();
    yield mx
        .auctionHouse()
        .executeSale({
        auctionHouse,
        listing,
        bid,
    })
        .run();
    // When we execute a sale to buy more tokens than left.
    const { bid: exceedBid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        buyer,
        mintAccount: sft.address,
        price: (0, types_1.sol)(3),
        tokens: (0, types_1.token)(3),
    })
        .run();
    const promise = mx
        .auctionHouse()
        .executeSale({
        auctionHouse,
        listing,
        bid: exceedBid,
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /Amount of tokens available for purchase is less than the partial order amount/);
}));
(0, tape_1.default)('[auctionHouseModule] it throws when executing partial sale in Auctioneer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have an Auction House and a SFT with 5 supply.
    const mx = yield (0, helpers_1.metaplex)();
    const buyer = yield (0, helpers_1.createWallet)(mx);
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority);
    const sft = yield (0, helpers_1.createSft)(mx);
    yield mx
        .tokens()
        .mint({
        mintAddress: sft.address,
        amount: (0, types_1.token)(5),
    })
        .run();
    // And we listed that 5 SFTs for 1 SOL each.
    const { listing } = yield mx
        .auctionHouse()
        .list({
        auctionHouse,
        auctioneerAuthority,
        mintAccount: sft.address,
        price: (0, types_1.sol)(5),
        tokens: (0, types_1.token)(5),
    })
        .run();
    // When we execute a sale to buy more tokens than left.
    const { bid } = yield mx
        .auctionHouse()
        .bid({
        auctionHouse,
        auctioneerAuthority,
        buyer,
        mintAccount: sft.address,
        price: (0, types_1.sol)(3),
        tokens: (0, types_1.token)(3),
    })
        .run();
    const promise = mx
        .auctionHouse()
        .executeSale({
        auctionHouse,
        auctioneerAuthority,
        listing,
        bid,
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /You are trying to execute a partial sale, but partial orders are not supported in Auctioneer/);
}));
//# sourceMappingURL=executePartialSale.test.js.map
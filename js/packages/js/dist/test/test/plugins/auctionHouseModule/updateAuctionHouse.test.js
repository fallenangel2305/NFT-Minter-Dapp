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
const web3_js_1 = require("@solana/web3.js");
const helpers_1 = require("../../helpers");
const index_1 = require("../../../src/index");
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const helpers_2 = require("./helpers");
const constants_1 = require("../../../src/plugins/auctionHouseModule/constants");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] it updates all fields of an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing SPL treasury.
    const treasuryOwner = web3_js_1.Keypair.generate().publicKey;
    const { token: treasuryToken } = yield mx
        .tokens()
        .createTokenWithMint({ owner: treasuryOwner })
        .run();
    const treasuryMint = treasuryToken.mint.address;
    // And an existing Auction House using that SPL treasury.
    const { auctionHouse: originalAuctionHouse } = yield mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        treasuryMint: treasuryMint,
        treasuryWithdrawalDestinationOwner: treasuryOwner,
    })
        .run();
    const originalCreator = mx.identity().publicKey;
    const originalAddress = (0, index_1.findAuctionHousePda)(originalCreator, treasuryMint);
    (0, spok_1.default)(t, originalAuctionHouse, {
        $topic: 'Original AuctionHouse',
        address: (0, helpers_1.spokSamePubkey)(originalAddress),
        creatorAddress: (0, helpers_1.spokSamePubkey)(originalCreator),
        authorityAddress: (0, helpers_1.spokSamePubkey)(originalCreator),
        treasuryMint: {
            address: (0, helpers_1.spokSamePubkey)(treasuryMint),
        },
        feeAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseFeePda)(originalAddress)),
        treasuryAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseTreasuryPda)(originalAddress)),
        feeWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(originalCreator),
        treasuryWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(treasuryToken.address),
        sellerFeeBasisPoints: 200,
        requiresSignOff: false,
        canChangeSalePrice: false,
        isNative: false,
    });
    // When we update as much as we can from that Auction House.
    const newAuthority = web3_js_1.Keypair.generate().publicKey;
    const newFeeWithdrawalDestination = web3_js_1.Keypair.generate().publicKey;
    const newTreasuryOwner = web3_js_1.Keypair.generate().publicKey;
    const { auctionHouse: updatedAuctionHouse } = yield mx
        .auctionHouse()
        .update({
        auctionHouse: originalAuctionHouse,
        sellerFeeBasisPoints: 300,
        requiresSignOff: true,
        canChangeSalePrice: true,
        newAuthority,
        feeWithdrawalDestination: newFeeWithdrawalDestination,
        treasuryWithdrawalDestinationOwner: newTreasuryOwner,
    })
        .run();
    // Then all changes have been correctly applied.
    (0, spok_1.default)(t, updatedAuctionHouse, {
        $topic: 'Updated AuctionHouse',
        address: (0, helpers_1.spokSamePubkey)(originalAddress),
        creatorAddress: (0, helpers_1.spokSamePubkey)(originalCreator),
        authorityAddress: (0, helpers_1.spokSamePubkey)(newAuthority),
        treasuryMint: {
            address: (0, helpers_1.spokSamePubkey)(treasuryMint),
        },
        feeAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseFeePda)(originalAddress)),
        treasuryAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseTreasuryPda)(originalAddress)),
        feeWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(newFeeWithdrawalDestination),
        treasuryWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAssociatedTokenAccountPda)(treasuryMint, newTreasuryOwner)),
        sellerFeeBasisPoints: 300,
        requiresSignOff: true,
        canChangeSalePrice: true,
        isNative: false,
    });
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if nothing has changed when updating an Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({ sellerFeeBasisPoints: 200 })
        .run();
    // When we send an update without providing any changes.
    const promise = mx.auctionHouse().update({ auctionHouse }).run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /No Instructions To Send/);
}));
(0, tape_1.default)('[auctionHouseModule] it can assign an Auctioneer authority on an Auction House update', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an Auction House without Auctioneer.
    const mx = yield (0, helpers_1.metaplex)();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx);
    t.false(auctionHouse.hasAuctioneer);
    // When we update it with an Auctioneer authority.
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const { auctionHouse: updatedAuctionHouse } = yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: auctioneerAuthority.publicKey,
    })
        .run();
    // Then the Auctioneer authority has been correctly set.
    const ahAuctioneerPda = (0, index_1.findAuctioneerPda)(updatedAuctionHouse.address, auctioneerAuthority.publicKey);
    (0, spok_1.default)(t, updatedAuctionHouse, {
        hasAuctioneer: true,
        auctioneer: {
            address: (0, helpers_1.spokSamePubkey)(ahAuctioneerPda),
            authority: (0, helpers_1.spokSamePubkey)(auctioneerAuthority.publicKey),
            scopes: constants_1.AUCTIONEER_ALL_SCOPES,
        },
    });
}));
(0, tape_1.default)('[auctionHouseModule] it can assign an Auctioneer authority with an explicit Auction House authority and explicit scopes', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an Auction House without Auctioneer.
    const mx = yield (0, helpers_1.metaplex)();
    const authority = yield (0, helpers_1.createWallet)(mx);
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, null, { authority });
    t.false(auctionHouse.hasAuctioneer);
    // When we send an update with auctioneerAuthority to delegate.
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const { auctionHouse: updatedAuctionHouse } = yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        authority,
        auctioneerAuthority: auctioneerAuthority.publicKey,
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell, mpl_auction_house_1.AuthorityScope.Buy].sort(),
    })
        .run();
    // Then the Auctioneer data has been correctly set.
    const ahAuctioneerPda = (0, index_1.findAuctioneerPda)(updatedAuctionHouse.address, auctioneerAuthority.publicKey);
    (0, spok_1.default)(t, updatedAuctionHouse, {
        hasAuctioneer: true,
        auctioneer: {
            address: (0, helpers_1.spokSamePubkey)(ahAuctioneerPda),
            authority: (0, helpers_1.spokSamePubkey)(auctioneerAuthority.publicKey),
            scopes: [mpl_auction_house_1.AuthorityScope.Sell, mpl_auction_house_1.AuthorityScope.Buy].sort(),
        },
    });
}));
(0, tape_1.default)('[auctionHouseModule] it keeps the original scope when updating the Auctioneer Authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Auctioneer Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Buy],
    });
    // When we send an update with different auctioneerAuthority to delegate.
    const newAuctioneerAuthority = web3_js_1.Keypair.generate();
    const { auctionHouse: updatedAuctionHouse } = yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: newAuctioneerAuthority.publicKey,
    })
        .run();
    // Then the new scopes have been correctly set.
    const ahAuctioneerPda = (0, index_1.findAuctioneerPda)(updatedAuctionHouse.address, newAuctioneerAuthority.publicKey);
    (0, spok_1.default)(t, updatedAuctionHouse, {
        hasAuctioneer: true,
        auctioneer: {
            address: (0, helpers_1.spokSamePubkey)(ahAuctioneerPda),
            authority: (0, helpers_1.spokSamePubkey)(newAuctioneerAuthority.publicKey),
            scopes: [mpl_auction_house_1.AuthorityScope.Buy],
        },
    });
}));
(0, tape_1.default)('[auctionHouseModule] it can update Auctioneer Scope', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Auctioneer Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.PublicBuy],
    });
    // When update its Auctioneer scopes.
    const { auctionHouse: updatedAuctionHouse } = yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: auctioneerAuthority.publicKey,
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Buy],
    })
        .run();
    // Then the new scopes have been correctly set.
    const ahAuctioneerPda = (0, index_1.findAuctioneerPda)(updatedAuctionHouse.address, auctioneerAuthority.publicKey);
    (0, spok_1.default)(t, updatedAuctionHouse, {
        hasAuctioneer: true,
        auctioneer: {
            address: (0, helpers_1.spokSamePubkey)(ahAuctioneerPda),
            authority: (0, helpers_1.spokSamePubkey)(auctioneerAuthority.publicKey),
            scopes: [mpl_auction_house_1.AuthorityScope.Buy],
        },
    });
}));
(0, tape_1.default)('[auctionHouseModule] it can update both the Auctioneer authority and scopes', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing Auctioneer Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell],
    });
    // When we update both the scopes and the authority of the Auctioneer instance.
    const newAuctioneerAuthority = web3_js_1.Keypair.generate();
    const { auctionHouse: updatedAuctionHouse } = yield mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: newAuctioneerAuthority.publicKey,
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Buy],
    })
        .run();
    // Then the new auctioneer data has been correctly set.
    const ahAuctioneerPda = (0, index_1.findAuctioneerPda)(updatedAuctionHouse.address, newAuctioneerAuthority.publicKey);
    (0, spok_1.default)(t, updatedAuctionHouse, {
        hasAuctioneer: true,
        auctioneer: {
            address: (0, helpers_1.spokSamePubkey)(ahAuctioneerPda),
            authority: (0, helpers_1.spokSamePubkey)(newAuctioneerAuthority.publicKey),
            scopes: [mpl_auction_house_1.AuthorityScope.Buy],
        },
    });
}));
(0, tape_1.default)('[auctionHouseModule] it throws an error if nothing has changed when updating an Auctioneer', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an Auctioneer Auction House.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const auctionHouse = yield (0, helpers_2.createAuctionHouse)(mx, auctioneerAuthority, {
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell],
    });
    // When we send an update without providing any changes.
    const promise = mx
        .auctionHouse()
        .update({
        auctionHouse,
        auctioneerAuthority: auctioneerAuthority.publicKey,
        auctioneerScopes: [mpl_auction_house_1.AuthorityScope.Sell],
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /No Instructions To Send/);
}));
//# sourceMappingURL=updateAuctionHouse.test.js.map
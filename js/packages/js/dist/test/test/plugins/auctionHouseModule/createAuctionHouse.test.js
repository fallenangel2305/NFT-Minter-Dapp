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
const constants_1 = require("../../../src/plugins/auctionHouseModule/constants");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[auctionHouseModule] create new Auction House with minimum configuration', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we create a new Auction House with minimum configuration.
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({ sellerFeeBasisPoints: 200 })
        .run();
    // Then we created and returned the new Auction House and it has appropriate defaults.
    const expectedCreator = mx.identity().publicKey;
    const expectedMint = index_1.WRAPPED_SOL_MINT;
    const expectedAddress = (0, index_1.findAuctionHousePda)(expectedCreator, expectedMint);
    const expectedAuctionHouse = {
        address: (0, helpers_1.spokSamePubkey)(expectedAddress),
        creatorAddress: (0, helpers_1.spokSamePubkey)(expectedCreator),
        authorityAddress: (0, helpers_1.spokSamePubkey)(expectedCreator),
        treasuryMint: {
            address: (0, helpers_1.spokSamePubkey)(expectedMint),
        },
        feeAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseFeePda)(expectedAddress)),
        treasuryAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseTreasuryPda)(expectedAddress)),
        feeWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(expectedCreator),
        treasuryWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(expectedCreator),
        sellerFeeBasisPoints: 200,
        requiresSignOff: false,
        canChangeSalePrice: false,
        isNative: true,
    };
    (0, spok_1.default)(t, auctionHouse, Object.assign({ $topic: 'Auction House' }, expectedAuctionHouse));
    // And we get the same result when we fetch the Auction House by address.
    const retrievedAuctionHouse = yield mx
        .auctionHouse()
        .findByAddress({ address: auctionHouse.address })
        .run();
    (0, spok_1.default)(t, retrievedAuctionHouse, Object.assign({ $topic: 'Retrieved Auction House' }, expectedAuctionHouse));
}));
(0, tape_1.default)('[auctionHouseModule] create new Auction House with maximum configuration', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // When we create a new Auction House by providing all inputs.
    const treasuryMint = index_1.WRAPPED_SOL_MINT;
    const authority = mx.identity();
    const feeWithdrawalDestination = web3_js_1.Keypair.generate();
    const treasuryWithdrawalDestinationOwner = web3_js_1.Keypair.generate();
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        requiresSignOff: true,
        canChangeSalePrice: true,
        treasuryMint: treasuryMint,
        payer: authority,
        authority: authority.publicKey,
        feeWithdrawalDestination: feeWithdrawalDestination.publicKey,
        treasuryWithdrawalDestinationOwner: treasuryWithdrawalDestinationOwner.publicKey,
    })
        .run();
    // Then the created Auction House has the expected configuration.
    const expectedAddress = (0, index_1.findAuctionHousePda)(authority.publicKey, treasuryMint);
    const expectedAuctionHouse = {
        address: (0, helpers_1.spokSamePubkey)(expectedAddress),
        creatorAddress: (0, helpers_1.spokSamePubkey)(authority.publicKey),
        authorityAddress: (0, helpers_1.spokSamePubkey)(authority.publicKey),
        treasuryMint: {
            address: (0, helpers_1.spokSamePubkey)(treasuryMint),
        },
        feeAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseFeePda)(expectedAddress)),
        treasuryAccountAddress: (0, helpers_1.spokSamePubkey)((0, index_1.findAuctionHouseTreasuryPda)(expectedAddress)),
        feeWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(feeWithdrawalDestination.publicKey),
        treasuryWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(treasuryWithdrawalDestinationOwner.publicKey),
        sellerFeeBasisPoints: 200,
        requiresSignOff: true,
        canChangeSalePrice: true,
        isNative: true,
    };
    (0, spok_1.default)(t, auctionHouse, Object.assign({ $topic: 'Auction House' }, expectedAuctionHouse));
}));
(0, tape_1.default)('[auctionHouseModule] create new Auction House with SPL treasury', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    // And an existing SPL treasury.
    const treasuryOwner = web3_js_1.Keypair.generate().publicKey;
    const { token } = yield mx
        .tokens()
        .createTokenWithMint({ owner: treasuryOwner })
        .run();
    // When we create a new Auction House using that treasury.
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        treasuryMint: token.mint.address,
        treasuryWithdrawalDestinationOwner: treasuryOwner,
    })
        .run();
    // Then the created Auction House stores the treasury information.
    (0, spok_1.default)(t, auctionHouse, {
        $topic: 'Auction House with Spl Token',
        isNative: false,
        treasuryWithdrawalDestinationAddress: (0, helpers_1.spokSamePubkey)(token.address),
        treasuryMint: {
            address: (0, helpers_1.spokSamePubkey)(token.mint.address),
        },
    });
}));
(0, tape_1.default)('[auctionHouseModule] create new Auctioneer Auction House', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    // When we create a new Auctioneer Auction House.
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        auctioneerAuthority: auctioneerAuthority.publicKey,
    })
        .run();
    // Then the new Auction House has Auctioneer attached.
    const ahAuctioneerPda = (0, index_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority.publicKey);
    (0, spok_1.default)(t, auctionHouse, {
        hasAuctioneer: true,
        auctioneer: {
            address: (0, helpers_1.spokSamePubkey)(ahAuctioneerPda),
            authority: (0, helpers_1.spokSamePubkey)(auctioneerAuthority.publicKey),
            scopes: constants_1.AUCTIONEER_ALL_SCOPES,
        },
    });
    // And the Auctioneer PDA for that Auction House was created.
    const ahAuctioneerAccount = yield mx.rpc().getAccount(ahAuctioneerPda);
    t.ok(ahAuctioneerAccount.exists);
}));
(0, tape_1.default)('[auctionHouseModule] create new Auctioneer Auction House with separate authority', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const authority = yield (0, helpers_1.createWallet)(mx);
    // When we create a new Auctioneer Auction House with a separate authority.
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        auctioneerAuthority: auctioneerAuthority.publicKey,
        authority,
    })
        .run();
    // Then the new Auction House has separate authority.
    t.equal(auctionHouse.authorityAddress.toBase58(), authority.publicKey.toBase58());
    // And Auctioneer was delegated.
    t.ok(auctionHouse.hasAuctioneer);
}));
(0, tape_1.default)('[auctionHouseModule] it throws when creating Auctioneer Auction House with a PublicKey authority provided', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    const auctioneerAuthority = web3_js_1.Keypair.generate();
    const authority = yield (0, helpers_1.createWallet)(mx);
    // When we create a new Auctioneer Auction House with an separate authority provided as PublicKey.
    const promise = mx
        .auctionHouse()
        .create({
        sellerFeeBasisPoints: 200,
        auctioneerAuthority: auctioneerAuthority.publicKey,
        authority: authority.publicKey, // Provide PublicKey instead of Signer to catch an error
    })
        .run();
    // Then we expect an error because Auctioneer delegation requires authority signer.
    yield (0, helpers_1.assertThrows)(t, promise, /Expected variable \[authority\] to be of type \[Signer\]/);
}));
//# sourceMappingURL=createAuctionHouse.test.js.map
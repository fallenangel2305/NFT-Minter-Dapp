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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuctionHouseBuilder = exports.createAuctionHouseOperationHandler = exports.createAuctionHouseOperation = void 0;
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
const tokenModule_2 = require("../../tokenModule");
const constants_1 = require("../constants");
const errors_1 = require("../../../errors");
// -----------------
// Operation
// -----------------
const Key = 'CreateAuctionHouseOperation';
/**
 * Creates an Auction House.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .create({ sellerFeeBasisPoints: 500 }) // 5% fee
 *   .run();
 * ```
 *
 * Provide `auctioneerAuthority` in case you want to enable Auctioneer.
 *
 * ```ts
 * await metaplex
 *   .auctionHouse()
 *   .create({ sellerFeeBasisPoints: 500, auctioneerAuthority: mx.identity().publicKey })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.createAuctionHouseOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.createAuctionHouseOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = yield (0, exports.createAuctionHouseBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
            scope.throwIfCanceled();
            const auctionHouse = yield metaplex
                .auctionHouse()
                .findByAddress({
                address: output.auctionHouseAddress,
                auctioneerAuthority: operation.input.auctioneerAuthority,
            })
                .run(scope);
            return Object.assign(Object.assign({}, output), { auctionHouse });
        });
    },
};
/**
 * Creates an Auction House.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .createAuctionHouse({ sellerFeeBasisPoints: 500 }) // 5% fee
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const createAuctionHouseBuilder = (metaplex, params) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    // Data.
    const canChangeSalePrice = (_a = params.canChangeSalePrice) !== null && _a !== void 0 ? _a : false;
    const requiresSignOff = (_b = params.requiresSignOff) !== null && _b !== void 0 ? _b : canChangeSalePrice;
    // Accounts.
    const authority = (_c = params.authority) !== null && _c !== void 0 ? _c : metaplex.identity();
    const payer = (_d = params.payer) !== null && _d !== void 0 ? _d : metaplex.identity();
    const treasuryMint = (_e = params.treasuryMint) !== null && _e !== void 0 ? _e : tokenModule_2.WRAPPED_SOL_MINT;
    const treasuryWithdrawalDestinationOwner = (_f = params.treasuryWithdrawalDestinationOwner) !== null && _f !== void 0 ? _f : metaplex.identity().publicKey;
    const feeWithdrawalDestination = (_g = params.feeWithdrawalDestination) !== null && _g !== void 0 ? _g : metaplex.identity().publicKey;
    // Auctioneer delegate instruction needs to be signed by authority
    if (params.auctioneerAuthority && !(0, types_1.isSigner)(authority)) {
        throw new errors_1.ExpectedSignerError('authority', 'PublicKey', {
            problemSuffix: 'You are trying to delegate to an Auctioneer authority which ' +
                'requires the Auction House authority to sign a transaction. ' +
                'But you provided the Auction House authority as a Public Key.',
        });
    }
    // PDAs.
    const auctionHouse = (0, pdas_1.findAuctionHousePda)((0, types_1.toPublicKey)(authority), treasuryMint);
    const auctionHouseFeeAccount = (0, pdas_1.findAuctionHouseFeePda)(auctionHouse);
    const auctionHouseTreasury = (0, pdas_1.findAuctionHouseTreasuryPda)(auctionHouse);
    const treasuryWithdrawalDestination = treasuryMint.equals(tokenModule_2.WRAPPED_SOL_MINT)
        ? treasuryWithdrawalDestinationOwner
        : (0, tokenModule_1.findAssociatedTokenAccountPda)(treasuryMint, treasuryWithdrawalDestinationOwner);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        .setContext({
        auctionHouseAddress: auctionHouse,
        auctionHouseFeeAccountAddress: auctionHouseFeeAccount,
        auctionHouseTreasuryAddress: auctionHouseTreasury,
        treasuryWithdrawalDestinationAddress: treasuryWithdrawalDestination,
    })
        // Create and initialize the Auction House account.
        .add({
        instruction: (0, mpl_auction_house_1.createCreateAuctionHouseInstruction)({
            treasuryMint,
            payer: payer.publicKey,
            authority: (0, types_1.toPublicKey)(authority),
            feeWithdrawalDestination,
            treasuryWithdrawalDestination,
            treasuryWithdrawalDestinationOwner,
            auctionHouse,
            auctionHouseFeeAccount,
            auctionHouseTreasury,
        }, {
            bump: auctionHouse.bump,
            feePayerBump: auctionHouseFeeAccount.bump,
            treasuryBump: auctionHouseTreasury.bump,
            sellerFeeBasisPoints: params.sellerFeeBasisPoints,
            requiresSignOff,
            canChangeSalePrice,
        }),
        signers: [payer],
        key: (_h = params.instructionKey) !== null && _h !== void 0 ? _h : 'createAuctionHouse',
    })
        // Delegate to the Auctioneer authority when provided.
        .when(Boolean(params.auctioneerAuthority), (builder) => {
        var _a, _b;
        const auctioneerAuthority = params.auctioneerAuthority;
        return builder.add({
            instruction: (0, mpl_auction_house_1.createDelegateAuctioneerInstruction)({
                auctionHouse,
                authority: (0, types_1.toPublicKey)(authority),
                auctioneerAuthority,
                ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouse, auctioneerAuthority),
            }, { scopes: (_a = params.auctioneerScopes) !== null && _a !== void 0 ? _a : constants_1.AUCTIONEER_ALL_SCOPES }),
            signers: [authority],
            key: (_b = params.delegateAuctioneerInstructionKey) !== null && _b !== void 0 ? _b : 'delegateAuctioneer',
        });
    }));
};
exports.createAuctionHouseBuilder = createAuctionHouseBuilder;
//# sourceMappingURL=createAuctionHouse.js.map
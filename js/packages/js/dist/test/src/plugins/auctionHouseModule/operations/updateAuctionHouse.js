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
exports.updateAuctionHouseBuilder = exports.updateAuctionHouseOperationHandler = exports.updateAuctionHouseOperation = void 0;
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const lodash_isequal_1 = __importDefault(require("lodash.isequal"));
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const errors_1 = require("../../../errors");
const tokenModule_1 = require("../../tokenModule");
const AuctionHouse_1 = require("../models/AuctionHouse");
const errors_2 = require("../errors");
const pdas_1 = require("../pdas");
const constants_1 = require("../constants");
// -----------------
// Operation
// -----------------
const Key = 'UpdateAuctionHouseOperation';
/**
 * Updates an existing Auction House.
 *
 * ```ts
 * await metaplex
 *   .autionHouse()
 *   .update({
 *     auctionHouse,
 *     canChangeSalePrice: true, // Updates the canChangeSalePrice only.
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.updateAuctionHouseOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.updateAuctionHouseOperationHandler = {
    handle(operation, metaplex, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const { auctionHouse, auctioneerAuthority, confirmOptions } = operation.input;
            const builder = (0, exports.updateAuctionHouseBuilder)(metaplex, operation.input);
            if (builder.isEmpty()) {
                throw new errors_1.NoInstructionsToSendError(Key);
            }
            const output = yield builder.sendAndConfirm(metaplex, confirmOptions);
            const currentAuctioneerAuthority = auctionHouse.hasAuctioneer
                ? auctionHouse.auctioneer.authority
                : undefined;
            const updatedAuctionHouse = yield metaplex
                .auctionHouse()
                .findByAddress({
                address: auctionHouse.address,
                auctioneerAuthority: auctioneerAuthority !== null && auctioneerAuthority !== void 0 ? auctioneerAuthority : currentAuctioneerAuthority,
            })
                .run(scope);
            return Object.assign(Object.assign({}, output), { auctionHouse: updatedAuctionHouse });
        });
    },
};
/**
 * Updates an existing Auction House.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .auctionHouse()
 *   .builders()
 *   .updateAuctionHouse({ auctionHouse, canChangeSalePrice: true })
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const updateAuctionHouseBuilder = (metaplex, params) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const authority = (_a = params.authority) !== null && _a !== void 0 ? _a : metaplex.identity();
    const payer = (_b = params.payer) !== null && _b !== void 0 ? _b : metaplex.identity();
    const auctionHouse = params.auctionHouse;
    let treasuryWithdrawalDestinationOwner;
    let treasuryWithdrawalDestination;
    if (auctionHouse.isNative) {
        treasuryWithdrawalDestinationOwner =
            (_c = params.treasuryWithdrawalDestinationOwner) !== null && _c !== void 0 ? _c : auctionHouse.treasuryWithdrawalDestinationAddress;
        treasuryWithdrawalDestination = treasuryWithdrawalDestinationOwner;
    }
    else if (params.treasuryWithdrawalDestinationOwner) {
        treasuryWithdrawalDestinationOwner =
            params.treasuryWithdrawalDestinationOwner;
        treasuryWithdrawalDestination = (0, tokenModule_1.findAssociatedTokenAccountPda)(auctionHouse.treasuryMint.address, treasuryWithdrawalDestinationOwner);
    }
    else {
        throw new errors_2.TreasuryDestinationOwnerRequiredError();
    }
    const originalData = {
        authority: auctionHouse.authorityAddress,
        feeWithdrawalDestination: auctionHouse.feeWithdrawalDestinationAddress,
        treasuryWithdrawalDestination: auctionHouse.treasuryWithdrawalDestinationAddress,
        sellerFeeBasisPoints: auctionHouse.sellerFeeBasisPoints,
        requiresSignOff: auctionHouse.requiresSignOff,
        canChangeSalePrice: auctionHouse.canChangeSalePrice,
    };
    const updatedData = {
        authority: (_d = params.newAuthority) !== null && _d !== void 0 ? _d : originalData.authority,
        feeWithdrawalDestination: (_e = params.feeWithdrawalDestination) !== null && _e !== void 0 ? _e : originalData.feeWithdrawalDestination,
        treasuryWithdrawalDestination,
        sellerFeeBasisPoints: (_f = params.sellerFeeBasisPoints) !== null && _f !== void 0 ? _f : originalData.sellerFeeBasisPoints,
        requiresSignOff: (_g = params.requiresSignOff) !== null && _g !== void 0 ? _g : originalData.requiresSignOff,
        canChangeSalePrice: (_h = params.canChangeSalePrice) !== null && _h !== void 0 ? _h : originalData.canChangeSalePrice,
    };
    const shouldSendUpdateInstruction = !(0, lodash_isequal_1.default)(originalData, updatedData);
    const shouldAddAuctioneerAuthority = !auctionHouse.hasAuctioneer && !!params.auctioneerAuthority;
    const shouldUpdateAuctioneerAuthority = auctionHouse.hasAuctioneer &&
        !!params.auctioneerAuthority &&
        !params.auctioneerAuthority.equals(auctionHouse.auctioneer.authority);
    const shouldUpdateAuctioneerScopes = auctionHouse.hasAuctioneer &&
        !!params.auctioneerScopes &&
        !(0, lodash_isequal_1.default)(params.auctioneerScopes.sort(), auctionHouse.auctioneer.scopes.sort());
    const shouldDelegateAuctioneer = shouldAddAuctioneerAuthority || shouldUpdateAuctioneerAuthority;
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Update the Auction House data.
        .when(shouldSendUpdateInstruction, (builder) => {
        var _a, _b, _c, _d;
        return builder.add({
            instruction: (0, mpl_auction_house_1.createUpdateAuctionHouseInstruction)({
                treasuryMint: auctionHouse.treasuryMint.address,
                payer: payer.publicKey,
                authority: authority.publicKey,
                newAuthority: updatedData.authority,
                feeWithdrawalDestination: updatedData.feeWithdrawalDestination,
                treasuryWithdrawalDestination,
                treasuryWithdrawalDestinationOwner,
                auctionHouse: auctionHouse.address,
            }, {
                sellerFeeBasisPoints: (_a = params.sellerFeeBasisPoints) !== null && _a !== void 0 ? _a : null,
                requiresSignOff: (_b = params.requiresSignOff) !== null && _b !== void 0 ? _b : null,
                canChangeSalePrice: (_c = params.canChangeSalePrice) !== null && _c !== void 0 ? _c : null,
            }),
            signers: [payer, authority],
            key: (_d = params.instructionKey) !== null && _d !== void 0 ? _d : 'updateAuctionHouse',
        });
    })
        // Attach or update a new Auctioneer instance to the Auction House.
        .when(shouldDelegateAuctioneer, (builder) => {
        var _a, _b;
        const auctioneerAuthority = params.auctioneerAuthority;
        const defaultScopes = auctionHouse.hasAuctioneer
            ? auctionHouse.auctioneer.scopes
            : constants_1.AUCTIONEER_ALL_SCOPES;
        return builder.add({
            instruction: (0, mpl_auction_house_1.createDelegateAuctioneerInstruction)({
                auctionHouse: auctionHouse.address,
                authority: authority.publicKey,
                auctioneerAuthority,
                ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority),
            }, { scopes: (_a = params.auctioneerScopes) !== null && _a !== void 0 ? _a : defaultScopes }),
            signers: [authority],
            key: (_b = params.delegateAuctioneerInstructionKey) !== null && _b !== void 0 ? _b : 'delegateAuctioneer',
        });
    })
        // Update the Auctioneer scopes of the Auction House.
        .when(shouldUpdateAuctioneerScopes, (builder) => {
        var _a, _b, _c;
        (0, AuctionHouse_1.assertAuctioneerAuctionHouse)(auctionHouse);
        const auctioneerAuthority = (_a = params.auctioneerAuthority) !== null && _a !== void 0 ? _a : auctionHouse.auctioneer.authority;
        return builder.add({
            instruction: (0, mpl_auction_house_1.createUpdateAuctioneerInstruction)({
                auctionHouse: auctionHouse.address,
                authority: authority.publicKey,
                auctioneerAuthority,
                ahAuctioneerPda: (0, pdas_1.findAuctioneerPda)(auctionHouse.address, auctioneerAuthority),
            }, {
                scopes: (_b = params.auctioneerScopes) !== null && _b !== void 0 ? _b : auctionHouse.auctioneer.scopes,
            }),
            signers: [authority],
            key: (_c = params.updateAuctioneerInstructionKey) !== null && _c !== void 0 ? _c : 'updateAuctioneer',
        });
    }));
};
exports.updateAuctionHouseBuilder = updateAuctionHouseBuilder;
//# sourceMappingURL=updateAuctionHouse.js.map
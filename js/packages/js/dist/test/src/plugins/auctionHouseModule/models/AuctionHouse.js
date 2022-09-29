"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuctionHouse = exports.assertAuctioneerAuctionHouse = exports.isAuctioneerAuctionHouse = exports.assertAuctionHouse = exports.isAuctionHouse = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
/** @group Model Helpers */
const isAuctionHouse = (value) => typeof value === 'object' && value.model === 'auctionHouse';
exports.isAuctionHouse = isAuctionHouse;
/** @group Model Helpers */
function assertAuctionHouse(value) {
    (0, utils_1.assert)((0, exports.isAuctionHouse)(value), `Expected AuctionHouse type`);
}
exports.assertAuctionHouse = assertAuctionHouse;
/** @group Model Helpers */
const isAuctioneerAuctionHouse = (value) => (0, exports.isAuctionHouse)(value) && value.hasAuctioneer;
exports.isAuctioneerAuctionHouse = isAuctioneerAuctionHouse;
/** @group Model Helpers */
function assertAuctioneerAuctionHouse(value) {
    (0, utils_1.assert)((0, exports.isAuctioneerAuctionHouse)(value), `Expected AuctioneerAuctionHouse type`);
}
exports.assertAuctioneerAuctionHouse = assertAuctioneerAuctionHouse;
/** @group Model Helpers */
const toAuctionHouse = (auctionHouseAccount, treasuryMint, auctioneerAccount) => {
    if (auctionHouseAccount.data.hasAuctioneer) {
        (0, utils_1.assert)(!!auctioneerAccount, 'Auctioneer account is required when hasAuctioneer is true');
        (0, utils_1.assert)(!!auctioneerAccount &&
            auctioneerAccount.data.auctionHouse.equals(auctionHouseAccount.publicKey), 'Auctioneer account does not match the AuctionHouse account');
    }
    return Object.assign({ model: 'auctionHouse', address: new types_1.Pda(auctionHouseAccount.publicKey, auctionHouseAccount.data.bump), creatorAddress: auctionHouseAccount.data.creator, authorityAddress: auctionHouseAccount.data.authority, treasuryMint, feeAccountAddress: new types_1.Pda(auctionHouseAccount.data.auctionHouseFeeAccount, auctionHouseAccount.data.feePayerBump), treasuryAccountAddress: new types_1.Pda(auctionHouseAccount.data.auctionHouseTreasury, auctionHouseAccount.data.treasuryBump), feeWithdrawalDestinationAddress: auctionHouseAccount.data.feeWithdrawalDestination, treasuryWithdrawalDestinationAddress: auctionHouseAccount.data.treasuryWithdrawalDestination, sellerFeeBasisPoints: auctionHouseAccount.data.sellerFeeBasisPoints, requiresSignOff: auctionHouseAccount.data.requiresSignOff, canChangeSalePrice: auctionHouseAccount.data.canChangeSalePrice, isNative: treasuryMint.isWrappedSol }, (auctionHouseAccount.data.hasAuctioneer && auctioneerAccount
        ? {
            hasAuctioneer: true,
            auctioneer: {
                address: auctioneerAccount.publicKey,
                authority: auctioneerAccount.data.auctioneerAuthority,
                scopes: auctioneerAccount.data.scopes.reduce((acc, isAllowed, index) => (isAllowed ? [...acc, index] : acc), []),
            },
        }
        : { hasAuctioneer: false }));
};
exports.toAuctionHouse = toAuctionHouse;
//# sourceMappingURL=AuctionHouse.js.map
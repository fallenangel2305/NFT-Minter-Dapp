"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPurchaseReceiptPda = exports.findBidReceiptPda = exports.findListingReceiptPda = exports.findAuctionHouseTradeStatePda = exports.findAuctionHouseBuyerEscrowPda = exports.findAuctionHouseTreasuryPda = exports.findAuctionHouseFeePda = exports.findAuctionHouseProgramAsSignerPda = exports.findAuctioneerPda = exports.findAuctionHousePda = void 0;
const buffer_1 = require("buffer");
const types_1 = require("../../types");
const program_1 = require("./program");
/** @group Pdas */
const findAuctionHousePda = (creator, treasuryMint, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('auction_house', 'utf8'),
        creator.toBuffer(),
        treasuryMint.toBuffer(),
    ]);
};
exports.findAuctionHousePda = findAuctionHousePda;
/** @group Pdas */
const findAuctioneerPda = (auctionHouse, auctioneerAuthority, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('auctioneer', 'utf8'),
        auctionHouse.toBuffer(),
        auctioneerAuthority.toBuffer(),
    ]);
};
exports.findAuctioneerPda = findAuctioneerPda;
/** @group Pdas */
const findAuctionHouseProgramAsSignerPda = (programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('auction_house', 'utf8'),
        buffer_1.Buffer.from('signer', 'utf8'),
    ]);
};
exports.findAuctionHouseProgramAsSignerPda = findAuctionHouseProgramAsSignerPda;
/** @group Pdas */
const findAuctionHouseFeePda = (auctionHouse, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('auction_house', 'utf8'),
        auctionHouse.toBuffer(),
        buffer_1.Buffer.from('fee_payer', 'utf8'),
    ]);
};
exports.findAuctionHouseFeePda = findAuctionHouseFeePda;
/** @group Pdas */
const findAuctionHouseTreasuryPda = (auctionHouse, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('auction_house', 'utf8'),
        auctionHouse.toBuffer(),
        buffer_1.Buffer.from('treasury', 'utf8'),
    ]);
};
exports.findAuctionHouseTreasuryPda = findAuctionHouseTreasuryPda;
/** @group Pdas */
const findAuctionHouseBuyerEscrowPda = (auctionHouse, buyer, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('auction_house', 'utf8'),
        auctionHouse.toBuffer(),
        buyer.toBuffer(),
    ]);
};
exports.findAuctionHouseBuyerEscrowPda = findAuctionHouseBuyerEscrowPda;
/** @group Pdas */
const findAuctionHouseTradeStatePda = (auctionHouse, wallet, treasuryMint, tokenMint, buyPrice, tokenSize, tokenAccount, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('auction_house', 'utf8'),
        wallet.toBuffer(),
        auctionHouse.toBuffer(),
        ...(tokenAccount ? [tokenAccount.toBuffer()] : []),
        treasuryMint.toBuffer(),
        tokenMint.toBuffer(),
        buyPrice.toArrayLike(buffer_1.Buffer, 'le', 8),
        tokenSize.toArrayLike(buffer_1.Buffer, 'le', 8),
    ]);
};
exports.findAuctionHouseTradeStatePda = findAuctionHouseTradeStatePda;
/** @group Pdas */
const findListingReceiptPda = (tradeState, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('listing_receipt', 'utf8'),
        tradeState.toBuffer(),
    ]);
};
exports.findListingReceiptPda = findListingReceiptPda;
/** @group Pdas */
const findBidReceiptPda = (tradeState, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('bid_receipt', 'utf8'),
        tradeState.toBuffer(),
    ]);
};
exports.findBidReceiptPda = findBidReceiptPda;
/** @group Pdas */
const findPurchaseReceiptPda = (sellerTradeState, buyerTradeState, programId = program_1.AuctionHouseProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('purchase_receipt', 'utf8'),
        sellerTradeState.toBuffer(),
        buyerTradeState.toBuffer(),
    ]);
};
exports.findPurchaseReceiptPda = findPurchaseReceiptPda;
//# sourceMappingURL=pdas.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auctionHouseModule = void 0;
const mpl_auction_house_1 = require("@metaplex-foundation/mpl-auction-house");
const AuctionHouseClient_1 = require("./AuctionHouseClient");
const program_1 = require("./program");
const operations_1 = require("./operations");
/** @group Plugins */
const auctionHouseModule = () => ({
    install(metaplex) {
        // Auction House Program.
        metaplex.programs().register({
            name: 'AuctionHouseProgram',
            address: program_1.AuctionHouseProgram.publicKey,
            errorResolver: (error) => mpl_auction_house_1.cusper.errorFromProgramLogs(error.logs, false),
        });
        const op = metaplex.operations();
        op.register(operations_1.cancelBidOperation, operations_1.cancelBidOperationHandler);
        op.register(operations_1.cancelListingOperation, operations_1.cancelListingOperationHandler);
        op.register(operations_1.createAuctionHouseOperation, operations_1.createAuctionHouseOperationHandler);
        op.register(operations_1.createBidOperation, operations_1.createBidOperationHandler);
        op.register(operations_1.createListingOperation, operations_1.createListingOperationHandler);
        op.register(operations_1.depositToBuyerAccountOperation, operations_1.depositToBuyerAccountOperationHandler);
        op.register(operations_1.executeSaleOperation, operations_1.executeSaleOperationHandler);
        op.register(operations_1.findAuctionHouseByAddressOperation, operations_1.findAuctionHouseByAddressOperationHandler);
        op.register(operations_1.findAuctionHouseByCreatorAndMintOperation, operations_1.findAuctionHouseByCreatorAndMintOperationHandler);
        op.register(operations_1.findBidByReceiptOperation, operations_1.findBidByReceiptOperationHandler);
        op.register(operations_1.findBidByTradeStateOperation, operations_1.findBidByTradeStateOperationHandler);
        op.register(operations_1.findBidsByPublicKeyFieldOperation, operations_1.findBidsByPublicKeyFieldOperationHandler);
        op.register(operations_1.findListingByReceiptOperation, operations_1.findListingByReceiptOperationHandler);
        op.register(operations_1.findListingByTradeStateOperation, operations_1.findListingByTradeStateOperationHandler);
        op.register(operations_1.findListingsByPublicKeyFieldOperation, operations_1.findListingsByPublicKeyFieldOperationHandler);
        op.register(operations_1.findPurchaseByReceiptOperation, operations_1.findPurchaseByReceiptOperationHandler);
        op.register(operations_1.findPurchaseByTradeStateOperation, operations_1.findPurchaseByTradeStateOperationHandler);
        op.register(operations_1.findPurchasesByPublicKeyFieldOperation, operations_1.findPurchasesByPublicKeyFieldOperationHandler);
        op.register(operations_1.getBuyerBalanceOperation, operations_1.getBuyerBalanceOperationHandler);
        op.register(operations_1.loadBidOperation, operations_1.loadBidOperationHandler);
        op.register(operations_1.loadListingOperation, operations_1.loadListingOperationHandler);
        op.register(operations_1.loadPurchaseOperation, operations_1.loadPurchaseOperationHandler);
        op.register(operations_1.updateAuctionHouseOperation, operations_1.updateAuctionHouseOperationHandler);
        op.register(operations_1.withdrawFromBuyerAccountOperation, operations_1.withdrawFromBuyerAccountOperationHandler);
        op.register(operations_1.withdrawFromFeeAccountOperation, operations_1.withdrawFromFeeAccountOperationHandler);
        op.register(operations_1.withdrawFromTreasuryAccountOperation, operations_1.withdrawFromTreasuryAccountOperationHandler);
        metaplex.auctionHouse = function () {
            return new AuctionHouseClient_1.AuctionHouseClient(this);
        };
    },
});
exports.auctionHouseModule = auctionHouseModule;
//# sourceMappingURL=plugin.js.map
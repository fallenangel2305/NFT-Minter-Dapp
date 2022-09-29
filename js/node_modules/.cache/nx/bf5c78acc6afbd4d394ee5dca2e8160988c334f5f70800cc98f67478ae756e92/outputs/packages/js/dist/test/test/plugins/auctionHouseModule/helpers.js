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
exports.createAuctionHouse = void 0;
const types_1 = require("../../../src/types");
const createAuctionHouse = (mx, auctioneerAuthority, input = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const { auctionHouse } = yield mx
        .auctionHouse()
        .create(Object.assign({ sellerFeeBasisPoints: 200, auctioneerAuthority: auctioneerAuthority === null || auctioneerAuthority === void 0 ? void 0 : auctioneerAuthority.publicKey }, input))
        .run();
    yield mx.rpc().airdrop(auctionHouse.feeAccountAddress, (0, types_1.sol)(100));
    return auctionHouse;
});
exports.createAuctionHouse = createAuctionHouse;
//# sourceMappingURL=helpers.js.map
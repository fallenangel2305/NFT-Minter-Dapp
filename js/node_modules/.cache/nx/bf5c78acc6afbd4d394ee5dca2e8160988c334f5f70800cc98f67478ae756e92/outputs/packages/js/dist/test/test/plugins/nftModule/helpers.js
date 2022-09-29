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
exports.assertRefreshedCollectionHasSize = exports.assertCollectionHasSize = void 0;
const assertCollectionHasSize = (t, collectionNft, expectedSize) => {
    var _a, _b;
    t.equal((_b = (_a = collectionNft.collectionDetails) === null || _a === void 0 ? void 0 : _a.size) === null || _b === void 0 ? void 0 : _b.toNumber(), expectedSize, `collection NFT has the expected size: ${expectedSize}`);
};
exports.assertCollectionHasSize = assertCollectionHasSize;
const assertRefreshedCollectionHasSize = (t, mx, collectionNft, expectedSize) => __awaiter(void 0, void 0, void 0, function* () {
    const updateCollectionNft = yield mx.nfts().refresh(collectionNft).run();
    (0, exports.assertCollectionHasSize)(t, updateCollectionNft, expectedSize);
});
exports.assertRefreshedCollectionHasSize = assertRefreshedCollectionHasSize;
//# sourceMappingURL=helpers.js.map
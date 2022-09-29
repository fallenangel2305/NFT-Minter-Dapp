"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNftWithToken = exports.assertNftOrSftWithToken = exports.assertNftWithToken = exports.isNftWithToken = exports.toNft = exports.assertNft = exports.isNft = void 0;
const utils_1 = require("../../../utils");
const Sft_1 = require("./Sft");
/** @group Model Helpers */
const isNft = (value) => typeof value === 'object' && value.model === 'nft';
exports.isNft = isNft;
/** @group Model Helpers */
function assertNft(value) {
    (0, utils_1.assert)((0, exports.isNft)(value), `Expected Nft model`);
}
exports.assertNft = assertNft;
/** @group Model Helpers */
const toNft = (metadata, mint, edition) => (Object.assign(Object.assign({}, (0, Sft_1.toSft)(metadata, mint)), { model: 'nft', edition }));
exports.toNft = toNft;
/** @group Model Helpers */
const isNftWithToken = (value) => (0, exports.isNft)(value) && 'token' in value;
exports.isNftWithToken = isNftWithToken;
/** @group Model Helpers */
function assertNftWithToken(value) {
    (0, utils_1.assert)((0, exports.isNftWithToken)(value), `Expected Nft model with token`);
}
exports.assertNftWithToken = assertNftWithToken;
/** @group Model Helpers */
function assertNftOrSftWithToken(value) {
    (0, utils_1.assert)((0, exports.isNftWithToken)(value) || (0, Sft_1.isSftWithToken)(value), `Expected Nft or Sft model with token`);
}
exports.assertNftOrSftWithToken = assertNftOrSftWithToken;
/** @group Model Helpers */
const toNftWithToken = (metadata, mint, edition, token) => (Object.assign(Object.assign({}, (0, Sft_1.toSftWithToken)(metadata, mint, token)), { model: 'nft', edition }));
exports.toNftWithToken = toNftWithToken;
//# sourceMappingURL=Nft.js.map
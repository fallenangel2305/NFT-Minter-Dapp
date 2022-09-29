"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNftPrintEdition = exports.assertNftPrintEdition = exports.isNftPrintEdition = exports.toNftOriginalEdition = exports.assertNftOriginalEdition = exports.isNftOriginalEdition = exports.toNftEdition = exports.assertNftEdition = exports.isNftEdition = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const accounts_1 = require("../accounts");
/** @group Model Helpers */
const isNftEdition = (value) => typeof value === 'object' && value.model === 'nftEdition';
exports.isNftEdition = isNftEdition;
/** @group Model Helpers */
function assertNftEdition(value) {
    (0, utils_1.assert)((0, exports.isNftEdition)(value), `Expected NftEdition model`);
}
exports.assertNftEdition = assertNftEdition;
/** @group Model Helpers */
const toNftEdition = (account) => (0, accounts_1.isOriginalEditionAccount)(account)
    ? (0, exports.toNftOriginalEdition)(account)
    : (0, exports.toNftPrintEdition)(account);
exports.toNftEdition = toNftEdition;
/** @group Model Helpers */
const isNftOriginalEdition = (value) => (0, exports.isNftEdition)(value) && value.isOriginal;
exports.isNftOriginalEdition = isNftOriginalEdition;
/** @group Model Helpers */
function assertNftOriginalEdition(value) {
    (0, utils_1.assert)((0, exports.isNftOriginalEdition)(value), `Expected NftOriginalEdition model`);
}
exports.assertNftOriginalEdition = assertNftOriginalEdition;
/** @group Model Helpers */
const toNftOriginalEdition = (account) => ({
    model: 'nftEdition',
    isOriginal: true,
    address: account.publicKey,
    supply: (0, types_1.toBigNumber)(account.data.supply),
    maxSupply: (0, types_1.toOptionBigNumber)(account.data.maxSupply),
});
exports.toNftOriginalEdition = toNftOriginalEdition;
/** @group Model Helpers */
const isNftPrintEdition = (value) => (0, exports.isNftEdition)(value) && !value.isOriginal;
exports.isNftPrintEdition = isNftPrintEdition;
/** @group Model Helpers */
function assertNftPrintEdition(value) {
    (0, utils_1.assert)((0, exports.isNftPrintEdition)(value), `Expected NftPrintEdition model`);
}
exports.assertNftPrintEdition = assertNftPrintEdition;
/** @group Model Helpers */
const toNftPrintEdition = (account) => ({
    model: 'nftEdition',
    isOriginal: false,
    address: account.publicKey,
    parent: account.data.parent,
    number: (0, types_1.toBigNumber)(account.data.edition),
});
exports.toNftPrintEdition = toNftPrintEdition;
//# sourceMappingURL=NftEdition.js.map
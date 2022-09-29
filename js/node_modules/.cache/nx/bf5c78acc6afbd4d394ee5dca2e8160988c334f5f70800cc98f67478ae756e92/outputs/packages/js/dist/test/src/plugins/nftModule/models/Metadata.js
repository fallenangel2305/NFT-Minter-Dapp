"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMetadata = exports.assertMetadata = exports.isMetadata = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const pdas_1 = require("../pdas");
/** @group Model Helpers */
const isMetadata = (value) => typeof value === 'object' && value.model === 'metadata';
exports.isMetadata = isMetadata;
/** @group Model Helpers */
function assertMetadata(value) {
    (0, utils_1.assert)((0, exports.isMetadata)(value), `Expected Metadata model`);
}
exports.assertMetadata = assertMetadata;
/** @group Model Helpers */
const toMetadata = (account, json) => {
    var _a;
    return ({
        model: 'metadata',
        address: (0, pdas_1.findMetadataPda)(account.data.mint),
        mintAddress: account.data.mint,
        updateAuthorityAddress: account.data.updateAuthority,
        json: json !== null && json !== void 0 ? json : null,
        jsonLoaded: json !== undefined,
        name: (0, utils_1.removeEmptyChars)(account.data.data.name),
        symbol: (0, utils_1.removeEmptyChars)(account.data.data.symbol),
        uri: (0, utils_1.removeEmptyChars)(account.data.data.uri),
        isMutable: account.data.isMutable,
        primarySaleHappened: account.data.primarySaleHappened,
        sellerFeeBasisPoints: account.data.data.sellerFeeBasisPoints,
        editionNonce: account.data.editionNonce,
        creators: (_a = account.data.data.creators) !== null && _a !== void 0 ? _a : [],
        tokenStandard: account.data.tokenStandard,
        collection: account.data.collection
            ? Object.assign(Object.assign({}, account.data.collection), { address: account.data.collection.key }) : null,
        collectionDetails: account.data.collectionDetails
            ? {
                version: account.data.collectionDetails.__kind,
                size: (0, types_1.toBigNumber)(account.data.collectionDetails.size),
            }
            : null,
        uses: account.data.uses
            ? Object.assign(Object.assign({}, account.data.uses), { remaining: (0, types_1.toBigNumber)(account.data.uses.remaining), total: (0, types_1.toBigNumber)(account.data.uses.total) }) : null,
    });
};
exports.toMetadata = toMetadata;
//# sourceMappingURL=Metadata.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentCollectionMissingError = exports.NftError = void 0;
const errors_1 = require("../../errors");
/** @group Errors */
class NftError extends errors_1.MetaplexError {
    constructor(input) {
        super(Object.assign(Object.assign({}, input), { key: `plugin.nft.${input.key}`, title: `NFT > ${input.title}`, source: 'plugin', sourceDetails: 'NFT' }));
    }
}
exports.NftError = NftError;
/** @group Errors */
class ParentCollectionMissingError extends NftError {
    constructor(mint, operation, options) {
        super({
            options,
            key: 'parent_collection_missing',
            title: 'Parent Collection Missing',
            problem: `You are trying to send the operation [${operation}] which requires the NFT to have ` +
                `a parent collection but that is not the case for the NFT at address [${mint}].`,
            solution: 'Ensure the NFT you are interacting with has a parent collection.',
        });
    }
}
exports.ParentCollectionMissingError = ParentCollectionMissingError;
//# sourceMappingURL=errors.js.map
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
exports.loadMetadataOperationHandler = exports.loadMetadataOperation = void 0;
const types_1 = require("../../../types");
// -----------------
// Operation
// -----------------
const Key = 'LoadMetadataOperation';
/**
 * Transforms a `Metadata` model into a `Nft` or `Sft` model.
 *
 * ```ts
 * const nfts = await metaplex
 *   .nfts()
 *   .load({ metadata })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.loadMetadataOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.loadMetadataOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { metadata, loadJsonMetadata = true } = operation.input;
        let nftOrSft = yield metaplex
            .nfts()
            .findByMint(Object.assign(Object.assign({}, operation.input), { mintAddress: metadata.mintAddress, loadJsonMetadata: !metadata.jsonLoaded && loadJsonMetadata }))
            .run(scope);
        if (!nftOrSft.jsonLoaded && metadata.jsonLoaded) {
            nftOrSft = Object.assign(Object.assign({}, nftOrSft), { json: metadata.json, jsonLoaded: true });
        }
        return nftOrSft;
    }),
};
//# sourceMappingURL=loadMetadata.js.map
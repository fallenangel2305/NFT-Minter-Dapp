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
exports.findNftByMetadataOperationHandler = exports.findNftByMetadataOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
// -----------------
// Operation
// -----------------
const Key = 'FindNftByMetadataOperation';
/**
 * Finds an NFT or an SFT by its metadata address.
 *
 * ```ts
 * const nft = await metaplex
 *   .nfts()
 *   .findByMetadata({ metadata })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findNftByMetadataOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findNftByMetadataOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const metadata = (0, accounts_1.toMetadataAccount)(yield metaplex.rpc().getAccount(operation.input.metadata));
        scope.throwIfCanceled();
        return metaplex
            .nfts()
            .findByMint(Object.assign(Object.assign({}, operation.input), { mintAddress: metadata.data.mint }))
            .run(scope);
    }),
};
//# sourceMappingURL=findNftByMetadata.js.map
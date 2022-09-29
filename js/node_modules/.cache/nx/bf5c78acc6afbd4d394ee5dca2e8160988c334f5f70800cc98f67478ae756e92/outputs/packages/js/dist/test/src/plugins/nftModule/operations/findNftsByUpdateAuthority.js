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
exports.findNftsByUpdateAuthorityOperationHandler = exports.findNftsByUpdateAuthorityOperation = void 0;
const types_1 = require("../../../types");
const program_1 = require("../program");
const findNftsByMintList_1 = require("./findNftsByMintList");
// -----------------
// Operation
// -----------------
const Key = 'FindNftsByUpdateAuthorityOperation';
/**
 * Finds multiple NFTs and SFTs by a given update authority.
 *
 * ```ts
 * const nfts = await metaplex
 *   .nfts()
 *   .findAllByUpdateAuthority({ updateAuthority })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findNftsByUpdateAuthorityOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findNftsByUpdateAuthorityOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { updateAuthority, commitment } = operation.input;
        const mints = yield program_1.TokenMetadataProgram.metadataV1Accounts(metaplex)
            .selectMint()
            .whereUpdateAuthority(updateAuthority)
            .getDataAsPublicKeys();
        scope.throwIfCanceled();
        const nfts = yield metaplex
            .operations()
            .execute((0, findNftsByMintList_1.findNftsByMintListOperation)({ mints, commitment }), scope);
        scope.throwIfCanceled();
        return nfts.filter((nft) => nft !== null);
    }),
};
//# sourceMappingURL=findNftsByUpdateAuthority.js.map
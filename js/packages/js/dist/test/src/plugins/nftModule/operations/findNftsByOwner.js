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
exports.findNftsByOwnerOperationHandler = exports.findNftsByOwnerOperation = void 0;
const types_1 = require("../../../types");
const tokenModule_1 = require("../../tokenModule");
const findNftsByMintList_1 = require("./findNftsByMintList");
// -----------------
// Operation
// -----------------
const Key = 'FindNftsByOwnerOperation';
/**
 * Finds multiple NFTs and SFTs by a given owner.
 *
 * ```ts
 * const nfts = await metaplex
 *   .nfts()
 *   .findAllByOwner({ owner })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findNftsByOwnerOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findNftsByOwnerOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { owner, commitment } = operation.input;
        const mints = yield tokenModule_1.TokenProgram.tokenAccounts(metaplex)
            .selectMint()
            .whereOwner(owner)
            .whereAmount(1)
            .getDataAsPublicKeys();
        scope.throwIfCanceled();
        const nfts = yield metaplex
            .operations()
            .execute((0, findNftsByMintList_1.findNftsByMintListOperation)({ mints, commitment }), scope);
        scope.throwIfCanceled();
        return nfts.filter((nft) => nft !== null);
    }),
};
//# sourceMappingURL=findNftsByOwner.js.map
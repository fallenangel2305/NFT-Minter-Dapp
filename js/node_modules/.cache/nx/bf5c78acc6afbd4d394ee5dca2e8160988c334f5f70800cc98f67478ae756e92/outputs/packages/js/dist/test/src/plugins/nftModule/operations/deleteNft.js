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
exports.deleteNftBuilder = exports.deleteNftOperationHandler = exports.deleteNftOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'DeleteNftOperation';
/**
 * Deletes an existing NFT.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .delete({ mintAddress })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.deleteNftOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.deleteNftOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.deleteNftBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Deletes an existing NFT.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .delete({ mintAddress });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const deleteNftBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, owner = metaplex.identity(), ownerTokenAccount, collection, tokenProgram = tokenModule_1.TokenProgram.publicKey, } = params;
    const metadata = (0, pdas_1.findMetadataPda)(mintAddress);
    const edition = (0, pdas_1.findMasterEditionV2Pda)(mintAddress);
    const tokenAddress = ownerTokenAccount !== null && ownerTokenAccount !== void 0 ? ownerTokenAccount : (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, owner.publicKey);
    return utils_1.TransactionBuilder.make().add({
        instruction: (0, mpl_token_metadata_1.createBurnNftInstruction)({
            metadata,
            owner: owner.publicKey,
            mint: mintAddress,
            tokenAccount: tokenAddress,
            masterEditionAccount: edition,
            splTokenProgram: tokenProgram,
            collectionMetadata: collection ? (0, pdas_1.findMetadataPda)(collection) : undefined,
        }),
        signers: [owner],
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'deleteNft',
    });
};
exports.deleteNftBuilder = deleteNftBuilder;
//# sourceMappingURL=deleteNft.js.map
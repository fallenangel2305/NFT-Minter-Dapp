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
exports.approveNftCollectionAuthorityBuilder = exports.approveNftCollectionAuthorityOperationHandler = exports.approveNftCollectionAuthorityOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'ApproveNftCollectionAuthorityOperation';
/**
 * Approves a new collection authority.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .approveCollectionAuthority({
 *     mintAddress,
 *     collectionAuthority,
 *   })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.approveNftCollectionAuthorityOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.approveNftCollectionAuthorityOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.approveNftCollectionAuthorityBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Approves a new collection authority.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .approveCollectionAuthority({
 *     mintAddress,
 *     collectionAuthority,
 *   });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const approveNftCollectionAuthorityBuilder = (metaplex, params) => {
    var _a, _b;
    const { mintAddress, collectionAuthority, updateAuthority = metaplex.identity(), payer = metaplex.identity(), } = params;
    const metadata = (0, pdas_1.findMetadataPda)(mintAddress);
    const collectionAuthorityRecord = (0, pdas_1.findCollectionAuthorityRecordPda)(mintAddress, collectionAuthority);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Approve the collection authority.
        .add({
        instruction: (0, mpl_token_metadata_1.createApproveCollectionAuthorityInstruction)({
            collectionAuthorityRecord,
            newCollectionAuthority: collectionAuthority,
            updateAuthority: updateAuthority.publicKey,
            payer: payer.publicKey,
            metadata,
            mint: mintAddress,
            systemProgram: (_a = params.systemProgram) !== null && _a !== void 0 ? _a : web3_js_1.SystemProgram.programId,
        }),
        signers: [payer, updateAuthority],
        key: (_b = params.instructionKey) !== null && _b !== void 0 ? _b : 'approveCollectionAuthority',
    }));
};
exports.approveNftCollectionAuthorityBuilder = approveNftCollectionAuthorityBuilder;
//# sourceMappingURL=approveNftCollectionAuthority.js.map
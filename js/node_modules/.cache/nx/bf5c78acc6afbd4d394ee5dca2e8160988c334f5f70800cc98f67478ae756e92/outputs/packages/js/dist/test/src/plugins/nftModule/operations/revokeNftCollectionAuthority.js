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
exports.revokeNftCollectionAuthorityBuilder = exports.revokeNftCollectionAuthorityOperationHandler = exports.revokeNftCollectionAuthorityOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'RevokeNftCollectionAuthorityOperation';
/**
 * Revokes an existing collection authority.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .revokeCollectionAuthority({ mintAddress, collectionAuthority })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.revokeNftCollectionAuthorityOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.revokeNftCollectionAuthorityOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.revokeNftCollectionAuthorityBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Revokes an existing collection authority.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .revokeCollectionAuthority({ mintAddress, collectionAuthority });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const revokeNftCollectionAuthorityBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, collectionAuthority, revokeAuthority = metaplex.identity(), } = params;
    const metadata = (0, pdas_1.findMetadataPda)(mintAddress);
    const collectionAuthorityRecord = (0, pdas_1.findCollectionAuthorityRecordPda)(mintAddress, collectionAuthority);
    const instruction = (0, mpl_token_metadata_1.createRevokeCollectionAuthorityInstruction)({
        collectionAuthorityRecord,
        delegateAuthority: collectionAuthority,
        revokeAuthority: revokeAuthority.publicKey,
        metadata,
        mint: mintAddress,
    });
    // Temporary fix. The Shank macro wrongfully ask for the delegateAuthority to be a signer.
    // https://github.com/metaplex-foundation/metaplex-program-library/pull/639
    instruction.keys[1].isSigner = false;
    return (utils_1.TransactionBuilder.make()
        // Revoke the collection authority.
        .add({
        instruction,
        signers: [revokeAuthority],
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'revokeCollectionAuthority',
    }));
};
exports.revokeNftCollectionAuthorityBuilder = revokeNftCollectionAuthorityBuilder;
//# sourceMappingURL=revokeNftCollectionAuthority.js.map
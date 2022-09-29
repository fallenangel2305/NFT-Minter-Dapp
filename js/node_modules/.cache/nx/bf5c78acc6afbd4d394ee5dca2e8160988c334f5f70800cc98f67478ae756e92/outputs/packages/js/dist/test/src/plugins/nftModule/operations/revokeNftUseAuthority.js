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
exports.revokeNftUseAuthorityBuilder = exports.revokeNftUseAuthorityOperationHandler = exports.revokeNftUseAuthorityOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'RevokeNftUseAuthorityOperation';
/**
 * Revokes an existing use authority.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .revokeUseAuthority({ mintAddress, user })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.revokeNftUseAuthorityOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.revokeNftUseAuthorityOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.revokeNftUseAuthorityBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Revokes an existing use authority.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .revokeUseAuthority({ mintAddress, user });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const revokeNftUseAuthorityBuilder = (metaplex, params) => {
    var _a, _b, _c, _d;
    const { mintAddress, user, owner = metaplex.identity() } = params;
    const metadata = (0, pdas_1.findMetadataPda)(mintAddress);
    const useAuthorityRecord = (0, pdas_1.findUseAuthorityRecordPda)(mintAddress, user);
    const ownerTokenAddress = (_a = params.ownerTokenAddress) !== null && _a !== void 0 ? _a : (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, owner.publicKey);
    return (utils_1.TransactionBuilder.make()
        // Revoke the use authority.
        .add({
        instruction: (0, mpl_token_metadata_1.createRevokeUseAuthorityInstruction)({
            useAuthorityRecord,
            owner: owner.publicKey,
            user,
            ownerTokenAccount: ownerTokenAddress,
            mint: mintAddress,
            metadata,
            tokenProgram: (_b = params.tokenProgram) !== null && _b !== void 0 ? _b : tokenModule_1.TokenProgram.publicKey,
            systemProgram: (_c = params.systemProgram) !== null && _c !== void 0 ? _c : web3_js_1.SystemProgram.programId,
        }),
        signers: [owner],
        key: (_d = params.instructionKey) !== null && _d !== void 0 ? _d : 'revokeUseAuthority',
    }));
};
exports.revokeNftUseAuthorityBuilder = revokeNftUseAuthorityBuilder;
//# sourceMappingURL=revokeNftUseAuthority.js.map
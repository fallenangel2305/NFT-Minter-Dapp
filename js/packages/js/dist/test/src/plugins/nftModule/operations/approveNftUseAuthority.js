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
exports.approveNftUseAuthorityBuilder = exports.approveNftUseAuthorityOperationHandler = exports.approveNftUseAuthorityOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'ApproveNftUseAuthorityOperation';
/**
 * Approves a new use authority.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .approveUseAuthority({ mintAddress, user })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.approveNftUseAuthorityOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.approveNftUseAuthorityOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.approveNftUseAuthorityBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Approves a new use authority.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .approveUseAuthority({ mintAddress, user });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const approveNftUseAuthorityBuilder = (metaplex, params) => {
    var _a, _b, _c, _d, _e;
    const { mintAddress, user, owner = metaplex.identity(), payer = metaplex.identity(), } = params;
    const metadata = (0, pdas_1.findMetadataPda)(mintAddress);
    const useAuthorityRecord = (0, pdas_1.findUseAuthorityRecordPda)(mintAddress, user);
    const programAsBurner = (0, pdas_1.findProgramAsBurnerPda)();
    const ownerTokenAddress = (_a = params.ownerTokenAddress) !== null && _a !== void 0 ? _a : (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, owner.publicKey);
    return (utils_1.TransactionBuilder.make()
        .setFeePayer(payer)
        // Approve the use authority.
        .add({
        instruction: (0, mpl_token_metadata_1.createApproveUseAuthorityInstruction)({
            useAuthorityRecord,
            owner: owner.publicKey,
            payer: payer.publicKey,
            user,
            ownerTokenAccount: ownerTokenAddress,
            metadata,
            mint: mintAddress,
            burner: programAsBurner,
            tokenProgram: (_b = params.tokenProgram) !== null && _b !== void 0 ? _b : tokenModule_1.TokenProgram.publicKey,
            systemProgram: (_c = params.systemProgram) !== null && _c !== void 0 ? _c : web3_js_1.SystemProgram.programId,
        }, {
            approveUseAuthorityArgs: {
                numberOfUses: (_d = params.numberOfUses) !== null && _d !== void 0 ? _d : 1,
            },
        }),
        signers: [owner, payer],
        key: (_e = params.instructionKey) !== null && _e !== void 0 ? _e : 'approveUseAuthority',
    }));
};
exports.approveNftUseAuthorityBuilder = approveNftUseAuthorityBuilder;
//# sourceMappingURL=approveNftUseAuthority.js.map
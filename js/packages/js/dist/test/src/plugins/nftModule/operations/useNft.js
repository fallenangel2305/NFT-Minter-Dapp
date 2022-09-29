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
exports.useNftBuilder = exports.useNftOperationHandler = exports.useNftOperation = void 0;
const errors_1 = require("../../../errors");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'UseNftOperation';
/**
 * Utilizes a usable NFT.
 *
 * ```ts
 * await metaplex.nfts().use({ mintAddress }).run();
 * await metaplex.nfts().use({ mintAddress, numberOfUses: 3 }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.useNftOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.useNftOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.useNftBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Utilizes a usable NFT.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .use({ mintAddress });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const useNftBuilder = (metaplex, params) => {
    var _a, _b;
    const { mintAddress, numberOfUses = 1, owner = metaplex.identity(), useAuthority, } = params;
    if (!(0, types_1.isSigner)(owner) && !useAuthority) {
        throw new errors_1.ExpectedSignerError('owner', 'PublicKey', {
            problemSuffix: 'In order to use an NFT you must either provide the owner as a Signer ' +
                'or a delegated use authority as a Signer.',
        });
    }
    const metadata = (0, pdas_1.findMetadataPda)(mintAddress);
    const tokenAccount = (_a = params.ownerTokenAccount) !== null && _a !== void 0 ? _a : (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, (0, types_1.toPublicKey)(owner));
    const useAuthorityRecord = useAuthority
        ? (0, pdas_1.findUseAuthorityRecordPda)(mintAddress, useAuthority.publicKey)
        : undefined;
    const programAsBurner = (0, pdas_1.findProgramAsBurnerPda)();
    return (utils_1.TransactionBuilder.make()
        // Update the metadata account.
        .add({
        instruction: (0, mpl_token_metadata_1.createUtilizeInstruction)({
            metadata,
            tokenAccount,
            useAuthority: useAuthority
                ? useAuthority.publicKey
                : (0, types_1.toPublicKey)(owner),
            mint: mintAddress,
            owner: (0, types_1.toPublicKey)(owner),
            useAuthorityRecord,
            burner: useAuthorityRecord ? programAsBurner : undefined,
        }, { utilizeArgs: { numberOfUses } }),
        signers: [owner, useAuthority].filter(types_1.isSigner),
        key: (_b = params.instructionKey) !== null && _b !== void 0 ? _b : 'utilizeNft',
    }));
};
exports.useNftBuilder = useNftBuilder;
//# sourceMappingURL=useNft.js.map
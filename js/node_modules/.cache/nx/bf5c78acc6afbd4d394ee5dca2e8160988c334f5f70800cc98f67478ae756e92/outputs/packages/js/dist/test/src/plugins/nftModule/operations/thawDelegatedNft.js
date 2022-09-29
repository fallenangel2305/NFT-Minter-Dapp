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
exports.thawDelegatedNftBuilder = exports.thawDelegatedNftOperationHandler = exports.thawDelegatedNftOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const tokenModule_1 = require("../../tokenModule");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'ThawDelegatedNftOperation';
/**
 * Thaws a NFT via its delegate authority.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .thawDelegatedNft({ mintAddress, delegateAuthority })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.thawDelegatedNftOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.thawDelegatedNftOperationHandler = {
    handle(operation, metaplex) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, exports.thawDelegatedNftBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
        });
    },
};
/**
 * Thaws a NFT via its delegate authority.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .thawDelegatedNft({ mintAddress, delegateAuthority });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const thawDelegatedNftBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, delegateAuthority, tokenOwner = metaplex.identity().publicKey, tokenAddress, tokenProgram = tokenModule_1.TokenProgram.publicKey, } = params;
    const editionAddress = (0, pdas_1.findMasterEditionV2Pda)(mintAddress);
    const tokenAddressOrAta = tokenAddress !== null && tokenAddress !== void 0 ? tokenAddress : (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, tokenOwner);
    return utils_1.TransactionBuilder.make().add({
        instruction: (0, mpl_token_metadata_1.createThawDelegatedAccountInstruction)({
            delegate: delegateAuthority.publicKey,
            tokenAccount: tokenAddressOrAta,
            edition: editionAddress,
            mint: mintAddress,
            tokenProgram,
        }),
        signers: [delegateAuthority],
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'thawDelegatedNft',
    });
};
exports.thawDelegatedNftBuilder = thawDelegatedNftBuilder;
//# sourceMappingURL=thawDelegatedNft.js.map
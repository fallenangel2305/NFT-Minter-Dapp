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
exports.unverifyNftCreatorBuilder = exports.unverifyNftCreatorOperationHandler = exports.unverifyNftCreatorOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'UnverifyNftCreatorOperation';
/**
 * Unverifies the creator of an NFT or SFT.
 *
 * ```ts
 * await metaplex
 *   .nfts()
 *   .unverifyCreator({ mintAddress, creator })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.unverifyNftCreatorOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.unverifyNftCreatorOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, exports.unverifyNftCreatorBuilder)(metaplex, operation.input).sendAndConfirm(metaplex, operation.input.confirmOptions);
    }),
};
/**
 * Unverifies the creator of an NFT or SFT.
 *
 * ```ts
 * const transactionBuilder = metaplex
 *   .nfts()
 *   .builders()
 *   .unverifyCreator({ mintAddress, creator });
 * ```
 *
 * @group Transaction Builders
 * @category Constructors
 */
const unverifyNftCreatorBuilder = (metaplex, params) => {
    var _a;
    const { mintAddress, creator = metaplex.identity() } = params;
    return (utils_1.TransactionBuilder.make()
        // Verify the creator.
        .add({
        instruction: (0, mpl_token_metadata_1.createRemoveCreatorVerificationInstruction)({
            metadata: (0, pdas_1.findMetadataPda)(mintAddress),
            creator: creator.publicKey,
        }),
        signers: [creator],
        key: (_a = params.instructionKey) !== null && _a !== void 0 ? _a : 'unverifyCreator',
    }));
};
exports.unverifyNftCreatorBuilder = unverifyNftCreatorBuilder;
//# sourceMappingURL=unverifyNftCreator.js.map
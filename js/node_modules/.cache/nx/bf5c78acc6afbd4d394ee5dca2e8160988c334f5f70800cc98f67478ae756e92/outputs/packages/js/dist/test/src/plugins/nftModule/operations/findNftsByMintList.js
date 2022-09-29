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
exports.findNftsByMintListOperationHandler = exports.findNftsByMintListOperation = void 0;
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const accounts_1 = require("../accounts");
const models_1 = require("../models");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'FindNftsByMintListOperation';
/**
 * Finds multiple NFTs and SFTs by a given list of mint addresses.
 *
 * ```ts
 * const nfts = await metaplex
 *   .nfts()
 *   .findAllByMintList({ mints: [...] })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findNftsByMintListOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findNftsByMintListOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { mints, commitment } = operation.input;
        const metadataPdas = mints.map((mint) => (0, pdas_1.findMetadataPda)(mint));
        const metadataInfos = yield utils_1.GmaBuilder.make(metaplex, metadataPdas, {
            commitment,
        }).get();
        scope.throwIfCanceled();
        return metadataInfos.map((account) => {
            if (!account.exists) {
                return null;
            }
            try {
                return (0, models_1.toMetadata)((0, accounts_1.toMetadataAccount)(account));
            }
            catch (error) {
                return null;
            }
        });
    }),
};
//# sourceMappingURL=findNftsByMintList.js.map
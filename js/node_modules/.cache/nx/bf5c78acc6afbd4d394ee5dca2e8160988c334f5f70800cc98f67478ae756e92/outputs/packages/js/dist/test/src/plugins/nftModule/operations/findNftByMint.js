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
exports.findNftByMintOperationHandler = exports.findNftByMintOperation = void 0;
const types_1 = require("../../../types");
const tokenModule_1 = require("../../tokenModule");
const accounts_1 = require("../accounts");
const models_1 = require("../models");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'FindNftByMintOperation';
/**
 * Finds an NFT or an SFT by its mint address.
 *
 * ```ts
 * const nft = await metaplex
 *   .nfts()
 *   .findByMint({ mintAddress })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findNftByMintOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findNftByMintOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { mintAddress, tokenAddress, tokenOwner, loadJsonMetadata = true, commitment, } = operation.input;
        const associatedTokenAddress = tokenOwner
            ? (0, tokenModule_1.findAssociatedTokenAccountPda)(mintAddress, tokenOwner)
            : undefined;
        const accountAddresses = [
            mintAddress,
            (0, pdas_1.findMetadataPda)(mintAddress),
            (0, pdas_1.findMasterEditionV2Pda)(mintAddress),
            tokenAddress !== null && tokenAddress !== void 0 ? tokenAddress : associatedTokenAddress,
        ].filter((address) => !!address);
        const accounts = yield metaplex
            .rpc()
            .getMultipleAccounts(accountAddresses, commitment);
        scope.throwIfCanceled();
        const mint = (0, tokenModule_1.toMint)((0, tokenModule_1.toMintAccount)(accounts[0]));
        let metadata = (0, models_1.toMetadata)((0, accounts_1.toMetadataAccount)(accounts[1]));
        const editionAccount = (0, accounts_1.parseOriginalOrPrintEditionAccount)(accounts[2]);
        const token = accounts[3] ? (0, tokenModule_1.toToken)((0, tokenModule_1.toTokenAccount)(accounts[3])) : null;
        if (loadJsonMetadata) {
            try {
                const json = yield metaplex
                    .storage()
                    .downloadJson(metadata.uri, scope);
                metadata = Object.assign(Object.assign({}, metadata), { jsonLoaded: true, json });
            }
            catch (error) {
                metadata = Object.assign(Object.assign({}, metadata), { jsonLoaded: true, json: null });
            }
        }
        const isNft = editionAccount.exists &&
            mint.mintAuthorityAddress &&
            mint.mintAuthorityAddress.equals(editionAccount.publicKey);
        if (isNft) {
            const edition = (0, models_1.toNftEdition)(editionAccount);
            return token
                ? (0, models_1.toNftWithToken)(metadata, mint, edition, token)
                : (0, models_1.toNft)(metadata, mint, edition);
        }
        return token
            ? (0, models_1.toSftWithToken)(metadata, mint, token)
            : (0, models_1.toSft)(metadata, mint);
    }),
};
//# sourceMappingURL=findNftByMint.js.map
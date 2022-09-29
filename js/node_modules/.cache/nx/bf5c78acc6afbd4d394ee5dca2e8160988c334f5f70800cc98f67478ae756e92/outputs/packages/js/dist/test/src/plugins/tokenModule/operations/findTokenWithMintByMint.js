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
exports.findTokenWithMintByMintOperationHandler = exports.findTokenWithMintByMintOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const errors_1 = require("../errors");
const Mint_1 = require("../models/Mint");
const pdas_1 = require("../pdas");
const Token_1 = require("../models/Token");
// -----------------
// Operation
// -----------------
const Key = 'FindTokenWithMintByMintOperation';
/**
 * Finds a token account and its associated mint account
 * by providing the mint address and either:
 * - the token address or
 * - the address of the token's owner.
 *
 * ```ts
 * const tokenWithMint = await metaplex
 *   .tokens()
 *   .findTokenWithMintByMint({ mint, address: tokenAddress, type: "token" })
 *   .run();
 *
 * const tokenWithMint = await metaplex
 *   .tokens()
 *   .findTokenWithMintByMint({ mint, address: ownerAddress, type: "owner" })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findTokenWithMintByMintOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findTokenWithMintByMintOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const { mint, address, addressType, commitment } = operation.input;
        const tokenAddress = addressType === 'owner'
            ? (0, pdas_1.findAssociatedTokenAccountPda)(mint, address)
            : address;
        const accounts = yield metaplex
            .rpc()
            .getMultipleAccounts([mint, tokenAddress], commitment);
        const mintAccount = (0, accounts_1.toMintAccount)(accounts[0]);
        const tokenAccount = (0, accounts_1.toTokenAccount)(accounts[1]);
        if (!tokenAccount.data.mint.equals(mint)) {
            throw new errors_1.TokenAndMintDoNotMatchError(tokenAddress, tokenAccount.data.mint, mint);
        }
        return (0, Token_1.toTokenWithMint)(tokenAccount, (0, Mint_1.toMint)(mintAccount));
    }),
};
//# sourceMappingURL=findTokenWithMintByMint.js.map
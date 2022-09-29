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
exports.findTokenWithMintByAddressOperationHandler = exports.findTokenWithMintByAddressOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const Mint_1 = require("../models/Mint");
const Token_1 = require("../models/Token");
// -----------------
// Operation
// -----------------
const Key = 'FindTokenWithMintByAddressOperation';
/**
 * Finds a token account and its associated mint account
 * by providing the token address.
 *
 * ```ts
 * const tokenWithMint = await metaplex.tokens().findTokenWithMintByAddress({ address }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findTokenWithMintByAddressOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findTokenWithMintByAddressOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const { address, commitment } = operation.input;
        const tokenAccount = (0, accounts_1.toTokenAccount)(yield metaplex.rpc().getAccount(address, commitment));
        const mintAccount = (0, accounts_1.toMintAccount)(yield metaplex.rpc().getAccount(tokenAccount.data.mint, commitment));
        return (0, Token_1.toTokenWithMint)(tokenAccount, (0, Mint_1.toMint)(mintAccount));
    }),
};
//# sourceMappingURL=findTokenWithMintByAddress.js.map
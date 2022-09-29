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
exports.findMintByAddressOperationHandler = exports.findMintByAddressOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const Mint_1 = require("../models/Mint");
// -----------------
// Operation
// -----------------
const Key = 'FindMintByAddressOperation';
/**
 * Finds a mint account by its address.
 *
 * ```ts
 * const mint = await metaplex.tokens().findMintByAddress({ address }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findMintByAddressOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findMintByAddressOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const { address, commitment } = operation.input;
        const account = (0, accounts_1.toMintAccount)(yield metaplex.rpc().getAccount(address, commitment));
        return (0, Mint_1.toMint)(account);
    }),
};
//# sourceMappingURL=findMintByAddress.js.map
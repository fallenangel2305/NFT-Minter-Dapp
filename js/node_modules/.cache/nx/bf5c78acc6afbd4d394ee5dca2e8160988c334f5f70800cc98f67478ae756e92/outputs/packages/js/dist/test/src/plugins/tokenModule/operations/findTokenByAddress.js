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
exports.findTokenByAddressOperationHandler = exports.findTokenByAddressOperation = void 0;
const types_1 = require("../../../types");
const accounts_1 = require("../accounts");
const Token_1 = require("../models/Token");
// -----------------
// Operation
// -----------------
const Key = 'FindTokenByAddressOperation';
/**
 * Finds a token account by its address.
 *
 * ```ts
 * const token = await metaplex.tokens().findTokenByAddress({ address }).run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findTokenByAddressOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findTokenByAddressOperationHandler = {
    handle: (operation, metaplex) => __awaiter(void 0, void 0, void 0, function* () {
        const { address, commitment } = operation.input;
        const account = (0, accounts_1.toTokenAccount)(yield metaplex.rpc().getAccount(address, commitment));
        return (0, Token_1.toToken)(account);
    }),
};
//# sourceMappingURL=findTokenByAddress.js.map
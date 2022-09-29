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
exports.findNftByTokenOperationHandler = exports.findNftByTokenOperation = void 0;
const types_1 = require("../../../types");
const tokenModule_1 = require("../../tokenModule");
// -----------------
// Operation
// -----------------
const Key = 'FindNftByTokenOperation';
/**
 * Finds an NFT or an SFT by its token address.
 *
 * ```ts
 * const nft = await metaplex
 *   .nfts()
 *   .findByToken({ token })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findNftByTokenOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findNftByTokenOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const token = (0, tokenModule_1.toTokenAccount)(yield metaplex.rpc().getAccount(operation.input.token));
        scope.throwIfCanceled();
        const asset = yield metaplex
            .nfts()
            .findByMint(Object.assign(Object.assign({}, operation.input), { mintAddress: token.data.mint, tokenAddress: operation.input.token }))
            .run(scope);
        return asset;
    }),
};
//# sourceMappingURL=findNftByToken.js.map
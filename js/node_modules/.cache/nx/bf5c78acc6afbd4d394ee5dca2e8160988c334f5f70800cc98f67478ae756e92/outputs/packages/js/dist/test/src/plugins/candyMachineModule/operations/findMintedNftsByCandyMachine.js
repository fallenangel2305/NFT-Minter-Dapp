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
exports.findMintedNftsByCandyMachineOperationHandler = exports.findMintedNftsByCandyMachineOperation = void 0;
const types_1 = require("../../../types");
const nftModule_1 = require("../../nftModule");
const pdas_1 = require("../pdas");
// -----------------
// Operation
// -----------------
const Key = 'FindMintedNftsByCandyMachineOperation';
/**
 * Find all minted NFTs from a given Candy Machine address.
 *
 * ```ts
 * const nfts = await metaplex
 *   .candyMachines()
 *   .findMintedNfts({ candyMachine })
 *   .run();
 * ```
 *
 * @group Operations
 * @category Constructors
 */
exports.findMintedNftsByCandyMachineOperation = (0, types_1.useOperation)(Key);
/**
 * @group Operations
 * @category Handlers
 */
exports.findMintedNftsByCandyMachineOperationHandler = {
    handle: (operation, metaplex, scope) => __awaiter(void 0, void 0, void 0, function* () {
        const { candyMachine, version = 2, commitment } = operation.input;
        const firstCreator = version === 2 ? (0, pdas_1.findCandyMachineCreatorPda)(candyMachine) : candyMachine;
        const mintedNfts = yield metaplex.operations().execute((0, nftModule_1.findNftsByCreatorOperation)({
            creator: firstCreator,
            position: 1,
            commitment,
        }), scope);
        return mintedNfts;
    }),
};
//# sourceMappingURL=findMintedNftsByCandyMachine.js.map
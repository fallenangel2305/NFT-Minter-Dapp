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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tape_1 = __importDefault(require("tape"));
const index_1 = require("../../../src/index");
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[rpcModule] it parses program errors when sending transactions', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using a CoreRpcDriver.
    const mx = yield (0, helpers_1.metaplex)();
    // When we try to create an NFT with a name that's too long.
    const promise = mx
        .nfts()
        .create({
        uri: 'http://example.com/nft',
        sellerFeeBasisPoints: 200,
        name: 'x'.repeat(100), // Name is too long.
    })
        .run();
    // Then we receive a parsed program error.
    try {
        yield promise;
        t.fail('Expected a ParsedProgramError');
    }
    catch (error) {
        t.ok(error instanceof index_1.ParsedProgramError);
        t.ok(error.message.includes('TokenMetadataProgram > Name too long'));
    }
}));
//# sourceMappingURL=RpcClient.test.js.map
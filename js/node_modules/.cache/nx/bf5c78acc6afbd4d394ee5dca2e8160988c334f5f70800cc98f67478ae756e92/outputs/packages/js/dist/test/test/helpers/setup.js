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
exports.createSft = exports.createCollectionNft = exports.createNft = exports.createWallet = exports.metaplex = exports.metaplexGuest = void 0;
const web3_js_1 = require("@solana/web3.js");
const amman_client_1 = require("@metaplex-foundation/amman-client");
const index_1 = require("../../src/index");
const amman_1 = require("./amman");
const metaplexGuest = (options = {}) => {
    var _a, _b;
    const connection = new web3_js_1.Connection((_a = options.rpcEndpoint) !== null && _a !== void 0 ? _a : amman_client_1.LOCALHOST, {
        commitment: (_b = options.commitment) !== null && _b !== void 0 ? _b : 'confirmed',
    });
    return index_1.Metaplex.make(connection).use((0, index_1.guestIdentity)()).use((0, index_1.mockStorage)());
};
exports.metaplexGuest = metaplexGuest;
const metaplex = (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const mx = (0, exports.metaplexGuest)(options);
    const wallet = yield (0, exports.createWallet)(mx, options.solsToAirdrop);
    return mx.use((0, index_1.keypairIdentity)(wallet));
});
exports.metaplex = metaplex;
const createWallet = (mx, solsToAirdrop = 100) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = web3_js_1.Keypair.generate();
    yield amman_1.amman.airdrop(mx.connection, wallet.publicKey, solsToAirdrop);
    return wallet;
});
exports.createWallet = createWallet;
const createNft = (mx, input = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { uri } = yield mx
        .nfts()
        .uploadMetadata((_a = input.json) !== null && _a !== void 0 ? _a : {})
        .run();
    const { nft } = yield mx
        .nfts()
        .create(Object.assign({ uri, name: 'My NFT', sellerFeeBasisPoints: 200 }, input))
        .run();
    return nft;
});
exports.createNft = createNft;
const createCollectionNft = (mx, input = {}) => (0, exports.createNft)(mx, Object.assign(Object.assign({}, input), { isCollection: true }));
exports.createCollectionNft = createCollectionNft;
const createSft = (mx, input = {}) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { uri } = yield mx
        .nfts()
        .uploadMetadata((_b = input.json) !== null && _b !== void 0 ? _b : {})
        .run();
    const { sft } = yield mx
        .nfts()
        .createSft(Object.assign({ uri, name: 'My SFT', sellerFeeBasisPoints: 200 }, input))
        .run();
    return sft;
});
exports.createSft = createSft;
//# sourceMappingURL=setup.js.map
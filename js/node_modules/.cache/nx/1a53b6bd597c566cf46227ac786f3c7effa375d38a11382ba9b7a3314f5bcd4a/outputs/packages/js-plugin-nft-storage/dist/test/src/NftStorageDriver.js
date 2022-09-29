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
exports.NftStorageDriver = void 0;
const nft_storage_1 = require("nft.storage");
const memory_1 = require("ipfs-car/blockstore/memory");
const metaplex_auth_1 = require("@nftstorage/metaplex-auth");
const js_1 = require("@metaplex-foundation/js");
const utils_1 = require("./utils");
class NftStorageDriver {
    constructor(metaplex, options = {}) {
        var _a, _b;
        this.metaplex = metaplex;
        this.identity = options.identity;
        this.token = options.token;
        this.endpoint = options.endpoint;
        this.gatewayHost = options.gatewayHost;
        this.batchSize = (_a = options.batchSize) !== null && _a !== void 0 ? _a : 50;
        this.useGatewayUrls = (_b = options.useGatewayUrls) !== null && _b !== void 0 ? _b : true;
    }
    onProgress(callback) {
        this.onStoredChunk = callback;
        return this;
    }
    getUploadPrice(_bytes) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, js_1.lamports)(0);
        });
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.uploadAll([file]))[0];
        });
    }
    uploadAll(files) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.batchSize <= 0) {
                throw new Error('batchSize must be greater than 0');
            }
            const client = yield this.client();
            const blockstore = new memory_1.MemoryBlockStore();
            const uris = [];
            const numBatches = Math.ceil(files.length / this.batchSize);
            const batches = new Array(numBatches)
                .fill([])
                .map((_, i) => files.slice(i * this.batchSize, (i + 1) * this.batchSize));
            for (let i = 0; i < batches.length; i++) {
                const batch = batches[i];
                const batchLinks = [];
                for (let j = 0; j < batch.length; j++) {
                    const file = batch[j];
                    const blob = new nft_storage_1.Blob([file.buffer]);
                    const node = yield nft_storage_1.NFTStorage.encodeBlob(blob, { blockstore });
                    const fileUri = this.useGatewayUrls
                        ? (0, utils_1.toGatewayUri)(node.cid.toString(), undefined, this.gatewayHost)
                        : (0, utils_1.toIpfsUri)(node.cid.toString());
                    uris.push(fileUri);
                    batchLinks.push(yield (0, utils_1.toDagPbLink)(node, file.uniqueName));
                }
                const batchBlock = yield (0, utils_1.toDirectoryBlock)(batchLinks);
                const { cid, car } = yield (0, utils_1.toEncodedCar)(batchBlock, blockstore);
                const options = { onStoredChunk: this.onStoredChunk };
                const promise = isNFTStorageMetaplexor(client)
                    ? client.storeCar(cid, car, options)
                    : client.storeCar(car, options);
                yield promise;
            }
            return uris;
        });
    }
    client() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.token) {
                return new nft_storage_1.NFTStorage({
                    token: this.token,
                    endpoint: this.endpoint,
                });
            }
            const signer = (_a = this.identity) !== null && _a !== void 0 ? _a : this.metaplex.identity();
            const authOptions = {
                mintingAgent: '@metaplex-foundation/js-plugin-nft-storage',
                solanaCluster: this.metaplex.cluster,
                endpoint: this.endpoint,
            };
            return (0, js_1.isKeypairSigner)(signer)
                ? metaplex_auth_1.NFTStorageMetaplexor.withSecretKey(signer.secretKey, authOptions)
                : metaplex_auth_1.NFTStorageMetaplexor.withSigner(signer.signMessage.bind(signer), signer.publicKey.toBuffer(), authOptions);
        });
    }
}
exports.NftStorageDriver = NftStorageDriver;
const isNFTStorageMetaplexor = (client) => {
    return 'storeNFTFromFilesystem' in client;
};
//# sourceMappingURL=NftStorageDriver.js.map
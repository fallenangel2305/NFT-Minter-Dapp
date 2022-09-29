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
const js_1 = require("@metaplex-foundation/js");
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("./helpers");
const src_1 = require("../src");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftStorage] it can upload one file', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using NFT.Storage.
    const mx = yield (0, helpers_1.metaplex)();
    mx.use((0, src_1.nftStorage)());
    // When we upload some asset.
    const uri = yield mx
        .storage()
        .upload((0, js_1.toMetaplexFile)('some-image', 'some-image.jpg'));
    // Then the URI should be a valid IPFS URI.
    t.ok(uri, 'should return a URI');
    t.ok(uri.startsWith('https://nftstorage.link/ipfs/'), 'should use Gateway URI by default');
    // and it should point to the uploaded asset.
    const asset = yield mx.storage().download(uri);
    t.equals(asset.buffer.toString(), 'some-image', 'should return the uploaded asset');
}));
(0, tape_1.default)('[nftStorage] it can upload one file without a Gateway URL', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using NFT.Storage without Gateway URLs.
    const mx = yield (0, helpers_1.metaplex)();
    mx.use((0, src_1.nftStorage)({ useGatewayUrls: false }));
    // When we upload some asset.
    const uri = yield mx
        .storage()
        .upload((0, js_1.toMetaplexFile)('some-image', 'some-image.jpg'));
    // Then the URI should be a valid IPFS URI but not a Gateway URL.
    t.ok(uri, 'should return a URI');
    t.ok(uri.startsWith('ipfs://'), 'should use Gateway URI by default');
}));
(0, tape_1.default)('[nftStorage] it can upload multiple files in batch', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using NFT.Storage with a batch size of 1.
    const mx = yield (0, helpers_1.metaplex)();
    mx.use((0, src_1.nftStorage)({ batchSize: 1 }));
    // When we upload two assets.
    const uris = yield mx
        .storage()
        .uploadAll([
        (0, js_1.toMetaplexFile)('some-image-A', 'some-image-A.jpg'),
        (0, js_1.toMetaplexFile)('some-image-B', 'some-image-B.jpg'),
    ]);
    // Then the URIs should point to the uploaded assets in the right order.
    t.equals(uris.length, 2, 'should return a list of 2 URIs');
    const assetA = yield mx.storage().download(uris[0]);
    t.equals(assetA.buffer.toString(), 'some-image-A', 'should return the first asset');
    const assetB = yield mx.storage().download(uris[1]);
    t.equals(assetB.buffer.toString(), 'some-image-B', 'should return the second asset');
}));
(0, tape_1.default)('[nftStorage] it can keep track of upload progress', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given a Metaplex instance using NFT.Storage.
    const mx = yield (0, helpers_1.metaplex)();
    mx.use((0, src_1.nftStorage)());
    // And a progress callback that counts the stored chunks.
    let chunkCounter = 0;
    const driver = mx.storage().driver();
    driver.onProgress((_size) => chunkCounter++);
    // When we upload some asset with a size of 3 chunks.
    const MAX_CHUNK_SIZE = 10000000;
    yield mx
        .storage()
        .upload((0, js_1.toMetaplexFile)('x'.repeat(MAX_CHUNK_SIZE * 3), 'some-image.jpg'));
    // Then the progress callback should be called 3 times.
    t.equals(chunkCounter, 3, 'should emit 3 progress events');
}));
//# sourceMappingURL=NftStorageDriver.test.js.map
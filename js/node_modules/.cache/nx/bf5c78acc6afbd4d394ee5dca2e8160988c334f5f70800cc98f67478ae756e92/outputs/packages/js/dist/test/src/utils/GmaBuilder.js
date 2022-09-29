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
exports.GmaBuilder = void 0;
const common_1 = require("./common");
class GmaBuilder {
    constructor(metaplex, publicKeys, options = {}) {
        var _a;
        this.metaplex = metaplex;
        this.chunkSize = (_a = options.chunkSize) !== null && _a !== void 0 ? _a : 100;
        this.commitment = options.commitment;
        this.publicKeys = publicKeys;
    }
    static make(metaplex, publicKeys, options = {}) {
        return new GmaBuilder(metaplex, publicKeys, options);
    }
    chunkBy(n) {
        this.chunkSize = n;
        return this;
    }
    addPublicKeys(publicKeys) {
        this.publicKeys.push(...publicKeys);
        return this;
    }
    getPublicKeys() {
        return this.publicKeys;
    }
    getUniquePublicKeys() {
        // TODO: Only send unique keys and reconciliate after call.
        return this.getPublicKeys();
    }
    getFirst(n) {
        return __awaiter(this, void 0, void 0, function* () {
            const end = this.boundNumber(n !== null && n !== void 0 ? n : 1);
            return this.getChunks(this.getPublicKeys().slice(0, end));
        });
    }
    getLast(n) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = this.boundNumber(n !== null && n !== void 0 ? n : 1);
            return this.getChunks(this.getPublicKeys().slice(-start));
        });
    }
    getBetween(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            start = this.boundNumber(start);
            end = this.boundNumber(end);
            [start, end] = start > end ? [end, start] : [start, end];
            return this.getChunks(this.getPublicKeys().slice(start, end));
        });
    }
    getPage(page, perPage) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getBetween((page - 1) * perPage, page * perPage);
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getChunks(this.getPublicKeys());
        });
    }
    getAndMap(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.get()).map(callback);
        });
    }
    getChunks(publicKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const chunks = (0, common_1.chunk)(publicKeys, this.chunkSize);
            const chunkPromises = chunks.map((chunk) => this.getChunk(chunk));
            const resolvedChunks = yield Promise.all(chunkPromises);
            return resolvedChunks.flat();
        });
    }
    getChunk(publicKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // TODO(loris): Use lower level RPC call to add dataSlice support.
                return yield this.metaplex
                    .rpc()
                    .getMultipleAccounts(publicKeys, this.commitment);
            }
            catch (error) {
                // TODO(loris): Custom error instead.
                throw error;
            }
        });
    }
    boundNumber(n) {
        return this.boundIndex(n - 1) + 1;
    }
    boundIndex(index) {
        index = index < 0 ? 0 : index;
        index =
            index >= this.publicKeys.length ? this.publicKeys.length - 1 : index;
        return index;
    }
}
exports.GmaBuilder = GmaBuilder;
//# sourceMappingURL=GmaBuilder.js.map
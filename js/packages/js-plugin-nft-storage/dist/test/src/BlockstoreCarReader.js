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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockstoreCarReader = void 0;
/**
 * An implementation of the CAR reader interface that is backed by a blockstore.
 * @see https://github.com/nftstorage/nft.storage/blob/0fc7e4e73867c437eac54f75f58a808dd4581c47/packages/client/src/bs-car-reader.js
 */
class BlockstoreCarReader {
    constructor(roots, blockstore, version = 1) {
        this._version = version;
        this._roots = roots;
        this._blockstore = blockstore;
    }
    get version() {
        return this._version;
    }
    get blockstore() {
        return this._blockstore;
    }
    getRoots() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._roots;
        });
    }
    has(cid) {
        return this._blockstore.has(cid);
    }
    get(cid) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytes = yield this._blockstore.get(cid);
            return { cid, bytes };
        });
    }
    blocks() {
        return this._blockstore.blocks();
    }
    cids() {
        return __asyncGenerator(this, arguments, function* cids_1() {
            var e_1, _a;
            try {
                for (var _b = __asyncValues(this.blocks()), _c; _c = yield __await(_b.next()), !_c.done;) {
                    const b = _c.value;
                    yield yield __await(b.cid);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield __await(_a.call(_b));
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
}
exports.BlockstoreCarReader = BlockstoreCarReader;
//# sourceMappingURL=BlockstoreCarReader.js.map
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
exports.GpaBuilder = void 0;
const web3_js_1 = require("@solana/web3.js");
const buffer_1 = require("buffer");
const bs58_1 = __importDefault(require("bs58"));
const bn_js_1 = __importDefault(require("bn.js"));
const GmaBuilder_1 = require("./GmaBuilder");
class GpaBuilder {
    constructor(metaplex, programId) {
        /** The configs to use when fetching program accounts. */
        this.config = {};
        this.metaplex = metaplex;
        this.programId = programId;
    }
    mergeConfig(config) {
        this.config = Object.assign(Object.assign({}, this.config), config);
        return this;
    }
    slice(offset, length) {
        this.config.dataSlice = { offset, length };
        return this;
    }
    withoutData() {
        return this.slice(0, 0);
    }
    addFilter(...filters) {
        if (!this.config.filters) {
            this.config.filters = [];
        }
        this.config.filters.push(...filters);
        return this;
    }
    where(offset, bytes) {
        if (buffer_1.Buffer.isBuffer(bytes)) {
            bytes = bs58_1.default.encode(bytes);
        }
        else if (typeof bytes === 'object' && 'toBase58' in bytes) {
            bytes = bytes.toBase58();
        }
        else if (bn_js_1.default.isBN(bytes)) {
            bytes = bs58_1.default.encode(bytes.toArray());
        }
        else if (typeof bytes !== 'string') {
            bytes = bs58_1.default.encode(new bn_js_1.default(bytes, 'le').toArray());
        }
        return this.addFilter({ memcmp: { offset, bytes } });
    }
    whereSize(dataSize) {
        return this.addFilter({ dataSize });
    }
    sortUsing(callback) {
        this.sortCallback = callback;
        return this;
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.metaplex
                .rpc()
                .getProgramAccounts(this.programId, this.config);
            if (this.sortCallback) {
                accounts.sort(this.sortCallback);
            }
            return accounts;
        });
    }
    getAndMap(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.get()).map(callback);
        });
    }
    getPublicKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getAndMap((account) => account.publicKey);
        });
    }
    getDataAsPublicKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getAndMap((account) => new web3_js_1.PublicKey(account.data));
        });
    }
    getMultipleAccounts(callback, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const cb = callback !== null && callback !== void 0 ? callback : ((account) => new web3_js_1.PublicKey(account.data));
            return new GmaBuilder_1.GmaBuilder(this.metaplex, yield this.getAndMap(cb), options);
        });
    }
}
exports.GpaBuilder = GpaBuilder;
//# sourceMappingURL=GpaBuilder.js.map
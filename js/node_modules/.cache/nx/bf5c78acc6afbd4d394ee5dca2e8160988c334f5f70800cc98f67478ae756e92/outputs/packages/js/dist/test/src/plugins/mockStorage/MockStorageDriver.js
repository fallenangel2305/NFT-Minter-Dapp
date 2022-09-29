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
exports.MockStorageDriver = void 0;
const types_1 = require("../../types");
const errors_1 = require("../../errors");
const DEFAULT_BASE_URL = 'https://mockstorage.example.com/';
const DEFAULT_COST_PER_BYTE = 1;
class MockStorageDriver {
    constructor(options) {
        var _a;
        this.cache = {};
        this.baseUrl = (_a = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _a !== void 0 ? _a : DEFAULT_BASE_URL;
        this.costPerByte = (0, types_1.toBigNumber)((options === null || options === void 0 ? void 0 : options.costPerByte) != null
            ? options === null || options === void 0 ? void 0 : options.costPerByte
            : DEFAULT_COST_PER_BYTE);
    }
    getUploadPrice(bytes) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, types_1.lamports)(this.costPerByte.muln(bytes));
        });
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = `${this.baseUrl}${file.uniqueName}`;
            this.cache[uri] = file;
            return uri;
        });
    }
    download(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = this.cache[uri];
            if (!file) {
                throw new errors_1.AssetNotFoundError(uri);
            }
            return file;
        });
    }
}
exports.MockStorageDriver = MockStorageDriver;
//# sourceMappingURL=MockStorageDriver.js.map
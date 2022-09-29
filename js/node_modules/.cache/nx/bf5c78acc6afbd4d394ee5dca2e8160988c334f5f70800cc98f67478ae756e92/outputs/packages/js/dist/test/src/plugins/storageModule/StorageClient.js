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
exports.StorageClient = void 0;
const errors_1 = require("../../errors");
const MetaplexFile_1 = require("./MetaplexFile");
/**
 * @group Modules
 */
class StorageClient {
    constructor() {
        this._driver = null;
    }
    driver() {
        if (!this._driver) {
            throw new errors_1.DriverNotProvidedError('StorageDriver');
        }
        return this._driver;
    }
    setDriver(newDriver) {
        this._driver = newDriver;
    }
    getUploadPriceForBytes(bytes) {
        return this.driver().getUploadPrice(bytes);
    }
    getUploadPriceForFile(file) {
        return this.getUploadPriceForFiles([file]);
    }
    getUploadPriceForFiles(files) {
        return this.getUploadPriceForBytes((0, MetaplexFile_1.getBytesFromMetaplexFiles)(...files));
    }
    upload(file) {
        return this.driver().upload(file);
    }
    uploadAll(files) {
        const driver = this.driver();
        return driver.uploadAll
            ? driver.uploadAll(files)
            : Promise.all(files.map((file) => this.driver().upload(file)));
    }
    uploadJson(json) {
        return this.upload((0, MetaplexFile_1.toMetaplexFileFromJson)(json));
    }
    download(uri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const driver = this.driver();
            if (driver.download) {
                return driver.download(uri, options);
            }
            const response = yield fetch(uri, options);
            const buffer = yield response.arrayBuffer();
            return (0, MetaplexFile_1.toMetaplexFile)(buffer, uri);
        });
    }
    downloadJson(uri, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield this.download(uri, options);
            try {
                return JSON.parse(file.buffer.toString());
            }
            catch (error) {
                throw new errors_1.InvalidJsonStringError({ cause: error });
            }
        });
    }
}
exports.StorageClient = StorageClient;
//# sourceMappingURL=StorageClient.js.map
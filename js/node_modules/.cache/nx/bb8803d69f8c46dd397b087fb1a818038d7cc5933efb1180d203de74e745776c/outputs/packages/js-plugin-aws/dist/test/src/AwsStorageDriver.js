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
exports.AwsStorageDriver = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const js_1 = require("@metaplex-foundation/js");
class AwsStorageDriver {
    constructor(client, bucketName) {
        this.client = client;
        this.bucketName = bucketName;
    }
    getUploadPrice(_bytes) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, js_1.lamports)(0);
        });
    }
    upload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: this.bucketName,
                Key: file.uniqueName,
                Body: file.buffer,
                ContentType: file.contentType || undefined,
            });
            try {
                yield this.client.send(command);
                return yield this.getUrl(file.uniqueName);
            }
            catch (err) {
                // TODO: Custom errors.
                throw err;
            }
        });
    }
    getUrl(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const region = yield this.client.config.region();
            const encodedKey = encodeURIComponent(key);
            return `https://s3.${region}.amazonaws.com/${this.bucketName}/${encodedKey}`;
        });
    }
}
exports.AwsStorageDriver = AwsStorageDriver;
//# sourceMappingURL=AwsStorageDriver.js.map
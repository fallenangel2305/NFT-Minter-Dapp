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
const client_s3_1 = require("@aws-sdk/client-s3");
const js_1 = require("@metaplex-foundation/js");
const tape_1 = __importDefault(require("tape"));
const sinon_1 = __importDefault(require("sinon"));
const helpers_1 = require("./helpers");
const src_1 = require("../src");
(0, helpers_1.killStuckProcess)();
const awsClient = {
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    },
    config: {
        region() {
            return __awaiter(this, void 0, void 0, function* () {
                return 'us-east';
            });
        },
    },
};
(0, tape_1.default)('it can upload assets to a S3 bucket', (t) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Given a mock awsClient.
    const stub = sinon_1.default.spy(awsClient);
    // Fed to a Metaplex instance.
    const mx = yield (0, helpers_1.metaplex)();
    mx.use((0, src_1.awsStorage)(awsClient, 'some-bucket'));
    // When we upload some content to AWS S3.
    const file = (0, js_1.toMetaplexFile)('some-image', 'some-image.jpg', {
        uniqueName: 'some-key',
    });
    const uri = yield mx.storage().upload(file);
    // Then we get the URL of the uploaded asset.
    t.equals(uri, 'https://s3.us-east.amazonaws.com/some-bucket/some-key');
    t.assert(stub.send.calledOnce);
    const command = stub.send.getCall(0).args[0];
    t.assert(command instanceof client_s3_1.PutObjectCommand);
    t.equals('some-bucket', command.input.Bucket);
    t.equals('some-key', command.input.Key);
    t.equals('some-image', (_a = command.input.Body) === null || _a === void 0 ? void 0 : _a.toString());
}));
//# sourceMappingURL=AwsStorageDriver.test.js.map
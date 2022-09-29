"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsStorage = void 0;
const AwsStorageDriver_1 = require("./AwsStorageDriver");
const awsStorage = (client, bucketName) => ({
    install(metaplex) {
        metaplex.storage().setDriver(new AwsStorageDriver_1.AwsStorageDriver(client, bucketName));
    },
});
exports.awsStorage = awsStorage;
//# sourceMappingURL=plugin.js.map
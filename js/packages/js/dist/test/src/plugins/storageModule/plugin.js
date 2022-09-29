"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageModule = void 0;
const StorageClient_1 = require("./StorageClient");
/** @group Plugins */
const storageModule = () => ({
    install(metaplex) {
        const storageClient = new StorageClient_1.StorageClient();
        metaplex.storage = () => storageClient;
    },
});
exports.storageModule = storageModule;
//# sourceMappingURL=plugin.js.map
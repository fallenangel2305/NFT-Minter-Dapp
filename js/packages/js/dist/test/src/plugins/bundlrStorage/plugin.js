"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundlrStorage = void 0;
const BundlrStorageDriver_1 = require("./BundlrStorageDriver");
const bundlrStorage = (options = {}) => ({
    install(metaplex) {
        metaplex.storage().setDriver(new BundlrStorageDriver_1.BundlrStorageDriver(metaplex, options));
    },
});
exports.bundlrStorage = bundlrStorage;
//# sourceMappingURL=plugin.js.map
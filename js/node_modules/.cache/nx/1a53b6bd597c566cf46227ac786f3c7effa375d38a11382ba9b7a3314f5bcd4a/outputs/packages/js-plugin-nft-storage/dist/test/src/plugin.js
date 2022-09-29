"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftStorage = void 0;
const NftStorageDriver_1 = require("./NftStorageDriver");
const nftStorage = (options = {}) => ({
    install(metaplex) {
        metaplex.storage().setDriver(new NftStorageDriver_1.NftStorageDriver(metaplex, options));
    },
});
exports.nftStorage = nftStorage;
//# sourceMappingURL=plugin.js.map
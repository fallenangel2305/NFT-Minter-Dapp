"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockStorage = void 0;
const MockStorageDriver_1 = require("./MockStorageDriver");
const mockStorage = (options) => ({
    install(metaplex) {
        metaplex.storage().setDriver(new MockStorageDriver_1.MockStorageDriver(options));
    },
});
exports.mockStorage = mockStorage;
//# sourceMappingURL=plugin.js.map
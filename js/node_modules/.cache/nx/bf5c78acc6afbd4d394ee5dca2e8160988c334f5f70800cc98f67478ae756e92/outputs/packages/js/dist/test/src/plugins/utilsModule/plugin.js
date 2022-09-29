"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilsModule = void 0;
const UtilsClient_1 = require("./UtilsClient");
/** @group Plugins */
const utilsModule = () => ({
    install(metaplex) {
        const utilsClient = new UtilsClient_1.UtilsClient(metaplex);
        metaplex.utils = () => utilsClient;
    },
});
exports.utilsModule = utilsModule;
//# sourceMappingURL=plugin.js.map
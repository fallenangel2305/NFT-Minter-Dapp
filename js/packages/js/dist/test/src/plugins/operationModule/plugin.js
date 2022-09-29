"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.operationModule = void 0;
const OperationClient_1 = require("./OperationClient");
/** @group Plugins */
const operationModule = () => ({
    install(metaplex) {
        const operationClient = new OperationClient_1.OperationClient(metaplex);
        metaplex.operations = () => operationClient;
    },
});
exports.operationModule = operationModule;
//# sourceMappingURL=plugin.js.map
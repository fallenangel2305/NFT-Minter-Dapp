"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rpcModule = void 0;
const RpcClient_1 = require("./RpcClient");
/** @group Plugins */
const rpcModule = () => ({
    install(metaplex) {
        const rpcClient = new RpcClient_1.RpcClient(metaplex);
        metaplex.rpc = () => rpcClient;
    },
});
exports.rpcModule = rpcModule;
//# sourceMappingURL=plugin.js.map
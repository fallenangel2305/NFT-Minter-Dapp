"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemModule = void 0;
const web3_js_1 = require("@solana/web3.js");
const operations_1 = require("./operations");
const SystemClient_1 = require("./SystemClient");
/**
 * @group Plugins
 */
/** @group Plugins */
const systemModule = () => ({
    install(metaplex) {
        // Program.
        metaplex.programs().register({
            name: 'SystemProgram',
            address: web3_js_1.SystemProgram.programId,
        });
        // Operations.
        const op = metaplex.operations();
        op.register(operations_1.createAccountOperation, operations_1.createAccountOperationHandler);
        op.register(operations_1.transferSolOperation, operations_1.transferSolOperationHandler);
        metaplex.system = function () {
            return new SystemClient_1.SystemClient(this);
        };
    },
});
exports.systemModule = systemModule;
//# sourceMappingURL=plugin.js.map
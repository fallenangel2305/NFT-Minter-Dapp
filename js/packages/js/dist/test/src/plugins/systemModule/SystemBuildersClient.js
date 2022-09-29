"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemBuildersClient = void 0;
const operations_1 = require("./operations");
/**
 * This client allows you to access the underlying Transaction Builders
 * for the write operations of the System module.
 *
 * @see {@link SystemClient}
 * @group Module Builders
 * */
class SystemBuildersClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    /** {@inheritDoc createAccountBuilder} */
    createAccount(input) {
        return (0, operations_1.createAccountBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc transferSolBuilder} */
    transferSol(input) {
        return (0, operations_1.transferSolBuilder)(this.metaplex, input);
    }
}
exports.SystemBuildersClient = SystemBuildersClient;
//# sourceMappingURL=SystemBuildersClient.js.map
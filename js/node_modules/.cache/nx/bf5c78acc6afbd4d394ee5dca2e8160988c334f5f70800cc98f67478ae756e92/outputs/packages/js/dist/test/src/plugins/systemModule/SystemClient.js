"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemClient = void 0;
const operations_1 = require("./operations");
const SystemBuildersClient_1 = require("./SystemBuildersClient");
/**
 * This is a client for the System module.
 *
 * It enables us to interact with the System program in order to
 * create uninitialized accounts and transfer SOL.
 *
 * You may access this client via the `system()` method of your `Metaplex` instance.
 *
 * ```ts
 * const systemClient = metaplex.system();
 * ```
 *
 * @example
 * You can create a new uninitialized account with a given space in bytes
 * using the code below.
 *
 * ```ts
 * const { newAccount } = await metaplex.system().createAccount({ space: 42 }).run();
 * ```
 *
 * @group Modules
 */
class SystemClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    /**
     * You may use the `builders()` client to access the
     * underlying Transaction Builders of this module.
     *
     * ```ts
     * const buildersClient = metaplex.system().builders();
     * ```
     */
    builders() {
        return new SystemBuildersClient_1.SystemBuildersClient(this.metaplex);
    }
    /** {@inheritDoc createAccountOperation} */
    createAccount(input) {
        return this.metaplex.operations().getTask((0, operations_1.createAccountOperation)(input));
    }
    /** {@inheritDoc transferSolOperation} */
    transferSol(input) {
        return this.metaplex.operations().getTask((0, operations_1.transferSolOperation)(input));
    }
}
exports.SystemClient = SystemClient;
//# sourceMappingURL=SystemClient.js.map
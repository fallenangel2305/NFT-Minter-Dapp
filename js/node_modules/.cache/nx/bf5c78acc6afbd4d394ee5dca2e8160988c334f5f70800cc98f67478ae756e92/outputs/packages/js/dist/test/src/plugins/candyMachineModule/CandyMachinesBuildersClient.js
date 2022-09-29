"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachinesBuildersClient = void 0;
const operations_1 = require("./operations");
/**
 * This client allows you to access the underlying Transaction Builders
 * for the write operations of the Candy Machine module.
 *
 * @see {@link CandyMachinesClient}
 * @group Module Builders
 */
class CandyMachinesBuildersClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    /** {@inheritDoc createCandyMachineBuilder} */
    create(input) {
        return (0, operations_1.createCandyMachineBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc deleteCandyMachineBuilder} */
    delete(input) {
        return (0, operations_1.deleteCandyMachineBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc insertItemsToCandyMachineBuilder} */
    insertItems(input) {
        return (0, operations_1.insertItemsToCandyMachineBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc mintCandyMachineBuilder} */
    mint(input) {
        return (0, operations_1.mintCandyMachineBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc updateCandyMachineBuilder} */
    update(input) {
        return (0, operations_1.updateCandyMachineBuilder)(this.metaplex, input);
    }
}
exports.CandyMachinesBuildersClient = CandyMachinesBuildersClient;
//# sourceMappingURL=CandyMachinesBuildersClient.js.map
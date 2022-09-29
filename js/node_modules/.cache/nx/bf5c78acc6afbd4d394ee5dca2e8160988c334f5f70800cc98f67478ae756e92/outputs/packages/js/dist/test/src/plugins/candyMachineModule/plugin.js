"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.candyMachineModule = void 0;
const CandyMachinesClient_1 = require("./CandyMachinesClient");
const operations_1 = require("./operations");
/** @group Plugins */
const candyMachineModule = () => ({
    install(metaplex) {
        const op = metaplex.operations();
        op.register(operations_1.createCandyMachineOperation, operations_1.createCandyMachineOperationHandler);
        op.register(operations_1.deleteCandyMachineOperation, operations_1.deleteCandyMachineOperationHandler);
        op.register(operations_1.findCandyMachineByAddressOperation, operations_1.findCandyMachineByAddressOperationHandler);
        op.register(operations_1.findCandyMachinesByPublicKeyFieldOperation, operations_1.findCandyMachinesByPublicKeyFieldOperationHandler);
        op.register(operations_1.findMintedNftsByCandyMachineOperation, operations_1.findMintedNftsByCandyMachineOperationHandler);
        op.register(operations_1.insertItemsToCandyMachineOperation, operations_1.InsertItemsToCandyMachineOperationHandler);
        op.register(operations_1.mintCandyMachineOperation, operations_1.mintCandyMachineOperationHandler);
        op.register(operations_1.updateCandyMachineOperation, operations_1.updateCandyMachineOperationHandler);
        metaplex.candyMachines = function () {
            return new CandyMachinesClient_1.CandyMachinesClient(this);
        };
    },
});
exports.candyMachineModule = candyMachineModule;
//# sourceMappingURL=plugin.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCandyMachineCollectionPda = exports.findCandyMachineCreatorPda = void 0;
const buffer_1 = require("buffer");
const types_1 = require("../../types");
const program_1 = require("./program");
/** @group Pdas */
const findCandyMachineCreatorPda = (candyMachine, programId = program_1.CandyMachineProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('candy_machine', 'utf8'),
        candyMachine.toBuffer(),
    ]);
};
exports.findCandyMachineCreatorPda = findCandyMachineCreatorPda;
/** @group Pdas */
const findCandyMachineCollectionPda = (candyMachine, programId = program_1.CandyMachineProgram.publicKey) => {
    return types_1.Pda.find(programId, [
        buffer_1.Buffer.from('collection', 'utf8'),
        candyMachine.toBuffer(),
    ]);
};
exports.findCandyMachineCollectionPda = findCandyMachineCollectionPda;
//# sourceMappingURL=pdas.js.map
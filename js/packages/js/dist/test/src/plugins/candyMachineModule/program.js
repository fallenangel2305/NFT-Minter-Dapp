"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachineProgram = void 0;
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const gpaBuilders_1 = require("./gpaBuilders");
/** @group Programs */
exports.CandyMachineProgram = {
    publicKey: mpl_candy_machine_1.PROGRAM_ID,
    accounts(metaplex) {
        return new gpaBuilders_1.CandyMachineGpaBuilder(metaplex, this.publicKey);
    },
};
//# sourceMappingURL=program.js.map
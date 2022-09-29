"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCandyMachineCollectionAccount = exports.parseCandyMachineCollectionAccount = exports.toCandyMachineAccount = exports.parseCandyMachineAccount = void 0;
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const types_1 = require("../../types");
/** @group Account Helpers */
exports.parseCandyMachineAccount = (0, types_1.getAccountParsingFunction)(mpl_candy_machine_1.CandyMachine);
/** @group Account Helpers */
exports.toCandyMachineAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_candy_machine_1.CandyMachine);
/** @group Account Helpers */
exports.parseCandyMachineCollectionAccount = (0, types_1.getAccountParsingFunction)(mpl_candy_machine_1.CollectionPDA);
/** @group Account Helpers */
exports.toCandyMachineCollectionAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_candy_machine_1.CollectionPDA);
//# sourceMappingURL=accounts.js.map
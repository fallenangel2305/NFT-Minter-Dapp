"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programModule = void 0;
const ProgramClient_1 = require("./ProgramClient");
/** @group Plugins */
const programModule = () => ({
    install(metaplex) {
        const programClient = new ProgramClient_1.ProgramClient(metaplex);
        metaplex.programs = () => programClient;
    },
});
exports.programModule = programModule;
//# sourceMappingURL=plugin.js.map
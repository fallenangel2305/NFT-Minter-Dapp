"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramClient = void 0;
const errors_1 = require("../../errors");
/**
 * @group Modules
 */
class ProgramClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
        this.programs = [];
    }
    register(program) {
        this.programs.push(program);
    }
    all() {
        return this.programs;
    }
    allForCluster(cluster) {
        return this.programs.filter((program) => {
            var _a, _b;
            return (_b = (_a = program.clusterFilter) === null || _a === void 0 ? void 0 : _a.call(program, cluster)) !== null && _b !== void 0 ? _b : true;
        });
    }
    allForCurrentCluster() {
        return this.allForCluster(this.metaplex.cluster);
    }
    get(nameOrAddress) {
        const programs = this.allForCurrentCluster();
        const program = typeof nameOrAddress === 'string'
            ? programs.find((program) => program.name === nameOrAddress)
            : programs.find((program) => program.address.equals(nameOrAddress));
        if (!program) {
            throw new errors_1.ProgramNotRecognizedError(nameOrAddress, this.metaplex.cluster);
        }
        return program;
    }
    getGpaBuilder(nameOrAddress) {
        const program = this.get(nameOrAddress);
        if (!program.gpaResolver) {
            throw new errors_1.MissingGpaBuilderError(program);
        }
        return program.gpaResolver(this.metaplex);
    }
}
exports.ProgramClient = ProgramClient;
//# sourceMappingURL=ProgramClient.js.map
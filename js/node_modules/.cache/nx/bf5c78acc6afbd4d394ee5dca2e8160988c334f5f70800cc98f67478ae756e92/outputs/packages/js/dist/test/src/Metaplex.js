"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metaplex = void 0;
const types_1 = require("./types");
const corePlugins_1 = require("./plugins/corePlugins");
class Metaplex {
    constructor(connection, options = {}) {
        var _a;
        this.connection = connection;
        this.cluster = (_a = options.cluster) !== null && _a !== void 0 ? _a : (0, types_1.resolveClusterFromConnection)(connection);
        this.use((0, corePlugins_1.corePlugins)());
    }
    static make(connection, options = {}) {
        return new this(connection, options);
    }
    use(plugin) {
        plugin.install(this);
        return this;
    }
}
exports.Metaplex = Metaplex;
//# sourceMappingURL=Metaplex.js.map
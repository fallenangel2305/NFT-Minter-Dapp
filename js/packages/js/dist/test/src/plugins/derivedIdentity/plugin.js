"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.derivedIdentity = void 0;
const DerivedIdentityClient_1 = require("./DerivedIdentityClient");
/** @group Plugins */
const derivedIdentity = () => ({
    install(metaplex) {
        const derivedIdentityClient = new DerivedIdentityClient_1.DerivedIdentityClient(metaplex);
        metaplex.derivedIdentity = () => derivedIdentityClient;
    },
});
exports.derivedIdentity = derivedIdentity;
//# sourceMappingURL=plugin.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identityModule = void 0;
const IdentityClient_1 = require("./IdentityClient");
/** @group Plugins */
const identityModule = () => ({
    install(metaplex) {
        const identityClient = new IdentityClient_1.IdentityClient();
        metaplex.identity = () => identityClient;
    },
});
exports.identityModule = identityModule;
//# sourceMappingURL=plugin.js.map
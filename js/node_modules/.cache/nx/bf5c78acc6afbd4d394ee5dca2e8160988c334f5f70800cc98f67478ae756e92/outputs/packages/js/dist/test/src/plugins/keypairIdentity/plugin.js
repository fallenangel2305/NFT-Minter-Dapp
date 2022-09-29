"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keypairIdentity = void 0;
const KeypairIdentityDriver_1 = require("./KeypairIdentityDriver");
const keypairIdentity = (keypair) => ({
    install(metaplex) {
        metaplex.identity().setDriver(new KeypairIdentityDriver_1.KeypairIdentityDriver(keypair));
    },
});
exports.keypairIdentity = keypairIdentity;
//# sourceMappingURL=plugin.js.map
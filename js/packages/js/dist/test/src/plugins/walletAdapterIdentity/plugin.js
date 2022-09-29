"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletAdapterIdentity = void 0;
const WalletAdapterIdentityDriver_1 = require("./WalletAdapterIdentityDriver");
const walletAdapterIdentity = (walletAdapter) => ({
    install(metaplex) {
        metaplex
            .identity()
            .setDriver(new WalletAdapterIdentityDriver_1.WalletAdapterIdentityDriver(walletAdapter));
    },
});
exports.walletAdapterIdentity = walletAdapterIdentity;
//# sourceMappingURL=plugin.js.map
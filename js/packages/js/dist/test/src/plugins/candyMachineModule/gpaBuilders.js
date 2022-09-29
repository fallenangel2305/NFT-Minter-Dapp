"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachineGpaBuilder = void 0;
const utils_1 = require("../../utils");
const web3_js_1 = require("@solana/web3.js");
// TODO(thlorenz): copied from candy machine SDK
// SDK should either provide a GPA builder or expose this discriminator
const candyMachineDiscriminator = [
    51, 173, 177, 113, 25, 241, 109, 189,
];
const AUTHORITY = candyMachineDiscriminator.length;
const WALLET = AUTHORITY + web3_js_1.PublicKey.default.toBytes().byteLength;
class CandyMachineGpaBuilder extends utils_1.GpaBuilder {
    whereDiscriminator(discrimator) {
        return this.where(0, Buffer.from(discrimator));
    }
    candyMachineAccounts() {
        return this.whereDiscriminator(candyMachineDiscriminator);
    }
    // wallet same as solTreasury
    candyMachineAccountsForWallet(wallet) {
        return this.candyMachineAccounts().where(WALLET, wallet.toBase58());
    }
    candyMachineAccountsForAuthority(authority) {
        return this.candyMachineAccounts().where(AUTHORITY, authority.toBase58());
    }
}
exports.CandyMachineGpaBuilder = CandyMachineGpaBuilder;
//# sourceMappingURL=gpaBuilders.js.map
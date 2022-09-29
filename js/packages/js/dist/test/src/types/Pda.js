"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pda = void 0;
const web3_js_1 = require("@solana/web3.js");
class Pda extends web3_js_1.PublicKey {
    constructor(value, bump) {
        super(value);
        this.bump = bump;
    }
    static find(programId, seeds) {
        const [publicKey, bump] = web3_js_1.PublicKey.findProgramAddressSync(seeds, programId);
        return new Pda(publicKey, bump);
    }
}
exports.Pda = Pda;
//# sourceMappingURL=Pda.js.map
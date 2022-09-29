"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.killStuckProcess = exports.createWallet = exports.metaplex = exports.metaplexGuest = void 0;
const web3_js_1 = require("@solana/web3.js");
const amman_client_1 = require("@metaplex-foundation/amman-client");
const tape_1 = __importDefault(require("tape"));
const js_1 = require("@metaplex-foundation/js");
const metaplexGuest = (options = {}) => {
    var _a, _b;
    const connection = new web3_js_1.Connection((_a = options.rpcEndpoint) !== null && _a !== void 0 ? _a : amman_client_1.LOCALHOST, {
        commitment: (_b = options.commitment) !== null && _b !== void 0 ? _b : 'confirmed',
    });
    return js_1.Metaplex.make(connection).use((0, js_1.guestIdentity)()).use((0, js_1.mockStorage)());
};
exports.metaplexGuest = metaplexGuest;
const metaplex = (options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const mx = (0, exports.metaplexGuest)(options);
    const wallet = yield (0, exports.createWallet)(mx, options.solsToAirdrop);
    return mx.use((0, js_1.keypairIdentity)(wallet));
});
exports.metaplex = metaplex;
const createWallet = (mx, solsToAirdrop = 100) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = web3_js_1.Keypair.generate();
    yield mx.rpc().airdrop(wallet.publicKey, (0, js_1.sol)(solsToAirdrop));
    return wallet;
});
exports.createWallet = createWallet;
/**
 * This is a workaround the fact that web3.js doesn't close it's socket connection and provides no way to do so.
 * Therefore the process hangs for a considerable time after the tests finish, increasing the feedback loop.
 *
 * This fixes this by exiting the process as soon as all tests are finished.
 */
function killStuckProcess() {
    // Don't do this in CI since we need to ensure we get a non-zero exit code if tests fail
    if (process.env.CI == null) {
        tape_1.default.onFinish(() => process.exit(0));
    }
}
exports.killStuckProcess = killStuckProcess;
//# sourceMappingURL=helpers.js.map
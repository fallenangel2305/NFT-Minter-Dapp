"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKIP_PREFLIGHT = exports.killStuckProcess = void 0;
const tape_1 = __importDefault(require("tape"));
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
exports.SKIP_PREFLIGHT = {
    skipPreflight: true,
    commitment: 'confirmed',
};
//# sourceMappingURL=utils.js.map
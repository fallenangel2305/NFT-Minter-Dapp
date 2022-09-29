"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeThrowError = exports.resolveTransactionError = exports.errorCode = exports.amman = void 0;
const amman_client_1 = require("@metaplex-foundation/amman-client");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const log_1 = require("../../src/utils/log");
exports.amman = amman_client_1.Amman.instance({
    knownLabels: { [mpl_token_metadata_1.PROGRAM_ADDRESS]: 'Token Metadata' },
    log: log_1.logDebug,
});
function isTransactionInstructionError(error) {
    return error.InstructionError != null;
}
function errorCode(err) {
    if (isTransactionInstructionError(err)) {
        return err.InstructionError[1].Custom;
    }
}
exports.errorCode = errorCode;
function resolveTransactionError(cusper, err) {
    const code = errorCode(err);
    if (code == null) {
        return new Error(`Unknown error ${err}`);
    }
    const cusperError = cusper.errorFromCode(code);
    if (cusperError == null) {
        return new Error(`Unknown error ${err} with code ${code}`);
    }
    return cusperError;
}
exports.resolveTransactionError = resolveTransactionError;
function maybeThrowError(cusper, err) {
    if (err == null)
        return;
    throw resolveTransactionError(cusper, err);
}
exports.maybeThrowError = maybeThrowError;
//# sourceMappingURL=amman.js.map
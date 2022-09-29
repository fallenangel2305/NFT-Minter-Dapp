"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInfo = exports.logError = exports.logTrace = exports.logDebug = exports.logInfoDebug = exports.logErrorDebug = void 0;
const debug_1 = __importDefault(require("debug"));
exports.logErrorDebug = (0, debug_1.default)('mp-sdk:error');
exports.logInfoDebug = (0, debug_1.default)('mp-sdk:info');
exports.logDebug = (0, debug_1.default)('mp-sdk:debug');
exports.logTrace = (0, debug_1.default)('mp-sdk:trace');
exports.logError = exports.logErrorDebug.enabled
    ? exports.logErrorDebug
    : console.error.bind(console);
exports.logInfo = exports.logInfoDebug.enabled
    ? exports.logInfoDebug
    : console.log.bind(console);
//# sourceMappingURL=log.js.map
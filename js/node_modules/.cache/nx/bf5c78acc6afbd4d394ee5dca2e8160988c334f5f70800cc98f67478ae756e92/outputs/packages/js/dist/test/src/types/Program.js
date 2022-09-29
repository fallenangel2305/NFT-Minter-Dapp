"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isErrorWithLogs = void 0;
const isErrorWithLogs = (error) => error instanceof Error && 'logs' in error;
exports.isErrorWithLogs = isErrorWithLogs;
//# sourceMappingURL=Program.js.map
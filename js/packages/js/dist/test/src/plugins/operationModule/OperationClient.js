"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationClient = void 0;
const utils_1 = require("../../utils");
const errors_1 = require("../../errors");
/**
 * @group Modules
 */
class OperationClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
        /**
         * Maps the name of an operation with its operation handler.
         * Whilst the types on the Map are relatively loose, we ensure
         * operations match with their handlers when registering them.
         */
        this.operationHandlers = new Map();
    }
    register(operationConstructor, operationHandler) {
        this.operationHandlers.set(operationConstructor.key, operationHandler);
        return this;
    }
    get(operation) {
        const operationHandler = this.operationHandlers.get(operation.key);
        if (!operationHandler) {
            throw new errors_1.OperationHandlerMissingError(operation.key);
        }
        return operationHandler;
    }
    getTask(operation) {
        const operationHandler = this.get(operation);
        return new utils_1.Task((scope) => {
            return operationHandler.handle(operation, this.metaplex, scope);
        });
    }
    execute(operation, options = {}) {
        return this.getTask(operation).run(options);
    }
}
exports.OperationClient = OperationClient;
//# sourceMappingURL=OperationClient.js.map
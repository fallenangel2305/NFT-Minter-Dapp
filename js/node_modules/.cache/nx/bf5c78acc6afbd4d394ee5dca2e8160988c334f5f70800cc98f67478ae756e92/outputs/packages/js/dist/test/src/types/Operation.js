"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOperation = void 0;
/**
 * @group Operations
 * @category Constructors
 */
const useOperation = (key) => {
    const constructor = (input) => {
        return {
            key,
            input,
        };
    };
    constructor.key = key;
    return constructor;
};
exports.useOperation = useOperation;
//# sourceMappingURL=Operation.js.map
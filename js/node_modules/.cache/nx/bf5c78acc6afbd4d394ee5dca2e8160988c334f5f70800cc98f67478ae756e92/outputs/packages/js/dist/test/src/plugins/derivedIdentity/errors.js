"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UninitializedDerivedIdentityError = void 0;
const errors_1 = require("../../errors");
/** @group Errors */
class UninitializedDerivedIdentityError extends errors_1.SdkError {
    constructor(options) {
        super({
            options,
            key: 'uninitialized_derived_identity',
            title: 'Uninitialized Derived Identity',
            problem: 'The derived identity module has not been initialized.',
            solution: 'Before using the derived identity, you must provide a message that ' +
                'will be used to derived a Keypair from the current identity. ' +
                'You may do that by calling "metaplex.derivedIdentity().deriveFrom(message)".',
        });
    }
}
exports.UninitializedDerivedIdentityError = UninitializedDerivedIdentityError;
//# sourceMappingURL=errors.js.map
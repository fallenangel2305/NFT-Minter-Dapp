"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnreachableCaseError = exports.NotYetImplementedError = exports.NoInstructionsToSendError = exports.MissingGpaBuilderError = exports.ProgramNotRecognizedError = exports.ExpectedSignerError = exports.UnexpectedTypeError = exports.UnexpectedAccountError = exports.AccountNotFoundError = exports.AssetNotFoundError = exports.TaskIsAlreadyRunningError = exports.OperationNotSupportedByWalletAdapterError = exports.UninitializedWalletAdapterError = exports.OperationUnauthorizedForGuestsError = exports.InvalidJsonStringError = exports.InvalidJsonVariableError = exports.CurrencyMismatchError = exports.UnexpectedCurrencyError = exports.DriverNotProvidedError = exports.OperationHandlerMissingError = exports.SdkError = void 0;
const MetaplexError_1 = require("./MetaplexError");
/** @group Errors */
class SdkError extends MetaplexError_1.MetaplexError {
    constructor(input) {
        super(Object.assign(Object.assign({}, input), { key: `sdk.${input.key}`, source: 'sdk' }));
    }
}
exports.SdkError = SdkError;
/** @group Errors */
class OperationHandlerMissingError extends SdkError {
    constructor(operationKey, options) {
        super({
            options,
            key: 'operation_handler_missing',
            title: 'Operation Handler Missing',
            problem: `No operation handler was registered for the [${operationKey}] operation.`,
            solution: 'Did you forget to register it? You may do this by using: ' +
                '"metaplex.register(operation, operationHandler)".',
        });
    }
}
exports.OperationHandlerMissingError = OperationHandlerMissingError;
/** @group Errors */
class DriverNotProvidedError extends SdkError {
    constructor(driver, options) {
        super({
            options,
            key: 'driver_not_provided',
            title: 'Driver Not Provided',
            problem: `The SDK tried to access the driver [${driver}] but was not provided.`,
            solution: 'Make sure the driver is registered by using the "setDriver(myDriver)" method.',
        });
    }
}
exports.DriverNotProvidedError = DriverNotProvidedError;
/** @group Errors */
class UnexpectedCurrencyError extends SdkError {
    constructor(actual, expected, options) {
        super({
            options,
            key: 'unexpected_currency',
            title: 'Unexpected Currency',
            problem: `Expected currency [${expected}] but got [${actual}].`,
            solution: 'Ensure the provided Amount or Currency is of the expected type.',
        });
        this.actual = actual;
        this.expected = expected;
    }
}
exports.UnexpectedCurrencyError = UnexpectedCurrencyError;
/** @group Errors */
class CurrencyMismatchError extends SdkError {
    constructor(left, right, operation, options) {
        const wrappedOperation = operation ? ` [${operation}]` : '';
        super({
            options,
            key: 'currency_mismatch',
            title: 'Currency Mismatch',
            problem: `The SDK tried to execute an operation${wrappedOperation} on two different currencies: ` +
                `${left.symbol} and ${right.symbol}.`,
            solution: 'Provide both amounts in the same currency to perform this operation.',
        });
        this.left = left;
        this.right = right;
        this.operation = operation;
    }
}
exports.CurrencyMismatchError = CurrencyMismatchError;
/** @group Errors */
class InvalidJsonVariableError extends SdkError {
    constructor(options) {
        super({
            options,
            key: 'invalid_json_variable',
            title: 'Invalid JSON Variable',
            problem: 'The provided JSON variable could not be parsed into a string.',
            solution: 'Ensure the variable can be parsed as a JSON string using "JSON.stringify(myVariable)".',
        });
    }
}
exports.InvalidJsonVariableError = InvalidJsonVariableError;
/** @group Errors */
class InvalidJsonStringError extends SdkError {
    constructor(options) {
        super({
            options,
            key: 'invalid_json_string',
            title: 'Invalid JSON String',
            problem: 'The provided string could not be parsed into a JSON variable.',
            solution: 'Ensure the provided string uses a valid JSON syntax.',
        });
    }
}
exports.InvalidJsonStringError = InvalidJsonStringError;
/** @group Errors */
class OperationUnauthorizedForGuestsError extends SdkError {
    constructor(operation, options) {
        super({
            options,
            key: 'operation_unauthorized_for_guests',
            title: 'Operation Unauthorized For Guests',
            problem: `Trying to access the [${operation}] operation as a guest.`,
            solution: 'Ensure your wallet is connected using the identity driver. ' +
                'For instance, by using "metaplex.use(walletAdapterIdentity(wallet))" or ' +
                '"metaplex.use(keypairIdentity(keypair))".',
        });
    }
}
exports.OperationUnauthorizedForGuestsError = OperationUnauthorizedForGuestsError;
/** @group Errors */
class UninitializedWalletAdapterError extends SdkError {
    constructor(options) {
        super({
            options,
            key: 'uninitialized_wallet_adapter',
            title: 'Uninitialized Wallet Adapter',
            problem: 'The current wallet adapter is not initialized.',
            solution: 'You likely have selected a wallet adapter but forgot to initialize it. ' +
                'You may do this by running the following asynchronous method: "walletAdapter.connect();".',
        });
    }
}
exports.UninitializedWalletAdapterError = UninitializedWalletAdapterError;
/** @group Errors */
class OperationNotSupportedByWalletAdapterError extends SdkError {
    constructor(operation, options) {
        super({
            options,
            key: 'operation_not_supported_by_wallet_adapter',
            title: 'Operation Not Supported By Wallet Adapter',
            problem: `The current wallet adapter does not support the following operation: [${operation}].`,
            solution: 'Ensure your wallet is connected using a compatible wallet adapter.',
        });
    }
}
exports.OperationNotSupportedByWalletAdapterError = OperationNotSupportedByWalletAdapterError;
/** @group Errors */
class TaskIsAlreadyRunningError extends SdkError {
    constructor(options) {
        super({
            options,
            key: 'task_is_already_running',
            title: 'Task Is Already Running',
            problem: "Trying to re-run a task that hasn't completed yet.",
            solution: 'Ensure the task has completed using "await" before trying to run it again.',
        });
    }
}
exports.TaskIsAlreadyRunningError = TaskIsAlreadyRunningError;
/** @group Errors */
class AssetNotFoundError extends SdkError {
    constructor(location, options) {
        super({
            options,
            key: 'asset_not_found',
            title: 'Asset Not Found',
            problem: `The asset at [${location}] could not be found.`,
            solution: 'Ensure the asset exists at the given path or URI.',
        });
    }
}
exports.AssetNotFoundError = AssetNotFoundError;
/** @group Errors */
class AccountNotFoundError extends SdkError {
    constructor(address, accountType, options) {
        super({
            options,
            key: 'account_not_found',
            title: 'Account Not Found',
            problem: (accountType
                ? `The account of type [${accountType}] was not found`
                : 'No account was found') +
                ` at the provided address [${address.toBase58()}].`,
            solution: 'Ensure the provided address is correct and that an account exists at this address.',
        });
    }
}
exports.AccountNotFoundError = AccountNotFoundError;
/** @group Errors */
class UnexpectedAccountError extends SdkError {
    constructor(address, expectedType, options) {
        super({
            options,
            key: 'unexpected_account',
            title: 'Unexpected Account',
            problem: `The account at the provided address [${address.toBase58()}] ` +
                `is not of the expected type [${expectedType}].`,
            solution: `Ensure the provided address is correct and that it holds an account of type [${expectedType}].`,
        });
    }
}
exports.UnexpectedAccountError = UnexpectedAccountError;
/** @group Errors */
class UnexpectedTypeError extends SdkError {
    constructor(variable, actualType, expectedType, options) {
        super({
            options,
            key: 'unexpected_type',
            title: 'Unexpected Type',
            problem: `Expected variable [${variable}] to be of type [${expectedType}] but got [${actualType}].`,
            solution: `Please check that you are providing the right variable for this use case.`,
        });
    }
}
exports.UnexpectedTypeError = UnexpectedTypeError;
/** @group Errors */
class ExpectedSignerError extends SdkError {
    constructor(variable, actualType, options) {
        super({
            options,
            key: 'expected_signer',
            title: 'Expected Signer',
            problem: `Expected variable [${variable}] to be of type [Signer] but got [${actualType}].`,
            solution: 'Please check that you are providing the variable as a signer. ' +
                'Note that, it may be allowed to provide a non-signer variable for certain use cases but not this one.',
        });
    }
}
exports.ExpectedSignerError = ExpectedSignerError;
/** @group Errors */
class ProgramNotRecognizedError extends SdkError {
    constructor(nameOrAddress, cluster, options) {
        const isName = typeof nameOrAddress === 'string';
        const toString = isName ? nameOrAddress : nameOrAddress.toBase58();
        super({
            options,
            key: 'program_not_recognized',
            title: 'Program Not Recognized',
            problem: `The provided program ${isName ? 'name' : 'address'} [${toString}] ` +
                `is not recognized in the [${cluster}] cluster.`,
            solution: 'Did you forget to register this program? ' +
                'If so, you may use "metaplex.programs().register(myProgram)" to fix this.',
        });
        this.nameOrAddress = nameOrAddress;
        this.cluster = cluster;
    }
}
exports.ProgramNotRecognizedError = ProgramNotRecognizedError;
/** @group Errors */
class MissingGpaBuilderError extends SdkError {
    constructor(program, options) {
        super({
            options,
            key: 'missing_gpa_builder',
            title: 'Missing "getProgramAccount" Builder',
            problem: `The program [${program.name}] does not have a registered "getProgramAccount" builder.`,
            solution: 'When registering a program, make sure you provide a "gpaResolver" ' +
                'before trying to access its "getProgramAccount" builder.',
        });
        this.program = program;
    }
}
exports.MissingGpaBuilderError = MissingGpaBuilderError;
/** @group Errors */
class NoInstructionsToSendError extends SdkError {
    constructor(operation, solution, options) {
        super({
            options,
            key: 'no_instructions_to_send',
            title: 'No Instructions To Send',
            problem: `The input provided to the [${operation}] resulted ` +
                `in a Transaction containing no Instructions.`,
            solution: solution !== null && solution !== void 0 ? solution : `Ensure that the provided input has an effect on the operation. ` +
                `This typically happens when trying to update an account with ` +
                `the same data it already contains.`,
        });
    }
}
exports.NoInstructionsToSendError = NoInstructionsToSendError;
/** @group Errors */
class NotYetImplementedError extends SdkError {
    constructor(options) {
        super({
            options,
            key: 'not_yet_implemented',
            title: 'Not Yet Implemented',
            problem: 'This feature is not yet implemented.',
            solution: 'Please check back later.',
        });
    }
}
exports.NotYetImplementedError = NotYetImplementedError;
/** @group Errors */
class UnreachableCaseError extends SdkError {
    constructor(value, options) {
        super({
            options,
            key: 'unreachable_case',
            title: `The Case '${value}' in a Switch or If Statement went Unhandled.`,
            problem: 'The developer is not handling that case yet or is missing a `break` or `return` statement.',
            solution: 'Check your inputs or file an issue to have all cases handled properly.',
        });
    }
}
exports.UnreachableCaseError = UnreachableCaseError;
//# sourceMappingURL=SdkError.js.map
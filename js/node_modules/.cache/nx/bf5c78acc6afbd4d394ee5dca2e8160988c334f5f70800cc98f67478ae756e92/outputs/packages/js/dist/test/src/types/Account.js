"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertAccountExists = exports.getAccountParsingAndAssertingFunction = exports.toAccount = exports.getAccountParsingFunction = exports.parseAccount = void 0;
const errors_1 = require("../errors");
function parseAccount(account, parser) {
    if ('exists' in account && !account.exists) {
        return account;
    }
    return getAccountParsingFunction(parser)(account);
}
exports.parseAccount = parseAccount;
function getAccountParsingFunction(parser) {
    function parse(account) {
        if ('exists' in account && !account.exists) {
            return account;
        }
        try {
            const data = parser.deserialize(account.data)[0];
            return Object.assign(Object.assign({}, account), { data });
        }
        catch (error) {
            throw new errors_1.UnexpectedAccountError(account.publicKey, parser.name, {
                cause: error,
            });
        }
    }
    return parse;
}
exports.getAccountParsingFunction = getAccountParsingFunction;
function toAccount(account, parser, solution) {
    if ('exists' in account) {
        assertAccountExists(account, parser.name, solution);
    }
    return getAccountParsingFunction(parser)(account);
}
exports.toAccount = toAccount;
function getAccountParsingAndAssertingFunction(parser) {
    const parse = getAccountParsingFunction(parser);
    return (unparsedAccount, solution) => {
        if ('exists' in unparsedAccount) {
            assertAccountExists(unparsedAccount, parser.name, solution);
        }
        return parse(unparsedAccount);
    };
}
exports.getAccountParsingAndAssertingFunction = getAccountParsingAndAssertingFunction;
function assertAccountExists(account, name, solution) {
    if (!account.exists) {
        throw new errors_1.AccountNotFoundError(account.publicKey, name, { solution });
    }
}
exports.assertAccountExists = assertAccountExists;
//# sourceMappingURL=Account.js.map
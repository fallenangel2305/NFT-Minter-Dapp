"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCanMintCandyMachine = exports.assertCandyMachineHasNotEnded = exports.assertCandyMachineIsLive = exports.assertAllConfigLineConstraints = exports.assertCanAdd = exports.assertNotEmpty = exports.assertNotFull = exports.assertCreators = exports.assertUri = exports.assertSymbol = exports.assertName = void 0;
const utils_1 = require("../../utils");
const constants_1 = require("./constants");
const errors_1 = require("./errors");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const types_1 = require("../../types");
const assertName = (name) => {
    (0, utils_1.assert)(name.length <= constants_1.MAX_NAME_LENGTH, `Candy Machine name too long: ${name} (max ${constants_1.MAX_NAME_LENGTH})`);
};
exports.assertName = assertName;
const assertSymbol = (symbol) => {
    (0, utils_1.assert)(symbol.length <= constants_1.MAX_SYMBOL_LENGTH, `Candy Machine symbol too long: ${symbol} (max ${constants_1.MAX_SYMBOL_LENGTH})`);
};
exports.assertSymbol = assertSymbol;
const assertUri = (uri) => {
    (0, utils_1.assert)(uri.length <= constants_1.MAX_URI_LENGTH, `Candy Machine URI too long: ${uri} (max ${constants_1.MAX_URI_LENGTH})`);
};
exports.assertUri = assertUri;
const assertCreators = (creators) => {
    (0, utils_1.assert)(creators.length <= constants_1.MAX_CREATOR_LIMIT, `Candy Machine creators too long: ${creators} (max ${constants_1.MAX_CREATOR_LIMIT})`);
};
exports.assertCreators = assertCreators;
const assertNotFull = (candyMachine, index) => {
    if (candyMachine.itemsAvailable.lte(candyMachine.itemsLoaded)) {
        throw new errors_1.CandyMachineIsFullError(index, candyMachine.itemsAvailable);
    }
};
exports.assertNotFull = assertNotFull;
const assertNotEmpty = (candyMachine) => {
    if (candyMachine.itemsRemaining.isZero()) {
        throw new errors_1.CandyMachineIsEmptyError(candyMachine.itemsAvailable);
    }
};
exports.assertNotEmpty = assertNotEmpty;
const assertCanAdd = (candyMachine, index, amount) => {
    if (index.addn(amount).gt(candyMachine.itemsAvailable)) {
        throw new errors_1.CandyMachineCannotAddAmountError(index, amount, candyMachine.itemsAvailable);
    }
};
exports.assertCanAdd = assertCanAdd;
const assertAllConfigLineConstraints = (configLines) => {
    for (let i = 0; i < configLines.length; i++) {
        try {
            (0, exports.assertName)(configLines[i].name);
            (0, exports.assertUri)(configLines[i].uri);
        }
        catch (error) {
            throw new errors_1.CandyMachineAddItemConstraintsViolatedError((0, types_1.toBigNumber)(i), configLines[i], { cause: error });
        }
    }
};
exports.assertAllConfigLineConstraints = assertAllConfigLineConstraints;
const assertCandyMachineIsLive = (candyMachine) => {
    var _a, _b;
    const hasWhitelistPresale = (_b = (_a = candyMachine.whitelistMintSettings) === null || _a === void 0 ? void 0 : _a.presale) !== null && _b !== void 0 ? _b : false;
    if (hasWhitelistPresale) {
        return;
    }
    const liveDate = candyMachine.goLiveDate;
    if (!liveDate || liveDate.gte((0, types_1.now)())) {
        throw new errors_1.CandyMachineNotLiveError(liveDate);
    }
};
exports.assertCandyMachineIsLive = assertCandyMachineIsLive;
const assertCandyMachineHasNotEnded = (candyMachine) => {
    const endSettings = candyMachine.endSettings;
    if (!endSettings) {
        return;
    }
    const hasEndedByAmount = endSettings.endSettingType === mpl_candy_machine_1.EndSettingType.Amount &&
        candyMachine.itemsMinted.gte(endSettings.number);
    const hasEndedByDate = endSettings.endSettingType === mpl_candy_machine_1.EndSettingType.Date &&
        endSettings.date.lt((0, types_1.now)());
    if (hasEndedByAmount || hasEndedByDate) {
        throw new errors_1.CandyMachineEndedError(endSettings);
    }
};
exports.assertCandyMachineHasNotEnded = assertCandyMachineHasNotEnded;
const assertCanMintCandyMachine = (candyMachine, payer) => {
    (0, exports.assertNotEmpty)(candyMachine);
    if (candyMachine.authorityAddress.equals(payer.publicKey)) {
        return;
    }
    (0, exports.assertCandyMachineIsLive)(candyMachine);
    (0, exports.assertCandyMachineHasNotEnded)(candyMachine);
};
exports.assertCanMintCandyMachine = assertCanMintCandyMachine;
//# sourceMappingURL=asserts.js.map
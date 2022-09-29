"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachineBotTaxError = exports.CandyMachineEndedError = exports.CandyMachineNotLiveError = exports.CandyMachineAddItemConstraintsViolatedError = exports.CandyMachineCannotAddAmountError = exports.CandyMachineIsEmptyError = exports.CandyMachineIsFullError = exports.CandyMachineError = void 0;
const errors_1 = require("../../errors");
const types_1 = require("../../types");
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
/** @group Errors */
class CandyMachineError extends errors_1.MetaplexError {
    constructor(input) {
        super(Object.assign(Object.assign({}, input), { key: `plugin.candy_machine.${input.key}`, title: `Candy Machine > ${input.title}`, source: 'plugin', sourceDetails: 'Candy Machine' }));
    }
}
exports.CandyMachineError = CandyMachineError;
/** @group Errors */
class CandyMachineIsFullError extends CandyMachineError {
    constructor(assetIndex, itemsAvailable, options) {
        super({
            options,
            key: 'candy_machine_is_full',
            title: 'Candy Machine Is Full',
            problem: `Trying to add asset number ${assetIndex.addn(1)}, but ` +
                `candy machine only can hold ${itemsAvailable} assets.`,
            solution: 'Limit number of assets you are adding or create a new Candy Machine that can hold more.',
        });
    }
}
exports.CandyMachineIsFullError = CandyMachineIsFullError;
/** @group Errors */
class CandyMachineIsEmptyError extends CandyMachineError {
    constructor(itemsAvailable, options) {
        super({
            options,
            key: 'candy_machine_is_empty',
            title: 'Candy Machine Is Empty',
            problem: `You're trying to mint from an empty candy machine. ` +
                `All ${itemsAvailable} items have been minted.`,
            solution: 'You can no longer mint from this Candy Machine.',
        });
    }
}
exports.CandyMachineIsEmptyError = CandyMachineIsEmptyError;
/** @group Errors */
class CandyMachineCannotAddAmountError extends CandyMachineError {
    constructor(index, amount, itemsAvailable, options) {
        super({
            options,
            key: 'candy_machine_cannot_add_amount',
            title: 'Candy Machine Cannot Add Amount',
            problem: `Trying to add ${amount} assets to candy machine that already has ${index} assets and can only hold ${itemsAvailable} assets.`,
            solution: 'Limit number of assets you are adding or create a new Candy Machine that can hold more.',
        });
    }
}
exports.CandyMachineCannotAddAmountError = CandyMachineCannotAddAmountError;
/** @group Errors */
class CandyMachineAddItemConstraintsViolatedError extends CandyMachineError {
    constructor(index, item, options) {
        super({
            options,
            key: 'candy_machine_add_item_constraints_violated',
            title: 'Candy Machine Add Item Constraints Violated',
            problem: `Trying to add an asset with name "${item.name}" and uri: "${item.uri}" to candy machine at index ${index} that violates constraints.`,
            solution: 'Fix the name or URI of this asset and try again.',
        });
    }
}
exports.CandyMachineAddItemConstraintsViolatedError = CandyMachineAddItemConstraintsViolatedError;
/** @group Errors */
class CandyMachineNotLiveError extends CandyMachineError {
    constructor(goLiveDate, options) {
        super({
            options,
            key: 'candy_machine_not_live',
            title: 'Candy Machine Not Live',
            problem: `You're trying to mint from a Candy Machine which is not live yet. ` +
                (goLiveDate
                    ? `It will go live on ${(0, types_1.formatDateTime)(goLiveDate)}.`
                    : `Its live date has not been set yet.`),
            solution: 'You need to wait until the Candy Machine is live to mint from it. ' +
                'If this is your Candy Machine, use "metaplex.candyMachines().update(...)" to set the live date. ' +
                'Note that the authority of the Candy Machine can mint regardless of the live date.',
        });
    }
}
exports.CandyMachineNotLiveError = CandyMachineNotLiveError;
/** @group Errors */
class CandyMachineEndedError extends CandyMachineError {
    constructor(endSetting, options) {
        const endSettingType = endSetting.endSettingType === mpl_candy_machine_1.EndSettingType.Amount ? 'Amount' : 'Date';
        const endSettingExplanation = endSetting.endSettingType === mpl_candy_machine_1.EndSettingType.Amount
            ? `All ${endSetting.number} items have been minted.`
            : `It ended on ${(0, types_1.formatDateTime)(endSetting.date)}.`;
        super({
            options,
            key: 'candy_machine_ended',
            title: 'Candy Machine Ended',
            problem: `The end condition [${endSettingType}] of this Candy Machine has been reached. ` +
                endSettingExplanation,
            solution: 'You can no longer mint from this Candy Machine.',
        });
    }
}
exports.CandyMachineEndedError = CandyMachineEndedError;
/** @group Errors */
class CandyMachineBotTaxError extends CandyMachineError {
    constructor(explorerLink, cause, options) {
        super({
            options: Object.assign(Object.assign({}, options), { cause }),
            key: 'candy_machine_bot_tax',
            title: 'Candy Machine Bot Tax',
            problem: `The NFT couldn't be fetched after being minted. ` +
                `This is most likely due to a bot tax that occured during minting. ` +
                `When someone tries to mint an NFT from a Candy Machine which cannot be minted from, ` +
                `the program will succeed and charge a small tax to fight against bots.`,
            solution: `Ensure you can mint from the Candy Machine. ` +
                `You may want to check the transaction logs for more details: [${explorerLink}].`,
        });
    }
}
exports.CandyMachineBotTaxError = CandyMachineBotTaxError;
//# sourceMappingURL=errors.js.map
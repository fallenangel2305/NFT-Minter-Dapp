"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCandyMachineUuidFromAddress = exports.getCandyMachineAccountSizeFromData = exports.parseCandyMachineItems = exports.countCandyMachineItems = void 0;
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const constants_1 = require("./constants");
const utils_1 = require("../../utils");
const types_1 = require("../../types");
function countCandyMachineItems(rawData) {
    const number = rawData.slice(constants_1.CONFIG_ARRAY_START, constants_1.CONFIG_ARRAY_START + 4);
    return (0, types_1.toBigNumber)(number, 'le');
}
exports.countCandyMachineItems = countCandyMachineItems;
function parseCandyMachineItems(rawData) {
    const configLinesStart = constants_1.CONFIG_ARRAY_START + 4;
    const lines = [];
    const count = countCandyMachineItems(rawData).toNumber();
    for (let i = 0; i < count; i++) {
        const [line] = mpl_candy_machine_1.configLineBeet.deserialize(rawData, configLinesStart + i * constants_1.CONFIG_LINE_SIZE);
        lines.push({
            name: (0, utils_1.removeEmptyChars)(line.name),
            uri: (0, utils_1.removeEmptyChars)(line.uri),
        });
    }
    return lines;
}
exports.parseCandyMachineItems = parseCandyMachineItems;
function getCandyMachineAccountSizeFromData(data) {
    if (data.hiddenSettings != null) {
        return constants_1.CONFIG_ARRAY_START;
    }
    else {
        const itemsAvailable = (0, types_1.toBigNumber)(data.itemsAvailable).toNumber();
        return Math.ceil(constants_1.CONFIG_ARRAY_START +
            4 +
            itemsAvailable * constants_1.CONFIG_LINE_SIZE +
            8 +
            2 * (itemsAvailable / 8 + 1));
    }
}
exports.getCandyMachineAccountSizeFromData = getCandyMachineAccountSizeFromData;
const getCandyMachineUuidFromAddress = (candyMachineAddress) => {
    return candyMachineAddress.toBase58().slice(0, 6);
};
exports.getCandyMachineUuidFromAddress = getCandyMachineUuidFromAddress;
//# sourceMappingURL=helpers.js.map
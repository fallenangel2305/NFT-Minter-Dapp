"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCandyMachineInstructionData = exports.toCandyMachineConfigs = exports.toCandyMachine = exports.assertCandyMachine = exports.isCandyMachine = void 0;
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const types_1 = require("../../../types");
const utils_1 = require("../../../utils");
const helpers_1 = require("../helpers");
const program_1 = require("../program");
// -----------------
// Program to Model
// -----------------
/** @group Model Helpers */
const isCandyMachine = (value) => typeof value === 'object' && value.model === 'candyMachine';
exports.isCandyMachine = isCandyMachine;
/** @group Model Helpers */
function assertCandyMachine(value) {
    (0, utils_1.assert)((0, exports.isCandyMachine)(value), 'Expected CandyMachine type');
}
exports.assertCandyMachine = assertCandyMachine;
/** @group Model Helpers */
const toCandyMachine = (account, unparsedAccount, collectionAccount, mint) => {
    (0, utils_1.assert)(mint === null ||
        (account.data.tokenMint !== null &&
            mint.address.equals(account.data.tokenMint)));
    const itemsAvailable = (0, types_1.toBigNumber)(account.data.data.itemsAvailable);
    const itemsMinted = (0, types_1.toBigNumber)(account.data.itemsRedeemed);
    const endSettings = account.data.data.endSettings;
    const hiddenSettings = account.data.data.hiddenSettings;
    const whitelistMintSettings = account.data.data.whitelistMintSettings;
    const gatekeeper = account.data.data.gatekeeper;
    const rawData = unparsedAccount.data;
    const itemsLoaded = hiddenSettings
        ? (0, types_1.toBigNumber)(0)
        : (0, helpers_1.countCandyMachineItems)(rawData);
    const items = hiddenSettings ? [] : (0, helpers_1.parseCandyMachineItems)(rawData);
    return {
        model: 'candyMachine',
        address: account.publicKey,
        programAddress: account.owner,
        version: account.owner.equals(program_1.CandyMachineProgram.publicKey) ? 2 : 1,
        authorityAddress: account.data.authority,
        walletAddress: account.data.wallet,
        tokenMintAddress: account.data.tokenMint,
        collectionMintAddress: collectionAccount && collectionAccount.exists
            ? collectionAccount.data.mint
            : null,
        uuid: account.data.data.uuid,
        price: (0, types_1.amount)(account.data.data.price, mint ? mint.currency : types_1.SOL),
        symbol: (0, utils_1.removeEmptyChars)(account.data.data.symbol),
        sellerFeeBasisPoints: account.data.data.sellerFeeBasisPoints,
        isMutable: account.data.data.isMutable,
        retainAuthority: account.data.data.retainAuthority,
        goLiveDate: (0, types_1.toOptionDateTime)(account.data.data.goLiveDate),
        maxEditionSupply: (0, types_1.toBigNumber)(account.data.data.maxSupply),
        items,
        itemsAvailable,
        itemsMinted,
        itemsRemaining: (0, types_1.toBigNumber)(itemsAvailable.sub(itemsMinted)),
        itemsLoaded,
        isFullyLoaded: itemsAvailable.lte(itemsLoaded),
        endSettings: endSettings
            ? endSettings.endSettingType === mpl_candy_machine_1.EndSettingType.Date
                ? {
                    endSettingType: mpl_candy_machine_1.EndSettingType.Date,
                    date: (0, types_1.toDateTime)(endSettings.number),
                }
                : {
                    endSettingType: mpl_candy_machine_1.EndSettingType.Amount,
                    number: (0, types_1.toBigNumber)(endSettings.number),
                }
            : null,
        hiddenSettings,
        whitelistMintSettings: whitelistMintSettings
            ? Object.assign(Object.assign({}, whitelistMintSettings), { discountPrice: whitelistMintSettings.discountPrice
                    ? (0, types_1.lamports)(whitelistMintSettings.discountPrice)
                    : null }) : null,
        gatekeeper: gatekeeper
            ? Object.assign(Object.assign({}, gatekeeper), { network: gatekeeper.gatekeeperNetwork }) : null,
        creators: account.data.data.creators,
    };
};
exports.toCandyMachine = toCandyMachine;
/** @group Model Helpers */
const toCandyMachineConfigs = (candyMachine) => {
    return Object.assign({ wallet: candyMachine.walletAddress, tokenMint: candyMachine.tokenMintAddress }, candyMachine);
};
exports.toCandyMachineConfigs = toCandyMachineConfigs;
/** @group Model Helpers */
const toCandyMachineInstructionData = (address, configs) => {
    var _a, _b;
    const endSettings = configs.endSettings;
    const whitelistMintSettings = configs.whitelistMintSettings;
    const gatekeeper = configs.gatekeeper;
    return {
        wallet: configs.wallet,
        tokenMint: configs.tokenMint,
        data: Object.assign(Object.assign({}, configs), { uuid: (0, helpers_1.getCandyMachineUuidFromAddress)(address), price: configs.price.basisPoints, maxSupply: configs.maxEditionSupply, endSettings: endSettings
                ? Object.assign(Object.assign({}, endSettings), { number: endSettings.endSettingType === mpl_candy_machine_1.EndSettingType.Date
                        ? endSettings.date
                        : endSettings.number }) : null, whitelistMintSettings: whitelistMintSettings
                ? Object.assign(Object.assign({}, whitelistMintSettings), { discountPrice: (_b = (_a = whitelistMintSettings.discountPrice) === null || _a === void 0 ? void 0 : _a.basisPoints) !== null && _b !== void 0 ? _b : null }) : null, gatekeeper: gatekeeper
                ? Object.assign(Object.assign({}, gatekeeper), { gatekeeperNetwork: gatekeeper.network }) : null }),
    };
};
exports.toCandyMachineInstructionData = toCandyMachineInstructionData;
//# sourceMappingURL=CandyMachine.js.map
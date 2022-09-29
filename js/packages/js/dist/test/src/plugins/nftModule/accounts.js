"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPrintEditionAccount = exports.parsePrintEditionAccount = exports.toOriginalEditionAccount = exports.parseOriginalEditionAccount = exports.isPrintEditionAccount = exports.isOriginalEditionAccount = exports.toOriginalOrPrintEditionAccount = exports.parseOriginalOrPrintEditionAccount = exports.toMetadataAccount = exports.parseMetadataAccount = void 0;
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const types_1 = require("../../types");
/** @group Account Helpers */
exports.parseMetadataAccount = (0, types_1.getAccountParsingFunction)(mpl_token_metadata_1.Metadata);
/** @group Account Helpers */
exports.toMetadataAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_token_metadata_1.Metadata);
const originalOrPrintEditionAccountParser = {
    name: 'MasterEditionV1 | MasterEditionV2 | Edition',
    deserialize: (data, offset = 0) => {
        if ((data === null || data === void 0 ? void 0 : data[0]) === mpl_token_metadata_1.Key.MasterEditionV1) {
            return mpl_token_metadata_1.MasterEditionV1.deserialize(data, offset);
        }
        else if ((data === null || data === void 0 ? void 0 : data[0]) === mpl_token_metadata_1.Key.MasterEditionV2) {
            return mpl_token_metadata_1.MasterEditionV2.deserialize(data, offset);
        }
        else {
            return mpl_token_metadata_1.Edition.deserialize(data, offset);
        }
    },
};
/** @group Account Helpers */
exports.parseOriginalOrPrintEditionAccount = (0, types_1.getAccountParsingFunction)(originalOrPrintEditionAccountParser);
/** @group Account Helpers */
exports.toOriginalOrPrintEditionAccount = (0, types_1.getAccountParsingAndAssertingFunction)(originalOrPrintEditionAccountParser);
/** @group Account Helpers */
const isOriginalEditionAccount = (account) => {
    return 'maxSupply' in account.data;
};
exports.isOriginalEditionAccount = isOriginalEditionAccount;
/** @group Account Helpers */
const isPrintEditionAccount = (account) => {
    return !(0, exports.isOriginalEditionAccount)(account);
};
exports.isPrintEditionAccount = isPrintEditionAccount;
const originalEditionAccountParser = {
    name: 'MasterEditionV1 | MasterEditionV2',
    deserialize: (data, offset = 0) => {
        if ((data === null || data === void 0 ? void 0 : data[0]) === mpl_token_metadata_1.Key.MasterEditionV1) {
            return mpl_token_metadata_1.MasterEditionV1.deserialize(data, offset);
        }
        else {
            return mpl_token_metadata_1.MasterEditionV2.deserialize(data, offset);
        }
    },
};
/** @group Account Helpers */
exports.parseOriginalEditionAccount = (0, types_1.getAccountParsingFunction)(originalEditionAccountParser);
/** @group Account Helpers */
exports.toOriginalEditionAccount = (0, types_1.getAccountParsingAndAssertingFunction)(originalEditionAccountParser);
/** @group Account Helpers */
exports.parsePrintEditionAccount = (0, types_1.getAccountParsingFunction)(mpl_token_metadata_1.Edition);
/** @group Account Helpers */
exports.toPrintEditionAccount = (0, types_1.getAccountParsingAndAssertingFunction)(mpl_token_metadata_1.Edition);
//# sourceMappingURL=accounts.js.map
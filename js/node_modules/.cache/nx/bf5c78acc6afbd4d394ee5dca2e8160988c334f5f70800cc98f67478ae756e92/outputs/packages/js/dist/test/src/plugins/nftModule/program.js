"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenMetadataProgram = void 0;
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const gpaBuilders_1 = require("./gpaBuilders");
/** @group Programs */
exports.TokenMetadataProgram = {
    publicKey: mpl_token_metadata_1.PROGRAM_ID,
    metadataV1Accounts(metaplex) {
        return new gpaBuilders_1.MetadataV1GpaBuilder(metaplex, this.publicKey);
    },
};
//# sourceMappingURL=program.js.map
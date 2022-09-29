"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountProviders = void 0;
// TODO(thlorenz): the mpl modules should export those as 'accountProviders'
const mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
/** @internal */
exports.accountProviders = {
    CandyMachine: mpl_candy_machine_1.CandyMachine,
    CollectionPDA: mpl_candy_machine_1.CollectionPDA,
    CollectionAuthorityRecord: mpl_token_metadata_1.CollectionAuthorityRecord,
    Edition: mpl_token_metadata_1.Edition,
    EditionMarker: mpl_token_metadata_1.EditionMarker,
    MasterEditionV2: mpl_token_metadata_1.MasterEditionV2,
    Metadata: mpl_token_metadata_1.Metadata,
    ReservationListV2: mpl_token_metadata_1.ReservationListV2,
    UseAuthorityRecord: mpl_token_metadata_1.UseAuthorityRecord,
};
//# sourceMappingURL=accountProviders.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nftModule = void 0;
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const gpaBuilders_1 = require("./gpaBuilders");
const NftClient_1 = require("./NftClient");
const operations_1 = require("./operations");
const program_1 = require("./program");
/** @group Plugins */
const nftModule = () => ({
    install(metaplex) {
        // Token Metadata Program.
        metaplex.programs().register({
            name: 'TokenMetadataProgram',
            address: program_1.TokenMetadataProgram.publicKey,
            errorResolver: (error) => mpl_token_metadata_1.cusper.errorFromProgramLogs(error.logs, false),
            gpaResolver: (metaplex) => new gpaBuilders_1.TokenMetadataGpaBuilder(metaplex, program_1.TokenMetadataProgram.publicKey),
        });
        // Operations.
        const op = metaplex.operations();
        op.register(operations_1.approveNftCollectionAuthorityOperation, operations_1.approveNftCollectionAuthorityOperationHandler);
        op.register(operations_1.approveNftUseAuthorityOperation, operations_1.approveNftUseAuthorityOperationHandler);
        op.register(operations_1.createNftOperation, operations_1.createNftOperationHandler);
        op.register(operations_1.createSftOperation, operations_1.createSftOperationHandler);
        op.register(operations_1.deleteNftOperation, operations_1.deleteNftOperationHandler);
        op.register(operations_1.findNftByMetadataOperation, operations_1.findNftByMetadataOperationHandler);
        op.register(operations_1.findNftByMintOperation, operations_1.findNftByMintOperationHandler);
        op.register(operations_1.findNftByTokenOperation, operations_1.findNftByTokenOperationHandler);
        op.register(operations_1.findNftsByCreatorOperation, operations_1.findNftsByCreatorOperationHandler);
        op.register(operations_1.findNftsByMintListOperation, operations_1.findNftsByMintListOperationHandler);
        op.register(operations_1.findNftsByOwnerOperation, operations_1.findNftsByOwnerOperationHandler);
        op.register(operations_1.findNftsByUpdateAuthorityOperation, operations_1.findNftsByUpdateAuthorityOperationHandler);
        op.register(operations_1.freezeDelegatedNftOperation, operations_1.freezeDelegatedNftOperationHandler);
        op.register(operations_1.loadMetadataOperation, operations_1.loadMetadataOperationHandler);
        op.register(operations_1.migrateToSizedCollectionNftOperation, operations_1.migrateToSizedCollectionNftOperationHandler);
        op.register(operations_1.printNewEditionOperation, operations_1.printNewEditionOperationHandler);
        op.register(operations_1.revokeNftCollectionAuthorityOperation, operations_1.revokeNftCollectionAuthorityOperationHandler);
        op.register(operations_1.revokeNftUseAuthorityOperation, operations_1.revokeNftUseAuthorityOperationHandler);
        op.register(operations_1.thawDelegatedNftOperation, operations_1.thawDelegatedNftOperationHandler);
        op.register(operations_1.unverifyNftCollectionOperation, operations_1.unverifyNftCollectionOperationHandler);
        op.register(operations_1.unverifyNftCreatorOperation, operations_1.unverifyNftCreatorOperationHandler);
        op.register(operations_1.updateNftOperation, operations_1.updateNftOperationHandler);
        op.register(operations_1.uploadMetadataOperation, operations_1.uploadMetadataOperationHandler);
        op.register(operations_1.useNftOperation, operations_1.useNftOperationHandler);
        op.register(operations_1.verifyNftCollectionOperation, operations_1.verifyNftCollectionOperationHandler);
        op.register(operations_1.verifyNftCreatorOperation, operations_1.verifyNftCreatorOperationHandler);
        metaplex.nfts = function () {
            return new NftClient_1.NftClient(this);
        };
    },
});
exports.nftModule = nftModule;
//# sourceMappingURL=plugin.js.map
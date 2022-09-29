"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftBuildersClient = void 0;
const operations_1 = require("./operations");
/**
 * This client allows you to access the underlying Transaction Builders
 * for the write operations of the NFT module.
 *
 * @see {@link NftClient}
 * @group Module Builders
 * */
class NftBuildersClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    // -----------------
    // Create, Update and Delete
    // -----------------
    /** {@inheritDoc createNftBuilder} */
    create(input) {
        return (0, operations_1.createNftBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc createSftBuilder} */
    createSft(input) {
        return (0, operations_1.createSftBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc printNewEditionBuilder} */
    printNewEdition(input) {
        return (0, operations_1.printNewEditionBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc updateNftBuilder} */
    update(input) {
        return (0, operations_1.updateNftBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc deleteNftBuilder} */
    delete(input) {
        return (0, operations_1.deleteNftBuilder)(this.metaplex, input);
    }
    // -----------------
    // Use
    // -----------------
    /** {@inheritDoc useNftBuilder} */
    use(input) {
        return (0, operations_1.useNftBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc approveNftUseAuthorityBuilder} */
    approveUseAuthority(input) {
        return (0, operations_1.approveNftUseAuthorityBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc revokeNftUseAuthorityBuilder} */
    revokeUseAuthority(input) {
        return (0, operations_1.revokeNftUseAuthorityBuilder)(this.metaplex, input);
    }
    // -----------------
    // Creators
    // -----------------
    /** {@inheritDoc verifyNftCreatorBuilder} */
    verifyCreator(input) {
        return (0, operations_1.verifyNftCreatorBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc unverifyNftCreatorBuilder} */
    unverifyCreator(input) {
        return (0, operations_1.unverifyNftCreatorBuilder)(this.metaplex, input);
    }
    // -----------------
    // Collections
    // -----------------
    /** {@inheritDoc verifyNftCollectionBuilder} */
    verifyCollection(input) {
        return (0, operations_1.verifyNftCollectionBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc unverifyNftCollectionBuilder} */
    unverifyCollection(input) {
        return (0, operations_1.unverifyNftCollectionBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc approveNftCollectionAuthorityBuilder} */
    approveCollectionAuthority(input) {
        return (0, operations_1.approveNftCollectionAuthorityBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc revokeNftCollectionAuthorityBuilder} */
    revokeCollectionAuthority(input) {
        return (0, operations_1.revokeNftCollectionAuthorityBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc migrateToSizedCollectionNftBuilder} */
    migrateToSizedCollection(input) {
        return (0, operations_1.migrateToSizedCollectionNftBuilder)(this.metaplex, input);
    }
    // -----------------
    // Token
    // -----------------
    /** {@inheritDoc freezeDelegatedNftBuilder} */
    freezeDelegatedNft(input) {
        return (0, operations_1.freezeDelegatedNftBuilder)(this.metaplex, input);
    }
    /** {@inheritDoc thawDelegatedNftBuilder} */
    thawDelegatedNft(input) {
        return (0, operations_1.thawDelegatedNftBuilder)(this.metaplex, input);
    }
}
exports.NftBuildersClient = NftBuildersClient;
//# sourceMappingURL=NftBuildersClient.js.map
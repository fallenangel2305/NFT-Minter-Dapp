"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftClient = void 0;
const types_1 = require("../../types");
const helpers_1 = require("./helpers");
const NftBuildersClient_1 = require("./NftBuildersClient");
const operations_1 = require("./operations");
/**
 * This is a client for the NFT module.
 *
 * It enables us to interact with the Token Metadata program in order to
 * manage NFTs and SFTs.
 *
 * You may access this client via the `nfts()` method of your `Metaplex` instance.
 *
 * ```ts
 * const nftClient = metaplex.nfts();
 * ```
 *
 * @example
 * You can upload some custom JSON metadata and use its URI to create
 * a new NFT like so. The owner and update authority of this NFT will,
 * by default, be the current identity of the metaplex instance.
 *
 * ```ts
 * const { uri } = await metaplex
 *   .nfts()
 *   .uploadMetadata({
 *     name: "My off-chain name",
 *     description: "My off-chain description",
 *     image: "https://arweave.net/123",
 *   })
 *   .run();
 *
 * const { nft } = await metaplex
 *   .nfts()
 *   .create({
 *     uri,
 *     name: 'My on-chain NFT',
 *     sellerFeeBasisPoints: 250, // 2.5%
 *   })
 *   .run();
 * ```
 *
 * @group Modules
 */
class NftClient {
    constructor(metaplex) {
        this.metaplex = metaplex;
    }
    /**
     * You may use the `builders()` client to access the
     * underlying Transaction Builders of this module.
     *
     * ```ts
     * const buildersClient = metaplex.nfts().builders();
     * ```
     */
    builders() {
        return new NftBuildersClient_1.NftBuildersClient(this.metaplex);
    }
    // -----------------
    // Queries
    // -----------------
    /** {@inheritDoc findNftByMintOperation} */
    findByMint(input) {
        return this.metaplex.operations().getTask((0, operations_1.findNftByMintOperation)(input));
    }
    /** {@inheritDoc findNftByMetadataOperation} */
    findByMetadata(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findNftByMetadataOperation)(input));
    }
    /** {@inheritDoc findNftByTokenOperation} */
    findByToken(input) {
        return this.metaplex.operations().getTask((0, operations_1.findNftByTokenOperation)(input));
    }
    /** {@inheritDoc findNftsByCreatorOperation} */
    findAllByCreator(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findNftsByCreatorOperation)(input));
    }
    /** {@inheritDoc findNftsByMintListOperation} */
    findAllByMintList(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findNftsByMintListOperation)(input));
    }
    /** {@inheritDoc findNftsByOwnerOperation} */
    findAllByOwner(input) {
        return this.metaplex.operations().getTask((0, operations_1.findNftsByOwnerOperation)(input));
    }
    /** {@inheritDoc findNftsByUpdateAuthorityOperation} */
    findAllByUpdateAuthority(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.findNftsByUpdateAuthorityOperation)(input));
    }
    /** {@inheritDoc loadMetadataOperation} */
    load(input) {
        return this.metaplex.operations().getTask((0, operations_1.loadMetadataOperation)(input));
    }
    /**
     * Helper method that refetches a given model
     * and returns an instance of the same type.
     *
     * ```ts
     * nft = await metaplex.nfts().refresh(nft).run();
     * sft = await metaplex.nfts().refresh(sft).run();
     * nftWithToken = await metaplex.nfts().refresh(nftWithToken).run();
     * ```
     */
    refresh(model, input) {
        return this.findByMint(Object.assign({ mintAddress: (0, helpers_1.toMintAddress)(model), tokenAddress: 'token' in model ? model.token.address : undefined }, input));
    }
    // -----------------
    // Create, Update and Delete
    // -----------------
    /** {@inheritDoc createNftOperation} */
    create(input) {
        return this.metaplex.operations().getTask((0, operations_1.createNftOperation)(input));
    }
    /** {@inheritDoc createSftOperation} */
    createSft(input) {
        return this.metaplex.operations().getTask((0, operations_1.createSftOperation)(input));
    }
    /** {@inheritDoc printNewEditionOperation} */
    printNewEdition(input) {
        return this.metaplex.operations().getTask((0, operations_1.printNewEditionOperation)(input));
    }
    /** {@inheritDoc uploadMetadataOperation} */
    uploadMetadata(input) {
        return this.metaplex.operations().getTask((0, operations_1.uploadMetadataOperation)(input));
    }
    /** {@inheritDoc updateNftOperation} */
    update(input) {
        return this.metaplex.operations().getTask((0, operations_1.updateNftOperation)(input));
    }
    /** {@inheritDoc deleteNftOperation} */
    delete(input) {
        return this.metaplex.operations().getTask((0, operations_1.deleteNftOperation)(input));
    }
    // -----------------
    // Use
    // -----------------
    /** {@inheritDoc useNftOperation} */
    use(input) {
        return this.metaplex.operations().getTask((0, operations_1.useNftOperation)(input));
    }
    /** {@inheritDoc approveNftUseAuthorityOperation} */
    approveUseAuthority(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.approveNftUseAuthorityOperation)(input));
    }
    /** {@inheritDoc revokeNftUseAuthorityOperation} */
    revokeUseAuthority(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.revokeNftUseAuthorityOperation)(input));
    }
    // -----------------
    // Creators
    // -----------------
    /** {@inheritDoc verifyNftCreatorOperation} */
    verifyCreator(input) {
        return this.metaplex.operations().getTask((0, operations_1.verifyNftCreatorOperation)(input));
    }
    /** {@inheritDoc unverifyNftCreatorOperation} */
    unverifyCreator(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.unverifyNftCreatorOperation)(input));
    }
    // -----------------
    // Collections
    // -----------------
    /** {@inheritDoc verifyNftCollectionOperation} */
    verifyCollection(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.verifyNftCollectionOperation)(input));
    }
    /** {@inheritDoc unverifyNftCollectionOperation} */
    unverifyCollection(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.unverifyNftCollectionOperation)(input));
    }
    /** {@inheritDoc approveNftCollectionAuthorityOperation} */
    approveCollectionAuthority(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.approveNftCollectionAuthorityOperation)(input));
    }
    /** {@inheritDoc revokeNftCollectionAuthorityOperation} */
    revokeCollectionAuthority(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.revokeNftCollectionAuthorityOperation)(input));
    }
    /** {@inheritDoc migrateToSizedCollectionNftOperation} */
    migrateToSizedCollection(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.migrateToSizedCollectionNftOperation)(input));
    }
    // -----------------
    // Tokens
    // -----------------
    /** {@inheritDoc freezeDelegatedNftOperation} */
    freezeDelegatedNft(input) {
        return this.metaplex
            .operations()
            .getTask((0, operations_1.freezeDelegatedNftOperation)(input));
    }
    /** {@inheritDoc thawDelegatedNftOperation} */
    thawDelegatedNft(input) {
        return this.metaplex.operations().getTask((0, operations_1.thawDelegatedNftOperation)(input));
    }
    /** {@inheritDoc sendTokensOperation} */
    send(input) {
        return this.metaplex.tokens().send(Object.assign(Object.assign({}, input), { amount: (0, types_1.token)(1) }));
    }
}
exports.NftClient = NftClient;
//# sourceMappingURL=NftClient.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugins_1 = require("../../../src/plugins");
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
const helpers_2 = require("./helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] the owner of an NFT can delete it', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const owner = web3_js_1.Keypair.generate();
    const nft = yield (0, helpers_1.createNft)(mx, { tokenOwner: owner.publicKey });
    // When the owner deletes the NFT.
    yield mx.nfts().delete({ mintAddress: nft.address, owner }).run();
    // Then the NFT accounts no longer exist.
    const accounts = yield mx
        .rpc()
        .getMultipleAccounts([
        nft.address,
        nft.token.address,
        nft.metadataAddress,
        nft.edition.address,
    ]);
    t.true(accounts[0].exists, 'mint account still exists because of SPL Token');
    t.false(accounts[1].exists, 'token account no longer exists');
    t.false(accounts[2].exists, 'metadata account no longer exists');
    t.false(accounts[3].exists, 'edition account no longer exists');
}));
(0, tape_1.default)('[nftModule] it decreases the collection size when deleting the NFT', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT part of a sized collection.
    const mx = yield (0, helpers_1.metaplex)();
    const owner = web3_js_1.Keypair.generate();
    const collectionNft = yield (0, helpers_1.createCollectionNft)(mx);
    const nft = yield (0, helpers_1.createNft)(mx, {
        tokenOwner: owner.publicKey,
        collection: collectionNft.address,
        collectionAuthority: mx.identity(),
    });
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 1);
    // When the owner deletes the NFT and provides the collection address.
    yield mx
        .nfts()
        .delete({
        mintAddress: nft.address,
        owner,
        collection: collectionNft.address,
    })
        .run();
    // Then the collection size has decreased.
    yield (0, helpers_2.assertRefreshedCollectionHasSize)(t, mx, collectionNft, 0);
    // And the NFT accounts no longer exist.
    const accounts = yield mx
        .rpc()
        .getMultipleAccounts([
        nft.address,
        nft.token.address,
        nft.metadataAddress,
        nft.edition.address,
    ]);
    t.true(accounts[0].exists, 'mint account still exists because of SPL Token');
    t.false(accounts[1].exists, 'token account no longer exists');
    t.false(accounts[2].exists, 'metadata account no longer exists');
    t.false(accounts[3].exists, 'edition account no longer exists');
}));
(0, tape_1.default)('[nftModule] the update authority of an NFT cannot delete it', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given an existing NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const owner = web3_js_1.Keypair.generate();
    const updateAuthority = web3_js_1.Keypair.generate();
    const nft = yield (0, helpers_1.createNft)(mx, {
        tokenOwner: owner.publicKey,
        updateAuthority: updateAuthority,
    });
    // When the update authority tries to delete the NFT.
    const promise = mx
        .nfts()
        .delete({
        mintAddress: nft.address,
        owner: updateAuthority,
        ownerTokenAccount: (0, plugins_1.findAssociatedTokenAccountPda)(nft.mint.address, owner.publicKey),
    })
        .run();
    // Then we expect an error.
    yield (0, helpers_1.assertThrows)(t, promise, /InvalidOwner: Invalid Owner/);
    // And the NFT accounts still exist.
    const accounts = yield mx
        .rpc()
        .getMultipleAccounts([
        nft.address,
        nft.token.address,
        nft.metadataAddress,
        nft.edition.address,
    ]);
    t.true(accounts[0].exists, 'mint account still exists');
    t.true(accounts[1].exists, 'token account still exists');
    t.true(accounts[2].exists, 'metadata account still exists');
    t.true(accounts[3].exists, 'edition account still exists');
}));
//# sourceMappingURL=deleteNft.test.js.map
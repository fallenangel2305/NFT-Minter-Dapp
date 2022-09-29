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
const mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const helpers_1 = require("../../helpers");
(0, helpers_1.killStuckProcess)();
(0, tape_1.default)('[nftModule] it can revoke a Use authority for a given Nft', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // Given we have a Metaplex instance and a usable NFT.
    const mx = yield (0, helpers_1.metaplex)();
    const nft = yield (0, helpers_1.createNft)(mx, {
        uses: {
            useMethod: mpl_token_metadata_1.UseMethod.Multiple,
            remaining: 10,
            total: 10,
        },
    });
    // And a use authority has been approved.
    const currentUser = web3_js_1.Keypair.generate();
    yield mx
        .nfts()
        .approveUseAuthority({
        mintAddress: nft.address,
        user: currentUser.publicKey,
    })
        .run();
    // When we revoke that use authority.
    yield mx
        .nfts()
        .revokeUseAuthority({
        mintAddress: nft.address,
        user: currentUser.publicKey,
    })
        .run();
    // Then it can no longer use that NFT.
    const promise = mx
        .nfts()
        .use({ mintAddress: nft.address, useAuthority: currentUser })
        .run();
    yield (0, helpers_1.assertThrows)(t, promise, /The Use Authority Record is empty or already revoked/);
}));
//# sourceMappingURL=revokeNftUseAuthority.test.js.map
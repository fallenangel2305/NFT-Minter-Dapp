import {
  bundlrStorage,
  Metaplex,
  sol,
  toMetaplexFileFromBrowser,
  walletAdapterIdentity,
  WRAPPED_SOL_MINT,
} from "@metaplex-foundation/js/packages/js";
import { Connection } from "@solana/web3.js";
import { nftStorage } from "@metaplex-foundation/js/packages/js-plugin-nft-storage";

function MetaplexConnection(props) {
  const network = props.network;
  const wallet = props.wallet;
  if (wallet) {
    if (network == "mainnet") {
      var connection = new Connection("https://ssc-dao.genesysgo.net/");
      var metaplex = Metaplex.make(connection);

      // metaplex.use(walletAdapterIdentity(wallet)).use(
      //   bundlrStorage({
      //     address: "http://node1.bundlr.network",
      //     providerUrl: "https://ssc-dao.genesysgo.net/",
      //     timeout: 60000,
      //   })
      // );
    }
    if (network == "devnet") {
      var connection = new Connection("https://devnet.genesysgo.net/");
      var metaplex = Metaplex.make(connection);
      // metaplex.use(walletAdapterIdentity(wallet)).use(
      //   bundlrStorage({
      //     address: "https://devnet.bundlr.network",
      //     providerUrl: "https://devnet.genesysgo.net/",
      //     timeout: 60000,
      //   })
      // );
    }
    metaplex.use(walletAdapterIdentity(wallet)).use(
      nftStorage({
        token: process.env.NFT_STORAGE_API,
      })
    );
    // put api key in env
  }

  return { connection, metaplex };
}

export default MetaplexConnection;

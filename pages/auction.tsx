// import {
//   initMarketplaceSDK,
//   AuctionHouse,
//   Nft,
// } from "@holaplex/marketplace-js-sdk";
import { useMemo } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  AuctionHouse,
  AuctionHouseArgs,
  CreateAuctionHouseInstructionAccounts,
  CreateAuctionHouseInstructionArgs,
} from "@metaplex-foundation/mpl-auction-house";
import { Metaplex } from "@metaplex-foundation/js";

const AuctionPage = () => {
  const { publicKey } = useWallet();

  const wallet = useWallet();
  var connection = new Connection("https://devnet.genesysgo.net/");
  const amount = 1 * LAMPORTS_PER_SOL;
  var metaplex = Metaplex.make(connection);

  const onNftListAuction = () => {};

  const onNftBuyAuction = () => {};

  return (
    <>
      <div>
        <h4 className="check console for auction"></h4>
        <button onClick={onCreateAuction}>Create Auction</button>
      </div>
    </>
  );
};

export default AuctionPage;

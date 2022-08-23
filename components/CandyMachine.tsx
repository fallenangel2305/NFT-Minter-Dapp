import { useWallet } from "@solana/wallet-adapter-react";
//import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
// import {
//   Metaplex,
//   toMetaplexFileFromBrowser,
//   walletAdapterIdentity,
//   WRAPPED_SOL_MINT,
//   sol,
//   toBigNumber,
//   lamports,
//   Metadata,
//   isMetadata,
// } from "@metaplex-foundation/js/packages/js";
import { useState } from "react";
//import { bundlrStorage } from "@metaplex-foundation/js";

import { sol, toBigNumber } from "@metaplex-foundation/js";

import MetaplexConnection from "../components/MetaplexConnection";

function CandyMachine(props) {
  // const wallet = props.wallet;
  // const publicKey = props.publicKey;
  // const network = props.network;
  // const { connection, metaplex } = MetaplexConnection({ network, wallet });
  // const authority = metaplex.identity();
  // const findCandyMachine = async (walletAddress) => {
  //   const candyMachine = await metaplex
  //     .candyMachines()
  //     .findAllByWallet(walletAddress)
  //     .run();
  //   return candyMachine;
  // };
  // const createAndInsertItemsToCandyMachine = async (props) => {
  //   const price = props.price;
  //   const sellerFeeBasisPoints = props.sellerFeeBasisPoints;
  //   const itemsAvailable = props.itemsAvailable;
  //   // const isMutable = props.isMutable;
  //   const creators = props.creators;
  //   const { candyMachine, response } = await metaplex
  //     .candyMachines()
  //     .create({
  //       price,
  //       sellerFeeBasisPoints,
  //       itemsAvailable: toBigNumber(itemsAvailable),
  //       isMutable: true,
  //       creators: [{ address: creators, verified: true, share: 100 }],
  //     })
  //     .run();
  //   console.log(candyMachine, response);
  //   const tx = await metaplex
  //     .candyMachines()
  //     .insertItems(candyMachine, {
  //       authority,
  //       items: [
  //         { name: "Degen #1", uri: "https://example.com/degen/1" },
  //         { name: "Degen #2", uri: "https://example.com/degen/2" },
  //       ],
  //     })
  //     .run();
  // };
  // const updateCandyMachine = async (props) => {
  //   const candyMachine = findCandyMachine(publicKey);
  //   const tx = metaplex
  //     .candyMachines()
  //     .update(candyMachine[0], {
  //       authority,
  //       price: sol(2),
  //       sellerFeeBasisPoints: 600,
  //       symbol: "",
  //     })
  //     .run();
  // };
  // const mintFromCandyMachine = async (props) => {
  //   const candyMachine = findCandyMachine(publicKey);
  //   const { nft } = await metaplex.candyMachines().mint(candyMachine[0]).run();
  //   console.log(nft, "new nft minted");
  //   const refreshCandyMachine = await metaplex
  //     .candyMachines()
  //     .refresh(candyMachine[0])
  //     .run();
  //   console.log(refreshCandyMachine, "current candymachine status");
  // };
  // return {
  //   createAndInsertItemsToCandyMachine,
  //   updateCandyMachine,
  //   mintFromCandyMachine,
  // };
}

export default CandyMachine;

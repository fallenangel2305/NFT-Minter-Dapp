import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import React, { useState } from "react";

function HolderChecker(props) {
  const publicKey = props.publicKey;
  const connection = props.connection;
  console.log(process.env.TOKEN_ACCOUNT_TO_SEARCH);

  let tokenBalance: any;
  let mintAddress: any;
  try {
    // @ts-ignore
    async function getTokenAccounts(wallet: any, solanaConnection: Connection) {
      const filters: GetProgramAccountsFilter[] = [
        {
          dataSize: 165, //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32, //location of our query in the account (bytes)
            bytes: wallet, //our search criteria, a base58 encoded string
          },
        },
        {
          memcmp: {
            offset: 0, //number of bytes
            bytes: process.env.TOKEN_ACCOUNT_TO_SEARCH, //base58 encoded string
          },
        },
      ];
      const accounts = await solanaConnection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        { filters: filters }
      );
      // console.log(
      //   `Found ${accounts.length} token account(s) for wallet ${wallet}.`
      // );
      accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo: any = account.account.data;
        mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        tokenBalance =
          parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        // console.log(
        //   `Token Account No. ${i + 1}: ${account.pubkey.toString()}`
        // );
        // console.log(`--Token Mint: ${mintAddress}`);
        // console.log(`--Token Balance: ${tokenBalance}`);
      });
    }
    getTokenAccounts(publicKey.toString(), connection);
  } catch (error) {
    console.log(error);
  }
  return { mintAddress, tokenBalance };
}
export default HolderChecker;

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  GetProgramAccountsFilter,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  Account,
} from "@solana/web3.js";
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
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { lazy, useEffect, useState } from "react";
//import { bundlrStorage } from "@metaplex-foundation/js";
import { create } from "ipfs-http-client";
import {
  Button,
  Form,
  Input,
  Space,
  Switch,
  Tabs,
  Divider,
  notification,
  message,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  InboxOutlined,
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from "@ant-design/icons";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import fs from "fs";
import {
  ListingReceipt,
  createWithdrawFromTreasuryInstruction,
  WithdrawFromTreasuryInstructionAccounts,
  WithdrawFromTreasuryInstructionArgs,
} from "@metaplex-foundation/mpl-auction-house";
import * as core from "@metaplex-foundation/mpl-core";

import * as splToken from "@solana/spl-token";

import React from "react";

import axios from "axios";
import BN from "big-number";
import {
  bundlrStorage,
  Metaplex,
  sol,
  toMetaplexFileFromBrowser,
  walletAdapterIdentity,
  WRAPPED_SOL_MINT,
} from "@metaplex-foundation/js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import MetaplexConnection from "../components/MetaplexConnection";
import HolderChecker from "../components/HolderChecker";
import CandyMachine from "../components/CandyMachine";
import Dragger from "antd/lib/upload/Dragger";
import AuctionHouseFilter from "../components/AuctionHouseFilter";
import * as beet from "@metaplex-foundation/beet";

import nacl from "tweetnacl";
import * as bip39 from "bip39";
import { derivePath } from "ed25519-hd-key";

const { TabPane } = Tabs;
const layout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 20,
  },
};
/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
/* eslint-enable no-template-curly-in-string */

const Home: NextPage = () => {
  const { publicKey, connected, connecting, disconnecting } = useWallet();
  const wallet = useWallet();
  const [mintAddress, setMintAddress] = useState("");
  const [url, setUrl] = useState("");
  const [uploadFile, setUploadFile] = useState();
  const [allNFTsOnchain, setAllNftsOnchain] = useState([]);
  const [allNFTs, setAllNfts] = useState([]);
  const [showNFT, setShowNFT] = useState();

  // const MINT_TO_SEARCH = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; //USDC Mint Address

  //auction

  const AUCTION_HOUSE_PROGRAM_ID = new PublicKey(
    "hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk"
  );

  const AUCTION_PUBKEY = "5nHM2fhir19nk2hXK1fQogYqbDym4sivdWAAurZGSQax";

  var metaData = {
    name: "",
    symbol: "",
    description: "",
    seller_fee_basis_points: 0,
    // image: "" ,
    attributes: [],
    properties: {
      creators: [],
    },
  };
  const [fileUrl, updateFileUrl] = useState(``);
  const [network, setNetwork] = useState(`devnet`);

  // wallet.adapter.connect;
  const { connection, metaplex } = MetaplexConnection({ network, wallet });

  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
  });

  const onFinish = async (values: any) => {
    // console.log(values.user);
    try {
      if (!publicKey) throw new WalletNotConnectedError();
    } catch (err) {
      alert(err);
    }
    metaData["name"] = values.user.name;
    metaData["symbol"] = values.user.symbol;
    // metaData["image"] = fileUrl;

    metaData["description"] = values.user.description;
    metaData["seller_fee_basis_points"] = values.user.royaltySplit * 100;
    metaData["attributes"] = values.user.attributes;
    metaData["properties"].creators = values.user.royalties;
    // console.log(metaData, "metadata");
    // console.log(uploadFile, "upload value");
    try {
      var updatedMetaData = {
        ...metaData,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        image: await toMetaplexFileFromBrowser(uploadFile),
      };
      // console.log(updatedMetaData, "updated metadata");

      const { uri, metadata } = await metaplex
        .nfts()
        .uploadMetadata(updatedMetaData)
        .run();
      // console.log(uri, "metadata uri");
      const { nft } = await metaplex
        .nfts()
        .create({
          uri: uri,
          isMutable: true,
          name: metaData.name,
          symbol: metaData.symbol,
          sellerFeeBasisPoints: metaData.seller_fee_basis_points,
        })
        .run();

      setMintAddress(nft.mint.toString());
      alert("Nft minted sucessfully");
      network
        ? setUrl(
            // "https://solscan.io/token/" + nft.mint.toString() + "?cluster=devnet"
            "https://explorer.solana.com/address/" +
              nft.mint.address.toString() +
              "?cluster=devnet"
          )
        : setUrl(
            // "https://solscan.io/token/" + nft.mint.toString() + "?cluster=devnet"
            "https://explorer.solana.com/address/" + nft.mint.address.toString()
          );
      // window.open(
      //   "https://solscan.io/token/" + nft.mint.toString() + "?cluster=devnet",
      //   "_blank"
      // );
      // console.log(mintAddress, "nft mint");
    } catch (error) {
      alert(error);
    }
  };
  const normFile = (e: { filelist: any }) => {
    console.log("Upload event:", e.filelist);
    // setUploadFile(e.target.file)
    if (Array.isArray(e)) {
      return e;
    }

    return e?.filelist;
  };

  async function onChange(e) {
    let file = e.target.files[0];
    setUploadFile(file);
    console.log(file, "file data");

    // if (file.size > 2000000) {
    //   alert("Image too big max is 2mb");
    // } else {
    //   console.log("upload file", file);
    //   try {
    //     const added = await ipfs.add(file);

    //     console.log("upload file path", added);
    //     const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    //     updateFileUrl(url);
    //   } catch (error) {
    //     console.log("Error uploading file: ", error);
    //   }
    // }
  }

  function onChangeSwitch(checked: any) {
    if (checked) {
      setNetwork("mainnet");
      console.log("in mainnet");
    } else {
      setNetwork("devnet");
      console.log("in devnet");
    }
  }

  // useEffect(() => {
  //   if (connected) {
  //     const { mintAddress, tokenBalance } = HolderChecker({
  //       publicKey,
  //       connection,
  //     });
  //     if (
  //       mintAddress == process.env.TOKEN_ACCOUNT_TO_SEARCH &&
  //       tokenBalance > 0
  //     ) {
  //       console.log("token holder");
  //       setCheckTokenHolder(true);
  //     } else {
  //       console.log("not token holder");
  //       setCheckTokenHolder(true); // change bool false to gain access to mint without token
  //     }
  //   }
  // }, [connected, connection, publicKey]);

  useEffect(() => {
    setCheckTokenHolder(true);
  }, [disconnecting]);

  const onCreateAuction = async (values) => {
    console.log(values.sellerFeeBasisPoints);
    const authority = metaplex.identity();
    const sellerFeeBasisPoints = values.sellerFeeBasisPoints * 100;
    const treasuryMint = values.treasuryMint;
    const feeWithdrawalDestination = values.feeWithdrawalDestination;
    const treasuryWithdrawalDestinationOwner =
      values.treasuryWithdrawalDestinationOwner;

    console.log(
      sellerFeeBasisPoints,
      treasuryMint,
      feeWithdrawalDestination,
      treasuryWithdrawalDestinationOwner
    );
    try {
      const auctionHouse = await metaplex
        .auctions()
        .createAuctionHouse({
          sellerFeeBasisPoints,
          requiresSignOff: false,
          treasuryMint: new PublicKey(treasuryMint),
          authority: authority.publicKey,
          canChangeSalePrice: true,
          feeWithdrawalDestination: new PublicKey(feeWithdrawalDestination),
          treasuryWithdrawalDestinationOwner: new PublicKey(
            treasuryWithdrawalDestinationOwner
          ),
          payer: authority,
        })
        .run();
      console.log(auctionHouse, "Auction house");
    } catch (error) {
      console.log(error);
    }
  };

  const onUpdateAuction = async (values) => {
    const authority = metaplex.identity();
    const auctionAddress = values.auctionAddress;
    const newAuthority = values.newAuthority;
    const sellerFeeBasisPoints = values.sellerFeeBasisPoints * 100;
    const feeWithdrawalDestination = values.feeWithdrawalDestination;
    const treasuryWithdrawalDestinationOwner =
      values.treasuryWithdrawalDestinationOwner;
    console.log(
      auctionAddress,
      sellerFeeBasisPoints,
      feeWithdrawalDestination,
      treasuryWithdrawalDestinationOwner
    );
    try {
      const retrievedAuctionHouse = await metaplex
        .auctions()
        .findAuctionHouseByAddress(new PublicKey(auctionAddress))
        .run();

      console.log(retrievedAuctionHouse.address.toString());

      const auctionHouse = await metaplex
        .auctions()
        .updateAuctionHouse(retrievedAuctionHouse, {
          sellerFeeBasisPoints,
          // newAuthority: new PublicKey(newAuthority), only use when need changing to new address might cause access to auction house
          requiresSignOff: false,
          authority: authority,
          canChangeSalePrice: true,
          feeWithdrawalDestination: new PublicKey(feeWithdrawalDestination),
          treasuryWithdrawalDestinationOwner: new PublicKey(
            treasuryWithdrawalDestinationOwner
          ),
          payer: authority,
        })
        .run();

      console.log(auctionHouse, "Auction house");
    } catch (error) {
      console.log(error);
    }
  };
  const [auctionAddress, setAuctionAddress] = useState("");
  const [auctionFee, setAuctionFee] = useState<any>("");
  const [auctionFeeAccount, setAuctionFeeAccount] = useState<any>("");
  const findAuction = async (values) => {
    try {
      const authority = metaplex.identity();

      // 5nHM2fhir19nk2hXK1fQogYqbDym4sivdWAAurZGSQax

      const publicKey = values.userPublicKey;
      const treasuryMintAddress = values.treasuryMint;
      console.log(publicKey, treasuryMintAddress);
      const retrievedAuctionHouse = await metaplex
        .auctions()
        .findAuctionHouseByCreatorAndMint(
          new PublicKey(publicKey),
          new PublicKey(treasuryMintAddress)
        )
        .run();

      setAuctionAddress(retrievedAuctionHouse.address.toBase58());
      setAuctionFee(retrievedAuctionHouse.sellerFeeBasisPoints.toString());
      setAuctionFeeAccount(retrievedAuctionHouse.feeAccountAddress.toBase58());
      console.log(retrievedAuctionHouse, "auction house address");
    } catch (error) {
      console.log(error);
    }
  };

  const listNft = async (e) => {
    // Stop the form from submitting and refreshing the page.
    e.preventDefault();
    try {
      const authority = metaplex.identity();
      const NFTs = await metaplex
        .nfts()
        .findAllByOwner({ owner: publicKey })
        .run();
      const mintAddress = e.target.mintAddress.value;

      const price = e.target.price.value;
      console.log(mintAddress, "mint address");
      console.log(price, "price");

      console.log(NFTs[0], " nft");
      const auctionHouse = await metaplex
        .auctions()
        .findAuctionHouseByAddress(new PublicKey(AUCTION_PUBKEY))
        .run();

      console.log(auctionHouse.feeAccountAddress.toString(), "fee account");

      const { listing, sellerTradeState, receipt } = await metaplex
        .auctions()
        .for(auctionHouse)
        .list({
          // mintAccount: NFTs[1].mintAddress,
          mintAccount: new PublicKey(mintAddress),
          price: sol(price),
          printReceipt: true,
        })
        .run();

      // const options = {
      //   url: "/api/auction_listing",
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json;charset=UTF-8",
      //   },
      //   data: {
      //     receipt: receipt.toString(),
      //     book_keeper_address: listing.bookkeeperAddress.toString(),
      //     price: listing.price.basisPoints.toNumber().toString(),
      //     seller_address: listing.sellerAddress.toString(),
      //     trade_state_address: listing.tradeStateAddress.toString(),
      //     mint_address: mintAddress,
      //   },
      // };
      // axios(options).then((response) => {
      //   console.log(response.status);
      // });
      // console.log(
      //   listing,
      //   sellerTradeState.toBase58(),
      //   receipt.toBase58(),
      //   "listed nft"
      // );
      console.log("successfully listed your nft");
    } catch (error) {
      console.log(error);
    }
  };

  const [nftState, setNftState] = useState("sell");

  const buyNft = async (e) => {
    e.preventDefault();

    const mintAddress = e.target.mintAddress.value;
    const tradeStateAddress = e.target.tradeStateAddress.value;
    const price = e.target.price.value;
    console.log(mintAddress, price, "mintaddress price");
    const NFTs = await metaplex
      .nfts()
      .findAllByOwner({ owner: publicKey })
      .run();
    const auctionHouse = await metaplex
      .auctions()
      .findAuctionHouseByAddress(new PublicKey(AUCTION_PUBKEY))
      .run();

    try {
      const listing = await metaplex
        .auctions()
        .for(auctionHouse)
        .findListingByAddress(
          new PublicKey(tradeStateAddress) //TradeState
        )
        .run();

      const { bid, buyerTradeState, receipt } = await metaplex
        .auctions()
        .for(auctionHouse)
        .bid({
          // mintAccount: NFTs[1].mintAddress,
          mintAccount: new PublicKey(
            mintAddress // NFT mintAddress
          ),
          price: sol(price),
          printReceipt: true,
        })
        .run();

      if (
        bid.price.basisPoints.toNumber() >= listing.price.basisPoints.toNumber()
      ) {
        const authority = metaplex.identity();
        const tx = await metaplex
          .auctions()
          .for(auctionHouse)
          .executeSale({ bid, listing })
          .run();
        console.log(tx, "purchase txsig");
        // const options = {
        //   url: "/api/auction_remove_listing",
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json;charset=UTF-8",
        //   },
        //   data: {
        //     price: tx.price.basisPoints.toNumber().toString(),
        //     seller_address: tx.seller.toString(),
        //     mint_address: mintAddress,
        //   },
        // };
        // axios(options).then((response) => {
        //   console.log(response.status);
        // });
        // console.log(
        //   tx.receipt.toBase58(),
        //   tx.buyer.toBase58(),
        //   " bought nft from",
        //   tx.seller.toBase58(),
        //   " for ",
        //   tx.price.basisPoints.toNumber() / LAMPORTS_PER_SOL,
        //   "SOL"
        // );
        // return (
        //   <>
        //     <Button
        //       type="primary"
        //       onClick={() => {
        //         notification.info({
        //           message: `You have successfully bought an nft`,
        //           description:
        //             `You bought item id ` +
        //             mintAddress +
        //             ` from ` +
        //             tx.seller.toBase58(),
        //         });
        //       }}
        //     >
        //       <RadiusUprightOutlined />
        //       Notification
        //     </Button>
        //   </>
        // );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [checkTokenHolder, setCheckTokenHolder] = useState(true);
  useEffect(() => {
    if (connected) {
      (async () => {
        try {
          const NFTs = await metaplex
            .nfts()
            .findAllByOwner({ owner: publicKey })
            .run();
          // const jsonNfts = await metaplex.nfts().load(NFTs).run();

          // console.log("nft from owner pubkey ", jsonNfts);

          var nfts = [];
          console.log(NFTs, "nft +++++++++");
          setAllNftsOnchain(NFTs);
          NFTs &&
            NFTs.map(async (nft, i) => {
              await fetch(nft.uri)
                .then((response) => response.json())
                .then(async (data) => {
                  try {
                    //@ts-ignore
                    data.mintAddress = NFTs[i].mintAddress!.toString();

                    // console.log(data, "all data in map");
                    nfts.push(data);
                    if (nfts.length == NFTs.length) {
                      // Array.prototype.push.apply(nfts, NFTs);
                      // console.log(nfts, "onchain+offchain data");
                      setAllNfts(nfts);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                })
                .catch((err) => console.error(err));
              // console.log(allNFTs, "all nfts in map");
            });
        } catch (error) {
          console.log(error);
        }

        // var post;

        // // Call the API
      })();
    } else {
      console.log("wallet not connected");
    }
  }, [connected, network]);

  // @Todo find listing from the blockchain instead from the json
  //

  const cancelListing = async (e) => {
    e.preventDefault();
    const mintAddress = e.target.mintAddress.value;
    const tradeStateAddress = e.target.tradeStateAddress.value;
    console.log(tradeStateAddress);

    const auctionHouse = await metaplex
      .auctions()
      .findAuctionHouseByAddress(new PublicKey(AUCTION_PUBKEY))
      .run();

    try {
      const listing = await metaplex
        .auctions()
        .for(auctionHouse)
        .findListingByAddress(
          new PublicKey(tradeStateAddress) //TradeState
        )
        .run();

      const { response } = await metaplex
        .auctions()
        .for(auctionHouse)
        .cancelListing({ listing })
        .run();
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    try {
      const cancelBid = async () => {
        const receipt = "DXKbL6dGtPLRhQB4xv5FJpUZAYpDgZWScm5F2pNQdudn";

        const auctionHouse = await metaplex
          .auctions()
          .findAuctionHouseByAddress(new PublicKey(AUCTION_PUBKEY))
          .run();

        try {
          const bid = await metaplex
            .auctions()
            .for(auctionHouse)
            .findBidByReceipt(new PublicKey(receipt))
            .run();

          const { response } = await metaplex
            .auctions()
            .for(auctionHouse)
            .cancelBid({ bid })
            .run();
          console.log(response);
        } catch (err) {
          console.log(err);
        }
      };

      cancelBid();
    } catch (error) {
      console.log(error);
    }
  }, [publicKey]);

  const [listedNfts, setListedNfts] = useState([]);
  useEffect(() => {
    setListedNfts([]);
    buildAuctionHouseFilter(AUCTION_PUBKEY);
    return () => {
      setListedNfts([]);
    };
  }, [connected, network]);

  async function buildAuctionHouseFilter(filterString: string) {
    const LISTING_RECEIPT_SIZE =
      8 + //key
      32 + // trade_state
      32 + // bookkeeper
      32 + // auction_house
      32 + // seller
      32 + // metadata
      1 +
      32 + // purchase_receipt
      8 + // price
      8 + // token_size
      1 + // bump
      1 + // trade_state_bump
      8 + // created_at
      1 +
      8; // canceled_at;

    const ListingReceiptPosition = {
      Key: 0,
      TradeState: 8,
      BookKeeper: 8 + 32,
      AuctionHouse: 8 + 32 + 32,
      Seller: 8 + 32 + 32 + 32,
      Metadata: 8 + 32 + 32 + 32 + 32,
    };
    //@ts-ignore
    const filters: any = [
      {
        memcmp: {
          offset: ListingReceiptPosition.AuctionHouse,
          bytes: filterString,
        },
      },

      {
        dataSize: LISTING_RECEIPT_SIZE,
      },
    ];
    try {
      const accounts = await metaplex.connection.getParsedProgramAccounts(
        new PublicKey("hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk"),
        { filters: filters }
      );

      console.log(accounts);

      const auctionHouse = await metaplex
        .auctions()
        .findAuctionHouseByAddress(new PublicKey(AUCTION_PUBKEY))
        .run();
      console.log(auctionHouse?.address?.toString(), "auction pubke");

      for (let i = 0; i < accounts.length; i++) {
        const tradeState = new PublicKey(
          /*@ts-ignore*/
          accounts[i].account.data.slice(8, 8 + 32)
        );
        try {
          const retrieveListing = await metaplex
            .auctions()
            .for(auctionHouse)
            .findListingByAddress(new PublicKey(tradeState))
            .run();

          if (
            retrieveListing.purchaseReceiptAddress == null &&
            retrieveListing.canceledAt == null
          ) {
            console.log(retrieveListing, "retrived listings");

            setListedNfts((listedNfts) => [...listedNfts, retrieveListing]);
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Candy Machine

  const createCandyMachine = async (e) => {
    console.log("im here");

    // const tx = CandyMachine({
    //   wallet,
    //   publicKey,
    //   network,
    // }).createAndInsertItemsToCandyMachine({
    //   price: e.target.price.value,
    //   sellerFeeBasisPoints: e.target.sellerFeeBasisPoints.value * 100,
    //   itemsAvailable: e.target.itemsAvailable.value,
    //   isMutable: e.target.isMutable.value,
    //   creators: e.target.creators.value,
    // });
    // console.log(tx, "candymachine created");
  };

  const uploadToBundlr = (info) => {
    info.fileList.forEach((file) => {
      //paused candymachine for this week
      // const upload = metaplex.storage().upload({});
      console.log(file);
    });
  };

  const props = {
    name: "file",
    multiple: true,

    onChange(info) {
      uploadToBundlr(info);
      const { status } = info.file;

      console.log(info, "info");

      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const onWithdrawFeeAuction = async (values) => {
    const auctionHouse = await metaplex
      .auctions()
      .findAuctionHouseByAddress(new PublicKey(AUCTION_PUBKEY))
      .run();
    console.log(
      "AuctionHouse",
      auctionHouse,
      auctionHouse.treasuryMint.address.toBase58(),
      "Treasury mint",
      auctionHouse.feeAccountAddress.toBase58(),
      "Fee withdraw dest",
      auctionHouse.authorityAddress.toBase58(),
      "Authority",
      auctionHouse.treasuryAccountAddress.toBase58(),
      "Teasury Account"
    );

    const amount: number = values.amount;
    console.log(amount, "amount");

    const accounts: WithdrawFromTreasuryInstructionAccounts = {
      treasuryMint: auctionHouse.treasuryMint.address,
      authority: auctionHouse.authorityAddress,
      treasuryWithdrawalDestination:
        auctionHouse.treasuryWithdrawalDestinationAddress,
      auctionHouseTreasury: auctionHouse.treasuryAccountAddress,
      auctionHouse: auctionHouse.address,
    };
    const args: WithdrawFromTreasuryInstructionArgs = {
      // amount: new BN(Math.ceil(amount * LAMPORTS_PER_SOL)),
      amount: new BN(amount * 10 ** 9),
    };
    console.log(args.amount.toString());

    const tx = createWithdrawFromTreasuryInstruction(accounts, args);
    console.log(tx, "tx");

    const transaction = new Transaction().add(tx);
    const txsig = await wallet.sendTransaction(transaction, connection);
    console.log(txsig, "tx signature");
  };

  const getKeypair = async () => {
    const mnemonic = "";
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const seedBuffer = Buffer.from(seed).toString("hex");
    const path44Change = `m/44'/501'/0'/0'`;
    const derivedSeed = derivePath(path44Change, seedBuffer).key;
    const keypair = new Account(
      nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    );
    console.log(keypair);
  };
  //getKeypair(); this function convert mnemonic phrase to keypair
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.walletButtons}>
        <div style={{ margin: "10px" }}>
          <WalletMultiButton />
        </div>
        {/* <div>
          <Space>
            <span>devnet</span>

            <Switch
              // checkedChildren="mainnet-beta"
              // unCheckedChildren="devnet"

              onChange={onChangeSwitch}
            />

            <span>mainnet</span>
          </Space>
        </div> */}
      </div>
      {connecting ? (
        <h1 className={styles.title}>Loading ... </h1>
      ) : connected && checkTokenHolder ? (
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome </h1>
          <h2>Your PublicKey: {publicKey?.toString()}</h2>
          <h2>Auction PublicKey: {AUCTION_PUBKEY}</h2>

          <p className={styles.description}>
            {/* Get started by editing{" "}
        <code className={styles.code}>pages/index.tsx</code> */}
          </p>
          {/* <button onClick={onCreateAuction}>Create Auction</button> */}

          {/* <button onClick={onUpdateAuction}>Update Auction</button> */}
          {/* <button onClick={findAuction}>Get Auction</button>

          <button onClick={getListing}>Get Listing</button>
          <button onClick={bidNft}>Bid Nft</button> */}
          <Tabs defaultActiveKey="0">
            <TabPane tab="Create Auction House" key="0">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className="nfts">
                    <label>
                      <h2>
                        NB: If you have already created an auction and want to
                        update auction settings please go to next tab.
                      </h2>
                    </label>
                    <>
                      <Form onFinish={onCreateAuction}>
                        <Form.Item
                          label="AuctionHouse Fee(%)"
                          name={["sellerFeeBasisPoints"]}
                          style={{ marginTop: "10px" }}
                          initialValue="2"
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item
                          name={["treasuryMint"]}
                          label="AuctionHouse Currency(mint address of your token)"
                          initialValue="So11111111111111111111111111111111111111112"
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item
                          label="Address to withdraw fee"
                          name={["feeWithdrawalDestination"]}
                          initialValue={publicKey.toBase58()}
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item
                          label="Withdraw fee owner address"
                          name={["treasuryWithdrawalDestinationOwner"]}
                          initialValue={publicKey.toBase58()}
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Create Auction House
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Find Auction House" key="1">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className="nfts">
                    <label>
                      <h2>NB: If you want to find your auction house.</h2>
                    </label>
                    <>
                      <Form onFinish={findAuction}>
                        <Form.Item
                          label="PublicKey used to create auction"
                          name={["userPublicKey"]}
                          style={{ marginTop: "10px" }}
                          initialValue={publicKey.toBase58()}
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item
                          name={["treasuryMint"]}
                          label="AuctionHouse Currency(mint address of your token)"
                          initialValue="So11111111111111111111111111111111111111112"
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Find Auction House
                          </Button>
                        </Form.Item>
                      </Form>
                      {auctionAddress ? (
                        <>
                          <h3>Your auctionhouse address : {auctionAddress}</h3>
                          <h3>Your auctionhouse Fee : {auctionFee / 100}%</h3>
                          <h3>
                            Auction house fee wallet : {auctionFeeAccount}
                          </h3>
                        </>
                      ) : null}
                    </>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Update Auction House" key="2">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className="nfts">
                    <label>
                      <h2>
                        NB: Update your auction settings. Some changes are
                        irreversible.
                      </h2>
                    </label>
                    <>
                      <Form onFinish={onUpdateAuction}>
                        <Form.Item
                          name={["auctionAddress"]}
                          label="AuctionHouse Address"
                        >
                          <Input
                            required
                            placeholder="5nHM2fhir19nk2hXK1fQogYqbDym4sivdWAAurZGSQax"
                          />
                        </Form.Item>
                        {/* <Form.Item
                          name={["newAuthority"]}
                          label="Change Auction House Owner"
                          
                        >
                          <Input required placeholder="5nHM2fhir19nk2hXK1fQogYqbDym4sivdWAAurZGSQax" />
                        </Form.Item> */}
                        <Form.Item
                          label="AuctionHouse Fee(%)"
                          name={["sellerFeeBasisPoints"]}
                          style={{ marginTop: "10px" }}
                          initialValue="2"
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item
                          label="Address to withdraw fee"
                          name={["feeWithdrawalDestination"]}
                          initialValue={publicKey.toBase58()}
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item
                          label="Withdraw fee owner address"
                          name={["treasuryWithdrawalDestinationOwner"]}
                          initialValue={publicKey.toBase58()}
                        >
                          <Input required />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Update Auction House
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Withdraw Fee" key="3">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className="nfts">
                    <label>
                      <h2>NB: Withdraw Fee.</h2>
                    </label>
                    <>
                      <Form onFinish={onWithdrawFeeAuction}>
                        <Form.Item
                          label="Withdraw fee amount"
                          name={["amount"]}
                        >
                          <Input placeholder="1" required />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Withdraw Fee
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>

          <Tabs defaultActiveKey="0">
            <TabPane tab="Auctions" key="0">
              {/* <div className={styles.grid}> */}
              {/* <div className={styles.card}> */}
              <div
                className="nfts"
                style={{
                  display: "inline-grid",
                  gridTemplateColumns: "repeat(2,2fr)",
                  columnGap: "10px",
                }}
              >
                <>
                  {/* <Auction /> */}
                  {listedNfts &&
                    listedNfts.map((n, i) => (
                      <div className={styles.card} key={i}>
                        <>
                          {/* {console.log(allNFTs, "nfts here")} */}
                          <h3 key={i}>{n.asset.mint.address.toString()}</h3>
                          <img
                            src={n?.asset?.json?.image}
                            alt="nft image"
                            style={{ height: 250, width: 250 }}
                            // height={250}
                            // width={250}
                            key={i + 1}
                          />
                          <h1 key={i + 2}>{n?.asset?.name}</h1>
                          <h3 key={i + 3}>{n?.asset?.symbol}</h3>
                          <h3 key={i + 4}>{n?.asset?.description}</h3>

                          <h2 key={i + 5}>
                            {n?.price?.basisPoints.toNumber() /
                              LAMPORTS_PER_SOL}{" "}
                            {n?.currency}
                          </h2>
                          <h3 key={i + 6}>
                            Seller: {n?.sellerAddress?.toString()}
                          </h3>

                          {/* {console.log(n, "nfts here")} */}
                          {n?.sellerAddress == publicKey.toString() ? (
                            <form onSubmit={cancelListing}>
                              <label>
                                <Input
                                  name="mintAddress"
                                  type={"hidden"}
                                  value={n?.asset?.mint?.address.toString()}
                                />
                                <Input
                                  name="tradeStateAddress"
                                  type={"hidden"}
                                  value={n?.tradeStateAddress.toString()}
                                />
                                <Input
                                  name="price"
                                  type={"hidden"}
                                  required
                                  value={
                                    n?.price?.basisPoints.toNumber() /
                                    LAMPORTS_PER_SOL
                                  }
                                  min={0.001}
                                />
                              </label>

                              <input
                                name="submit"
                                type="submit"
                                value="Cancel Listing"
                              />
                            </form>
                          ) : (
                            <form onSubmit={buyNft}>
                              <label>
                                <Input
                                  name="mintAddress"
                                  type={"hidden"}
                                  value={n?.asset?.mint?.address.toString()}
                                />
                                <Input
                                  name="tradeStateAddress"
                                  type={"hidden"}
                                  value={n?.tradeStateAddress.toString()}
                                />
                                <Input
                                  name="price"
                                  type={"hidden"}
                                  required
                                  value={
                                    n?.price?.basisPoints.toNumber() /
                                    LAMPORTS_PER_SOL
                                  }
                                  min={0.001}
                                />
                              </label>

                              <input name="submit" type="submit" value="Buy" />
                            </form>
                          )}
                        </>
                      </div>
                    ))}
                </>

                {/* <Image src={image} alt="nft image"></Image> */}
              </div>
              {/* </div> */}
              {/* </div> */}
            </TabPane>

            <TabPane tab="Single Mint" key="1">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <Form
                    {...layout}
                    name="nest-messages"
                    onFinish={onFinish}
                    validateMessages={validateMessages}
                  >
                    <Form.Item
                      name={["user", "upload"]}
                      label="Upload"
                      valuePropName="filelist"
                      getValueFromEvent={normFile}
                      extra="upload image for nft"
                    >
                      <input type="file" onChange={onChange} />
                    </Form.Item>

                    <Form.Item
                      name={["user", "name"]}
                      label="NFT Name"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={["user", "symbol"]}
                      label="NFT Symbol"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={["user", "description"]}
                      label="NFT Description"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="attributes" label="Attributes"></Form.Item>
                    <Form.List name={["user", "attributes"]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space
                              key={key}
                              style={{
                                display: "flex",
                                marginBottom: 4,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "trait_type"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter trait",
                                  },
                                ]}
                              >
                                <Input placeholder="trait" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "value"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter trait value",
                                  },
                                ]}
                              >
                                <Input placeholder="value" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add field
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    <Form.Item
                      name={["user", "royaltySplit"]}
                      label="Royalties(%)"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.List name={["user", "royalties"]}>
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space
                              key={key}
                              style={{
                                display: "flex",
                                marginBottom: 4,
                              }}
                              align="baseline"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, "address"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter creator publicKey",
                                  },
                                ]}
                              >
                                <Input placeholder="Creator PublicKey" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, "share"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Enter royality percentage",
                                  },
                                ]}
                              >
                                <Input placeholder="Royality Percentage" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() => remove(name)}
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add field
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                      <Button type="primary" htmlType="submit">
                        Mint
                      </Button>
                    </Form.Item>
                  </Form>
                </div>

                {!!mintAddress ? (
                  // <h3>
                  //   <a href={url} target="_blank" rel="noreferrer">
                  //     view in solscan
                  //   </a>
                  // </h3>
                  <div className={styles.card}>
                    <iframe
                      src={url}
                      height="1170"
                      width="600"
                      title="Iframe Example"
                    ></iframe>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </TabPane>
            <TabPane tab="Collection Mint" key="2">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <Form>
                    <div>
                      <a
                        href="https://collections.metaplex.com/"
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        <h1>Create Collection</h1>
                      </a>
                    </div>
                  </Form>
                </div>

                {!!mintAddress ? (
                  // <h3>
                  //   <a href={url} target="_blank" rel="noreferrer">
                  //     view in solscan
                  //   </a>
                  // </h3>
                  <div className={styles.card}>
                    <iframe
                      src={url}
                      height="1170"
                      width="600"
                      title="Iframe Example"
                    ></iframe>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </TabPane>
            <TabPane tab="My nfts" key="3">
              {/* <div className={styles.grid}> */}
              {/* <div className={styles.card}> */}
              <div
                className="nfts"
                style={{
                  display: "inline-grid",
                  gridTemplateColumns: "repeat(2,4fr)",
                  columnGap: "10px",
                }}
              >
                {allNFTs &&
                  allNFTs.map((n, i) => (
                    <div className={styles.card} key={i}>
                      <>
                        {/* {console.log(allNFTs, "nfts here")} */}
                        <img
                          src={n.image}
                          alt="nft image"
                          style={{ height: 250, width: 250 }}
                          // height={250}
                          // width={250}
                          key={i + 1}
                        />
                        <h1 key={i + 2}>{n.name}</h1>
                        <h3 key={i + 3}>{n.symbol}</h3>
                        <h3 key={i + 4}>{n.description}</h3>
                        <h3 key={i + 5}>{n.mintAddress}</h3>
                        {/* {console.log(n, "nfts here")} */}

                        <form onSubmit={listNft}>
                          <label>
                            price:
                            <Input
                              name="mintAddress"
                              type={"hidden"}
                              value={n.mintAddress}
                            />
                            <Input
                              name="price"
                              type="text"
                              required
                              min={0.001}
                            />
                          </label>

                          <input name="submit" type="submit" value="Sell" />
                        </form>
                      </>
                    </div>
                  ))}

                {/* <Image src={image} alt="nft image"></Image> */}
              </div>
              {/* </div> */}
              {/* </div> */}
            </TabPane>
            <TabPane tab="Create CandyMachine" key="4">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className="cndyMachine">
                    <>
                      <Form onFinish={createCandyMachine}>
                        <Dragger {...props}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">
                            Click or drag file to this area to upload
                          </p>
                          <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                          </p>
                        </Dragger>
                        <Form.Item
                          label="Mint price "
                          style={{ marginTop: "10px" }}
                        >
                          <Input placeholder="1" />
                        </Form.Item>
                        <Form.Item label="Seller fee(%)">
                          <Input placeholder="8" />
                        </Form.Item>
                        <Form.Item label="Number of nfts">
                          <Input placeholder="20" />
                        </Form.Item>
                        <Form.Item label="Creators">
                          <Input placeholder={publicKey.toBase58()} />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
                    </>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="Launchpad" key="5">
              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className="launchpad">
                    <></>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </main>
      ) : !connected ? (
        <main className={styles.main}>
          <h1 className={styles.title}>Connect your wallet </h1>
          {/* <h2>{publicKey?.toString()}</h2> */}

          <p className={styles.description}>
            {/* Get started by editing{" "}
  <code className={styles.code}>pages/index.tsx</code> */}
          </p>
        </main>
      ) : (
        <main className={styles.main}>
          <h1 className={styles.title}>You are not a token holder </h1>
          {/* <h2>{publicKey?.toString()}</h2> */}

          <p className={styles.description}>
            {/* Get started by editing{" "}
  <code className={styles.code}>pages/index.tsx</code> */}

            <a
              href="https://famousfoxes.com/tokenmarket"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              buy $FOXY
            </a>
          </p>
        </main>
      )}

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="mvp-apps" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;

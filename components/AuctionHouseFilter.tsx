import { ListingReceipt } from "@metaplex-foundation/mpl-auction-house";
import { PublicKey } from "@solana/web3.js";
function AuctionHouseFilter(props) {
  const metaplex = props.metaplex;
  const auctionPubkey = props.AUCTION_PUBKEY;

  let retrieveListings: string;
  async function auctionHouseListingFilter(props) {
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

    const filters: any = [
      {
        memcmp: {
          offset: ListingReceiptPosition.AuctionHouse,
          bytes: auctionPubkey,
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

      // console.log(accounts);

      const auctionHouse = await metaplex
        .auctions()
        .findAuctionHouseByAddress(new PublicKey(auctionPubkey))
        .run();
      // console.log(auctionHouse?.address?.toString(), "auction pubkey");

      accounts.forEach(async (account, i) => {
        try {
          // console.log(account.pubkey.toBase58(), "account.pubkey");
          ListingReceipt.fromAccountAddress(
            metaplex.connection,
            account.pubkey
          ).then(async (listings) => {
            if (
              (listings.tradeState && listings.canceledAt != null) ||
              (undefined && listings.purchaseReceipt != null) ||
              undefined
            ) {
              // throw new Error(
              //   `Unable to find ListingReceipt account at ${listings}`
              // );
              // console.log(
              //   `Unable to find ListingReceipt account at ${listings.tradeState.toBase58()}`
              // );
            } else {
              // console.log(listings.tradeState);
              try {
                retrieveListings = await metaplex
                  .auctions()
                  .for(auctionHouse)
                  .findListingByAddress(new PublicKey(listings.tradeState))
                  .run();

                return { retrieveListings };
              } catch (error) {
                console.log(error);
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  auctionHouseListingFilter(auctionPubkey);
  // console.log(retrieveListings, "retrieveListings");
  console.log(retrieveListings, "retrieveListings");
  return { retrieveListings };
}

export default AuctionHouseFilter;

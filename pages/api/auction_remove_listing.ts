const fs = require("fs");
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    fs.readFile("pages/api/data/auction.json", "utf8", (err, jsonString) => {
      var data = JSON.parse(jsonString);

      // remove the contents of old listed nfts
      const index = data.listed_nfts.findIndex(
        (item) => item.mint_address === req.body.mint_address
      );

      data.listed_nfts.splice(index, 1);
      // push the new updated array to listed nfts

      fs.writeFile(
        "pages/api/data/auction.json",
        JSON.stringify(data, null, 4),
        "utf8",
        (err) => {
          if (err) console.log("Error writing file:", err);
          return res.status(400).json({ status: err });
        }
      );
    });

    return res.status(200).json({ status: "data written" });
  }
}

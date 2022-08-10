const fs = require("fs");
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // fs.writeFileSync(
    //   "pages/api/data/auction.json",
    //   JSON.stringify(req.body, null, 4)
    // );

    fs.readFile("pages/api/data/auction.json", "utf8", (err, jsonString) => {
      var data = JSON.parse(jsonString);

      data.listed_nfts.push(req.body);
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
  } else if (req.method === "GET") {
    // const auctionData = await fs.readFileSync("pages/api/data/auction.json");
    fs.readFile("pages/api/data/auction.json", "utf8", (err, jsonString) => {
      if (err) {
        console.log("status:", err);
        return res.status(400).json({ error: err });
      }
      console.log("File data:", jsonString);
      return res.status(200).json(JSON.parse(jsonString));
    });

    // return auctionData;
  }
}

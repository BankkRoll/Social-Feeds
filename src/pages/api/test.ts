// pages/api/test.ts
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Query Parameters:", req.query);
  res.json({ query: req.query });
};

export default handler;

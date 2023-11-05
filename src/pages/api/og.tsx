import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          backgroundColor: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="/testr.png" style={{ width: "600px", height: "300px" }} />
        <div style={{ color: "white", fontSize: "40px", marginTop: "20px" }}>
          {String(slug)}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
};

export default handler;

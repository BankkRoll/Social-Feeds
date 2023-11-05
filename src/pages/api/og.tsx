import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userName, avatarUrl, bannerUrl } = req.query;

  return new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", position: "relative" }}>
        <img
          src={String(bannerUrl)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            color: "white",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            src={String(avatarUrl)}
            style={{ borderRadius: "50%", marginRight: "10px" }}
          />
          <span style={{ fontSize: "24px", marginRight: "10px" }}>
            {String(userName)}
          </span>
        </div>
        <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
          <img src="/testr.png" style={{ width: "60px", height: "60px" }} />
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
};

export default handler;

import { ImageResponse } from "@vercel/og";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const requestUrl = req.url || "";
    const { searchParams } = new URL(requestUrl, `http://${req.headers.host}`);
    const slug = searchParams.get("slug") || "Developed By Bankk";

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
            justifyContent: "space-between",
            padding: "40px",
            position: "relative",
          }}
        >
          <img
            src="https://socialfeeds.vercel.app/testr.png"
            style={{ width: "600px", height: "200px", marginTop: "120px" }}
          />
          <div
            style={{
              alignSelf: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                color: "white",
                fontSize: "40px",
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              {slug}
            </div>
            <div
              style={{
                color: "#1a1a1a",
                backgroundColor: "white",
                fontSize: "25px",
                padding: "10px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              View My SocialFeed!
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "25px",
              right: "10px",
              color: "white",
              fontSize: "12px",
              display: "flex",
            }}
          >
            <div>socialfeeds.vercel.app/</div>
            <div>{slug}</div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              color: "white",
              fontSize: "12px",
              display: "flex",
            }}
          >
            <div>Build Your Own SocialFeed Now!</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (error) {
    console.error(error);
  }
};

export default handler;

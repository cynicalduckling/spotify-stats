import AuthToken from "@/models/token";
import dbConnect from "@/utils/mongo-connect";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnect();
    const data: { key: string; spotify_user_id: string } = await request.json();

    if (data.key !== process.env.NEXTAUTH_SECRET) {
      throw new Error("Unknown request");
    }
    let userToken = await AuthToken.findOne({
      spotify_user_id: data.spotify_user_id,
    });

    if (!userToken) {
      throw new Error("no token found in db");
    }

    if (userToken.valid_until < Date.now()) {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: userToken.refresh_token,
          client_id: process.env.AUTH_SPOTIFY_ID as string,
        }),
      });
      let result = await response.json();
      result = await AuthToken.findOneAndUpdate(
        { refresh_token: userToken.refresh_token },
        {
          valid_until: Date.now() + result.expires_in * 1000,
          refresh_token: result.refresh_token,
          access_token: result.access_token,
        }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

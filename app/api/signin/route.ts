import AuthToken from "@/models/token";
import dbConnect from "@/utils/mongo-connect";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    await dbConnect();
    const data: { key: string; account: Record<string, any> } =
      await request.json();
    if (data.key !== process.env.NEXTAUTH_SECRET) {
      throw new Error("Unknown request");
    }
    await AuthToken.findOneAndUpdate(
      { spotify_user_id: data.account.providerAccountId },
      {
        valid_until: (data.account.expires_at as number) * 1000,
        refresh_token: data.account.refresh_token,
        access_token: data.account.access_token,
      }
    );
    const user = await AuthToken.findOne({
      spotify_user_id: data.account.providerAccountId,
    });

    if (user === null) {
      await AuthToken.create({
        spotify_user_id: data.account.providerAccountId,
        valid_until: data.account.expires_at,
        refresh_token: data.account.refresh_token,
        access_token: data.account.access_token,
      });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};

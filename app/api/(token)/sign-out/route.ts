import { NextResponse, type NextRequest } from "next/server";
import { spotifySignOut } from "@/actions/spotify-auth";
import { appUrl } from "@/utils/helper";

export async function GET(request: NextRequest) {
  await spotifySignOut();
  return NextResponse.redirect(appUrl);
}

import { NextApiResponse } from "next";
import { redirect } from "next/dist/server/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { urlBuilder } from "@/utils/helper";

const CLIENT_ID = "8084204bed4a42cabbd55dab98dce7fd";
const CLIENT_SECRET = "eb6d7f71cef04c90a8e46abdc809059a";

export async function GET(request: NextRequest, response: NextApiResponse) {
  let searchParams = request.nextUrl.searchParams;
  const params = {
    error: searchParams.get("error"),
    code: searchParams.get("code"),
    state: searchParams.get("state"),
  };

  if (params.error !== null) {
    console.log("error with oath");
    redirect(response, 404, "http://localhost:3000");
  }

  let auth = Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

  let body = new URLSearchParams();

  body.set("grant_type", "authorization_code");
  body.set("code", params.code as string);
  body.set("redirect_uri", "http://localhost:3000/api/login");

  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + auth,
  };

  let tokenResponse = await fetch(
    urlBuilder("https://accounts.spotify.com/", ["api", "token"]),
    {
      method: "POST",
      body: body.toString(),
      headers,
    }
  );

  if (tokenResponse.status !== 200) {
    console.log("error with tokenresponse");
    redirect(response, 500, "http://localhost:3000");
  }

  let token = await tokenResponse.json();

  let profileResponse = await fetch(
    urlBuilder("https://api.spotify.com/", ["v1", "me"]),
    {
      headers: { Authorization: `Bearer ${token.access_token}` },
    }
  );

  if (profileResponse.status !== 200) {
    console.log("error with profile response");
    redirect(response, 500, "http://localhost:3000");
  }

  let profile = await profileResponse.json();

  let topTracksResponse = await fetch(
    urlBuilder("https://api.spotify.com/", ["v1", "me", "top", "tracks"]),
    {
      headers: { Authorization: `Bearer ${token.access_token}` },
    }
  );

  if (topTracksResponse.status !== 200) {
    console.log("error with top tracks response");
    console.log(topTracksResponse);
    redirect(response, 500, "http://localhost:3000");
  }

  let topTracks = await topTracksResponse.json();

  let topArtistsResponse = await fetch(
    urlBuilder("https://api.spotify.com/", ["v1", "me", "top", "artists"]),
    {
      headers: { Authorization: `Bearer ${token.access_token}` },
    }
  );

  if (topArtistsResponse.status !== 200) {
    console.log("error with top artists response");
    redirect(response, 500, "http://localhost:3000");
  }

  let topArtists = await topArtistsResponse.json();

  return NextResponse.json(
    { token, profile, topTracks, topArtists },
    { status: 200 }
  );
}

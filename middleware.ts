import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./actions/spotify-auth/auth";
import { Session } from "next-auth";
import { urlBuilder, appUrl } from "./utils/helper";
import { spotifySignOut } from "./actions/spotify-auth";

const url = urlBuilder(["api", "refresh-token"]);
const signOutUrl = urlBuilder(["api", "sign-out"]);
const tracksUrl = urlBuilder(["tracks"]);

export async function middleware(request: NextRequest) {
  const session: Session | null = await auth();
  const sessionUser: boolean = session !== null && session.user ? true : false;

  if (!sessionUser && request.nextUrl.pathname !== "/")
    return NextResponse.redirect(appUrl);

  if (sessionUser) {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        key: process.env.NEXTAUTH_SECRET as string,
        spotify_user_id: session?.user?.id,
      }),
    });
    if (response.status === 200) {
      if (request.nextUrl.pathname === "/")
        return NextResponse.redirect(tracksUrl);

      return NextResponse.next();
    } else {
      return NextResponse.redirect(signOutUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|resources|_next/static|_next/image|favicon.ico).*)"],
};

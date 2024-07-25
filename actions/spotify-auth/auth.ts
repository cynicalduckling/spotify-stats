import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";
import { appUrl, urlBuilder } from "@/utils/helper";

const authUrl = urlBuilder(
  ["en", "authorize"],
  {
    scope:
      "user-top-read user-read-private user-read-email user-read-recently-played",
    client_id: process.env.AUTH_SPOTIFY_ID,
    response_type: "code",
    redirect_uri: new URL("api/auth/callback/spotify", appUrl).href,
  },
  "https://accounts.spotify.com/"
);

const signInUrl = urlBuilder(["api", "signin"]);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Spotify({
      authorization: authUrl,
    }),
  ],
  session: {
    maxAge: 180 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn(signInDetails) {
      const { account } = signInDetails;

      if (account) {
        const response = await fetch(signInUrl, {
          method: "POST",
          body: JSON.stringify({
            key: process.env.NEXTAUTH_SECRET as string,
            account,
          }),
        });
        if (response.status === 200) {
          return true;
        }
      }

      return false;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        //@ts-ignore
        session.user.id = token.id;
      }
      return session;
    },
  },
});

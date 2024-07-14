"use server";
import { signIn, signOut } from "./auth";

export const spotifySignIn = async () => {
  await signIn("spotify", { redirectTo: "/tracks" });
};

export const spotifySignOut = async () => {
  await signOut({ redirectTo: "/" });
};

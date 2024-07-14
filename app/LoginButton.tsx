"use client";
import { spotifySignIn } from "@/actions/spotify-auth";
import { FaSpotify } from "react-icons/fa";

const LoginButton = () => {
  return (
    <button
      className="bg-lime-300 rounded-md border-2 border-black border-b-4 border-r-4 font-bold flex items-center justify-center px-4 py-2 gap-2 hover:scale-95 transition-all duration-300 whitespace-nowrap"
      onClick={() => {
        spotifySignIn();
      }}
    >
      Login with Spotify <FaSpotify className="size-5" />
    </button>
  );
};

export default LoginButton;

"use client";
import { spotifySignOut } from "@/actions/spotify-auth";
import { FaSpotify } from "react-icons/fa";

const LogoutButton = () => {
  return (
    <button
      className="bg-red-300 text-xs md:text-sm font-bold rounded-md border-2 border-black border-b-4 border-r-4 px-4 py-2 hover:scale-95 transition-all duration-300 shadow-lg"
      onClick={() => {
        spotifySignOut();
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;

import dbConnect from "@/utils/mongo-connect";
import AuthToken from "@/models/token";
import { auth } from "@/actions/spotify-auth/auth";
import Link from "next/link";
import { FaSpotify } from "react-icons/fa";

const page = async () => {
  await dbConnect();

  const session = await auth();

  let userToken = await AuthToken.findOne({
    spotify_user_id: session?.user?.id,
  });

  let recentlyPlayed: Record<string, any>[] = [];

  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played`,
    {
      headers: { Authorization: `Bearer ${userToken.access_token}` },
    }
  );

  let currReqData = await response.json();

  recentlyPlayed = recentlyPlayed.concat(currReqData.items);

  while (currReqData.next !== null) {
    const response = await fetch(currReqData.next, {
      headers: { Authorization: `Bearer ${userToken.access_token}` },
    });

    currReqData = await response.json();

    recentlyPlayed = recentlyPlayed.concat(currReqData.items);
  }

  return (
    <>
      <div className="bg-white h-full">
        <div className=" flex flex-col gap-8">
          <div className="text-center font-bold text-2xl">
            Recently Played Tracks
          </div>
          <div className="flex flex-col border-2 border-black border-r-4 border-b-4 bg-lime-300 p-4 gap-4 rounded-md">
            {recentlyPlayed.map((e: Record<string, any>, i: number) => (
              <div key={i} className="flex gap-4">
                <Link
                  className="place-self-center flex flex-col items-center gap-1 hover:scale-95 transition-all"
                  href={e.track.external_urls.spotify}
                  target="_blank"
                >
                  <FaSpotify className="size-4" />
                  <span className="font-bold">#{i + 1}</span>
                </Link>
                <div className="bg-indigo-200 text-center text-xs md:text-sm overflow-hidden font-semibold rounded-md border-2 border-black border-b-4 border-r-4 self-center">
                  <img
                    className="size-8"
                    src={e.track.album.images[0].url}
                    alt=""
                  />
                </div>
                <div className="bg-indigo-300 text-center p-2 text-xs md:text-sm overflow-hidden font-semibold rounded-md border-2 border-black border-b-4 border-r-4 flex-1">
                  {e.track.name + " - " + e.track.artists[0].name}
                </div>
                <div className="bg-teal-300 text-center p-2 text-xs md:text-sm overflow-hidden font-semibold rounded-md border-2 border-black border-b-4 border-r-4">
                  {new Date(String(e.played_at)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

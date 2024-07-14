import dbConnect from "@/utils/mongo-connect";
import AuthToken from "@/models/token";
import { auth } from "@/actions/spotify-auth/auth";
import Link from "next/link";
import { FaSpotify } from "react-icons/fa";

const page = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  await dbConnect();

  const session = await auth();

  let userToken = await AuthToken.findOne({
    spotify_user_id: session?.user?.id,
  });

  const timeRanges = ["short_term", "medium_term", "long_term"];

  const timeRange = !searchParams?.time_range
    ? "short_term"
    : timeRanges.includes(searchParams.time_range as string)
    ? searchParams.time_range
    : "short_term";
  let artistsData: Record<string, any>[] = [];
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}`,
    {
      headers: { Authorization: `Bearer ${userToken.access_token}` },
    }
  );

  let currReqData = await response.json();

  artistsData = artistsData.concat(currReqData.items);

  while (currReqData.next !== null) {
    const response = await fetch(currReqData.next, {
      headers: { Authorization: `Bearer ${userToken.access_token}` },
    });

    currReqData = await response.json();

    artistsData = artistsData.concat(currReqData.items);

    if (artistsData.length >= 40) break;
  }

  return (
    <>
      <div className="bg-white h-full">
        <div className=" flex flex-col gap-8">
          <div className="text-center font-bold text-2xl">Top Artists</div>
          <div className="flex justify-between gap-4 text-xs md:text-sm">
            <Link
              href="/artists?time_range=short_term"
              className={
                "flex-1 text-center p-4 font-bold cursor-pointer rounded-md border-2 border-black border-b-4 border-r-4 hover:scale-95 transition-all duration-300" +
                " " +
                (timeRange === "short_term" ? "bg-lime-300" : "bg-red-300")
              }
            >
              Last 4 Weeks
            </Link>
            <Link
              href="/artists?time_range=medium_term"
              className={
                "flex-1 text-center p-4 font-bold cursor-pointer rounded-md border-2 border-black border-b-4 border-r-4 hover:scale-95 transition-all duration-300" +
                " " +
                (timeRange === "medium_term" ? "bg-lime-300" : "bg-red-300")
              }
            >
              Last 6 months
            </Link>
            <Link
              href="/artists?time_range=long_term"
              className={
                "flex-1 text-center p-4 font-bold cursor-pointer rounded-md border-2 border-black border-b-4 border-r-4 hover:scale-95 transition-all duration-300" +
                " " +
                (timeRange === "long_term" ? "bg-lime-300" : "bg-red-300")
              }
            >
              Last 12 months
            </Link>
          </div>
          <div className="flex flex-col border-2 border-black border-r-4 border-b-4 bg-lime-300 p-4 gap-4 rounded-md">
            {artistsData.map((e: Record<string, any>, i: number) => (
              <div key={i} className="flex gap-4">
                <Link
                  className="place-self-center flex items-center gap-1 hover:scale-95 transition-all"
                  href={e.external_urls.spotify}
                  target="_blank"
                >
                  <FaSpotify className="size-4" />
                  <span className="font-bold">#{i + 1}</span>
                </Link>
                <div className="bg-indigo-200 text-center text-xs md:text-sm overflow-hidden font-semibold rounded-md border-2 border-black border-b-4 border-r-4 self-center">
                  <img className="size-8" src={e.images[0].url} alt="" />
                </div>
                <div className="bg-indigo-300 text-center p-2 text-xs md:text-sm overflow-hidden font-semibold rounded-md border-2 border-black border-b-4 border-r-4 flex-1">
                  {e.name}
                </div>
                <div className="bg-teal-300 text-center p-2 text-xs md:text-sm overflow-hidden font-semibold rounded-md border-2 border-black border-b-4 border-r-4 flex-1">
                  {e.genres.join(", ")}
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
import Link from "next/link";

const CLIENT_ID = "8084204bed4a42cabbd55dab98dce7fd";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black gap-10">
      <div className="bg-gradient-to-r z-30 from-green-400 via-lime-200 to-gray-50 bg-clip-text text-transparent font-extrabold text-5xl pointer-events-none select-none">
        Spotify Stats
      </div>
      <Link
        href={encodeURI(
          `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=user-read-private user-read-email user-top-read&redirect_uri=http://localhost:3000/api/login&state=yolo`
        )}
        target="_blank"
        className="shadow-md px-4 py-2 z-30 font-extrabold text-white bg-spotify-green  rounded-full hover:scale-95 transition-all duration-300"
      >
        Login with Spotify
      </Link>
      <div className="fixed z-20 inset-0">
        <img src="\ssscribble.svg" className="size-full" alt="" />
      </div>
    </main>
  );
}

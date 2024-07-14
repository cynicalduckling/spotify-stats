import dbConnect from "@/utils/mongo-connect";
import LoginButton from "./LoginButton";

export default async function Home() {
  await dbConnect();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white gap-10">
      <div className="border-2 border-black border-b-4 border-r-4 p-4 rounded-md bg-white">
        <span className="font-extrabold text-spotify-green text-5xl pointer-events-none select-none whitespace-nowrap">
          Spotify Stats
        </span>
      </div>
      <LoginButton />
    </main>
  );
}

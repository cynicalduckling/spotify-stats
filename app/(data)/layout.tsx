import Navbar from "@/components/nav/Navbar";

export default function DataLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="bg-white gap-6 px-8 mx-auto flex flex-col w-full justify-center min-h-screen max-w-screen-lg pb-6">
        {children}
      </main>
    </>
  );
}

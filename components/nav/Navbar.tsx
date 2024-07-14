import Link from "next/link";
import LogoutButton from "./LogoutButton";

type NavItem = { label: string; href: string };

const navLinkStyles =
  "bg-lime-300 text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 font-bold rounded-md select-none hover:scale-95 transition-all duration-300 hover:font-extrabold border-2 border-black border-b-4 border-r-4";

const navLinks: NavItem[] = [
  { label: "Tracks", href: "/tracks" },
  { label: "Recently Played", href: "/recently-played" },
  { label: "Artists", href: "/artists" },
];

const Navbar = () => {
  return (
    <nav className="text-black sticky flex items-center bg-white justify-between p-8 max-w-screen-lg mx-auto">
      {navLinks.map((item) => (
        <Link key={item.href} className={navLinkStyles} href={item.href}>
          {item.label}
        </Link>
      ))}
      <LogoutButton />
    </nav>
  );
};

export default Navbar;

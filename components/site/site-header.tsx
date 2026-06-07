import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-black tracking-tight text-white">
          <img src={"/images/boysofadv.png"} width={120} />
        </Link>

        <nav className="hidden items-center font-black gap-6 text-sm uppercase text-white/70 md:flex">
          <a href="/about" className="hover:text-white">About</a>
          <a href="/builds" className="hover:text-white">Builds</a>
          <a href="/partners" className="hover:text-white">Partners</a>
          <a href="/events" className="hover:text-white">Events</a>
          <a
            href="/join"
            className="inline-flex w-fit -skew-x-12 items-center gap-3 bg-red-700 px-7 py-2 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-600"
          >
            Join Us
          </a>
        </nav>

        
      </div>
    </header>
  );
}
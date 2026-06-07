import Link from "next/link";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="text-xl font-medium tracking-tight text-white">
            <img src={"/images/boysofadv.png"} width={150} />
          </Link>
          <p className="mt-2 text-sm font-medium text-white/50">
            Not Your <span className="text-red-400">Ordinary</span> ADV.
          </p>
        </div>

        <div className="flex gap-5 text-sm font-medium text-white/60">
          <a href="#" className="hover:text-white">Facebook</a>
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">TikTok</a>
        </div>
      </div>
    </footer>
  );
}
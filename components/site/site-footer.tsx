import { Copyright } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 text-center text-white md:flex-row md:items-center md:justify-between md:text-left">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-wider text-white/50">
            Not Your <span className="text-red-400">Ordinary</span> ADV.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-1 text-xs font-medium text-white/50 md:justify-start">
            <Copyright className="size-4 shrink-0" />
            <span>2026</span>
            <span className="font-semibold text-white/70">Boys of ADV</span>
            <span>|</span>
            <span>All rights reserved.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-bold uppercase tracking-wider text-white/60 md:justify-end">
          <a href="#" className="transition hover:text-white">
            Facebook
          </a>
          <a href="#" className="transition hover:text-white">
            Instagram
          </a>
          <a href="#" className="transition hover:text-white">
            TikTok
          </a>
        </div>
      </div>
    </footer>
  );
}

import { Copyright } from "lucide-react";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black py-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="mt-2 text-sm font-black text-white/50">
            Not Your <span className="text-red-400">Ordinary</span> ADV.
          </p>
          <div className="flex gap-1 items-center font-medium text-xs">
            <Copyright className="size-4" /> 2026{" "}
            <span className="font-semibold">Boys of ADV</span> | All rights
            reserved.
          </div>
        </div>

        <div className="flex gap-5 text-sm font-medium text-white/60">
          <a href="#" className="hover:text-white">
            Facebook
          </a>
          <a href="#" className="hover:text-white">
            Instagram
          </a>
          <a href="#" className="hover:text-white">
            TikTok
          </a>
        </div>
      </div>
    </footer>
  );
}

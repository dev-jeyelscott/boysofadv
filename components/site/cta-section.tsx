import { ChevronRight } from "lucide-react";
import Image from "next/image";

const ctas = [
  {
    eyebrow: "Ready to ride",
    title: "With us?",
    description: "Be part of the brotherhood. Join Boys of ADV today!",
    button: "Join us now",
    image: "/images/cta-riders.jpg",
  },
  {
    eyebrow: "Grow with",
    title: "Us!",
    description: "Partner with Boys of ADV and let's go further together.",
    button: "Be a partner",
    image: "/images/cta-partner.jpg",
  },
];

export function CtaSection() {
  return (
    <section id="join" className="bg-black px-4 py-10 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2">
        {ctas.map((cta) => (
          <div
            key={cta.button}
            className="group relative min-h-55 overflow-hidden border border-red-700/70 bg-neutral-950"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45 grayscale transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${cta.image})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
            <div className="absolute inset-0 border border-red-950/60" />

            <div className="relative z-10 flex h-full flex-col justify-center px-8 py-8 sm:px-10">
              <p className="text-2xl font-black uppercase italic tracking-wide text-white sm:text-3xl">
                {cta.eyebrow}
              </p>

              <h2 className="mt-1 text-5xl font-black uppercase italic leading-none text-red-600 sm:text-6xl">
                {cta.title}
              </h2>

              <p className="mt-5 max-w-xs text-base font-medium leading-relaxed text-white/80">
                {cta.description}
              </p>

              <button className="mt-6 inline-flex w-fit -skew-x-12 items-center gap-3 bg-red-700 px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-600">
                <span className="skew-x-[12deg]">{cta.button}</span>
                <ChevronRight className="h-5 w-5 skew-x-[12deg]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
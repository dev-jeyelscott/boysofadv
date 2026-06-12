import { ChevronRight } from "lucide-react";
import Link from "next/link";

const ctas = [
  {
    eyebrow: "Ready to ride",
    title: "With us?",
    description: "Be part of the brotherhood. Join Boys of ADV today!",
    button: "Join us now",
    image: "/images/cta-riders.webp",
    url: "/sign-up",
  },
  {
    eyebrow: "Grow with",
    title: "Us!",
    description: "Partner with Boys of ADV and let's go further together.",
    button: "Be a partner",
    image: "/images/cta-partner.webp",
    url: "/be-a-partner",
  },
];

export function CtaSection() {
  return (
    <section id="join" className="bg-black px-4 py-8 text-white sm:py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2">
        {ctas.map((cta) => (
          <div
            key={cta.button}
            className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-red-700/70 bg-neutral-950 sm:min-h-[300px] lg:min-h-[260px]"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45 grayscale transition duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${cta.image})` }}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black via-black/85 to-black/25 sm:bg-linear-to-r sm:from-black sm:via-black/80 sm:to-black/20" />
            <div className="absolute inset-0 border border-red-950/60" />

            <div className="relative z-10 flex min-h-[260px] flex-col justify-end px-5 py-6 sm:min-h-[300px] sm:px-8 sm:py-8 lg:min-h-[260px] lg:justify-center">
              <p className="text-xl font-black uppercase italic tracking-wide text-white sm:text-3xl">
                {cta.eyebrow}
              </p>

              <h2 className="mt-1 text-4xl font-black uppercase italic leading-none text-red-600 sm:text-6xl">
                {cta.title}
              </h2>

              <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-white/80 sm:mt-5 sm:text-base">
                {cta.description}
              </p>

              <Link
                href={cta.url}
                className="mt-6 inline-flex w-full -skew-x-12 items-center justify-center gap-3 bg-red-700 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-600 sm:w-fit sm:px-7"
              >
                <span className="skew-x-12">{cta.button}</span>
                <ChevronRight className="h-5 w-5 skew-x-12" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

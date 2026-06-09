import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Boys of ADV"
          fill
          priority
          className="object-cover opacity-100"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/30" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[750px] max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-[4px] w-16 bg-red-600" />
              <span className="text-sm font-bold uppercase tracking-[0.35em] text-white">
                Boys of <span className="text-red-600">ADV</span>
              </span>
            </div>

            <h1 className="leading-none">
              <span className="block text-5xl font-black uppercase text-white md:text-7xl">
                Not Your
              </span>

              <span className="block text-5xl italic font-black uppercase text-red-600 md:text-7xl">
                Ordinary
              </span>

              <span className="block text-5xl font-black uppercase text-white md:text-7xl">
                ADV
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg text-white/70">
              One Brotherhood. One Passion. Endless Roads.
            </p>

            <div className="mt-10 flex md:justify-start justify-center flex-wrap gap-4">
              <Link
                href="#join"
                className="mt-6 inline-flex w-fit -skew-x-12 items-center gap-3 bg-red-700 px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-600"
              >
                Join the Brotherhood
              </Link>

              <Link
                href="#events"
                className="mt-6 inline-flex w-fit -skew-x-12 items-center gap-3 bg-none hover:border-red-500 border border-white px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white/20"
              >
                Upcoming Meet & Greet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

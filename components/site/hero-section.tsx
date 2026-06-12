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
          quality={75}
          priority
          className="object-cover object-center opacity-80"
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/70 to-black md:bg-linear-to-r md:from-black md:via-black/80 md:to-black/30" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[calc(100svh-80px)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:min-h-187.5 lg:py-6">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <div className="mb-5 flex items-center justify-center gap-3 lg:justify-start">
              <div className="h-1 w-10 bg-red-600 sm:w-16" />
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-white sm:text-sm sm:tracking-[0.35em]">
                Boys of <span className="text-red-600">ADV</span>
              </span>
            </div>

            <h1 className="leading-none">
              <span className="block text-4xl font-black uppercase text-white sm:text-5xl md:text-7xl">
                Not Your
              </span>

              <span className="block text-4xl font-black italic uppercase text-red-600 sm:text-5xl md:text-7xl">
                Ordinary
              </span>

              <span className="block text-4xl font-black uppercase text-white sm:text-5xl md:text-7xl">
                ADV
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-md text-base text-white/70 sm:text-lg lg:mx-0">
              One Brotherhood. One Passion. Endless Roads.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <Link
                href="#join"
                className="inline-flex w-full -skew-x-12 items-center justify-center gap-3 bg-red-700 px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-white transition hover:bg-red-600 sm:w-fit sm:px-7"
              >
                Join the Brotherhood
              </Link>

              <Link
                href="#events"
                className="inline-flex w-full -skew-x-12 items-center justify-center gap-3 border border-white bg-transparent px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-white transition hover:border-red-500 hover:bg-white/20 sm:w-fit sm:px-7"
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

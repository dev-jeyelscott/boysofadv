import { CtaSection } from "@/components/site/cta-section";
import { EventsSection } from "@/components/site/events-section";
import { FeaturedBuildsSection } from "@/components/site/featured-builds-section";
import { HeroSection } from "@/components/site/hero-section";
import { AboutMissionVisionSection } from "@/components/site/about-mission-vision-section";
import { PartnersSection } from "@/components/site/partners-section";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />
      <HeroSection />
      <AboutMissionVisionSection />
      <FeaturedBuildsSection />
      <PartnersSection />
      <EventsSection />
      <CtaSection />
      <SiteFooter />
    </main>
  );
}

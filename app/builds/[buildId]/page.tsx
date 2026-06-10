import Image from "next/image";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";

import { SiteHeader } from "@/components/site/site-header";
import { db } from "@/db/db";
import { builds, galleryImages, users } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { BuildGallery } from "../build-gallery";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    buildId: string;
  }>;
};

function valueOrDash(value?: string | null) {
  return value && value.trim() !== "" ? value : "—";
}

function getOwnerName(build: {
  ownerFirstName: string | null;
  ownerLastName: string | null;
  ownerNickname: string | null;
  ownerCodename: string | null;
}) {
  const fullName = [build.ownerFirstName, build.ownerLastName]
    .filter(Boolean)
    .join(" ");

  return (
    build.ownerCodename || build.ownerNickname || fullName || "Unknown Rider"
  );
}

export default async function BuildDetailsPage({ params }: Props) {
  const { buildId } = await params;

  const [build] = await db
    .select({
      id: builds.id,
      title: builds.title,
      status: builds.status,
      isFeatured: builds.isFeatured,
      coverImageUrl: builds.coverImageUrl,

      motorcycleModel: builds.motorcycleModel,
      engineSetup: builds.engineSetup,
      cvtSetup: builds.cvtSetup,
      suspensionSetup: builds.suspensionSetup,
      brakingSetup: builds.brakingSetup,
      wheelSetup: builds.wheelSetup,
      description: builds.description,
      accessories: builds.accessories,

      ownerFirstName: users.firstName,
      ownerLastName: users.lastName,
      ownerNickname: users.nickname,
      ownerCodename: users.codename,
      ownerAvatarUrl: users.avatarUrl,
      ownerUnit: users.unit,
      ownerChapter: users.chapter,
    })
    .from(builds)
    .leftJoin(users, eq(builds.userId, users.id))
    .where(eq(builds.id, buildId))
    .limit(1);

  if (!build || build.status !== "published") {
    notFound();
  }

  const ownerName = getOwnerName(build);

  const buildImages = await db
    .select({
      id: galleryImages.id,
      imageUrl: galleryImages.imageUrl,
      caption: galleryImages.caption,
    })
    .from(galleryImages)
    .where(eq(galleryImages.buildId, buildId))
    .orderBy(asc(galleryImages.createdAt));

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-4 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.22),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-red-600/40" />
            <p className="text-xs font-black uppercase tracking-[0.35em] text-red-500">
              Build Details
            </p>
            <div className="h-px flex-1 bg-red-600/40" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/4">
            <div className="relative aspect-16/8 w-full bg-neutral-900">
              {build.coverImageUrl ? (
                <Image
                  src={build.coverImageUrl}
                  alt={build.title || "Boys of ADV Build"}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm font-bold uppercase tracking-widest text-white/30">
                    No Cover Image
                  </p>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                <div className="mb-4 flex flex-wrap gap-2">
                  {build.isFeatured ? (
                    <Badge className="bg-red-600 text-white hover:bg-red-600">
                      Featured
                    </Badge>
                  ) : null}

                  <Badge className="border-white/10 bg-white/10 text-white hover:bg-white/10">
                    {build.motorcycleModel}
                  </Badge>
                </div>

                <h1 className="max-w-4xl text-4xl font-black uppercase tracking-tight md:text-6xl">
                  {build.title}
                </h1>

                <div className="mt-5 flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full border border-white/15 bg-white/10">
                    {build.ownerAvatarUrl ? (
                      <Image
                        src={build.ownerAvatarUrl}
                        alt={ownerName}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div>
                    <p className="text-sm font-black uppercase">{ownerName}</p>
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/45">
                      {valueOrDash(build.ownerChapter)} /{" "}
                      {valueOrDash(build.ownerUnit)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {build.description ? (
              <div className="border-t border-white/10 p-6 md:p-10">
                <h2 className="text-xl font-black uppercase">Build Story</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/65">
                  {build.description}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {build.engineSetup ? (
              <div className="border-t border-white/10 p-6 md:p-10">
                <h2 className="text-xl font-black uppercase">Engine Build</h2>
                <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/65">
                  {build.engineSetup}
                </p>
              </div>
            ) : null}
            {build.cvtSetup ? (
              <div className="border-t border-white/10 p-6 md:p-10">
                <h2 className="text-xl font-black uppercase">CVT Setup</h2>
                <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/65">
                  {build.cvtSetup}
                </p>
              </div>
            ) : null}
            {build.suspensionSetup ? (
              <div className="border-t border-white/10 p-6 md:p-10">
                <h2 className="text-xl font-black uppercase">
                  Suspension Setup
                </h2>
                <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/65">
                  {build.suspensionSetup}
                </p>
              </div>
            ) : null}
            {build.brakingSetup ? (
              <div className="border-t border-white/10 p-6 md:p-10">
                <h2 className="text-xl font-black uppercase">Brake System</h2>
                <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/65">
                  {build.brakingSetup}
                </p>
              </div>
            ) : null}
            {build.wheelSetup ? (
              <div className="border-t border-white/10 p-6 md:p-10">
                <h2 className="text-xl font-black uppercase">
                  Wheels & Mags Setup
                </h2>
                <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/65">
                  {build.wheelSetup}
                </p>
              </div>
            ) : null}
            {build.accessories ? (
              <div className="border-t border-white/10 p-6 md:p-10">
                <h2 className="text-xl font-black uppercase">
                  Other Notable Upgrades
                </h2>
                <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-7 text-white/65">
                  {build.accessories}
                </p>
              </div>
            ) : null}
          </div>
          {buildImages.length > 0 ? (
            <BuildGallery images={buildImages} buildTitle={build.title} />
          ) : null}
        </div>
      </section>
    </main>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { buildId } = await params;

  const [build] = await db
    .select({
      id: builds.id,
      title: builds.title,
      status: builds.status,
      coverImageUrl: builds.coverImageUrl,
      ownerNickname: users.nickname,
      ownerCodename: users.codename,
      ownerFirstName: users.firstName,
      ownerLastName: users.lastName,
    })
    .from(builds)
    .leftJoin(users, eq(builds.userId, users.id))
    .where(eq(builds.id, buildId))
    .limit(1);

  if (!build || build.status !== "published") {
    return {
      title: "Build Not Found | Boys of ADV",
      description: "This motorcycle build could not be found.",
    };
  }

  const ownerName = getOwnerName(build);
  const buildTitle = build.title || "Untitled Build";

  const title = `${buildTitle} | Boys of ADV`;
  const description = `View ${ownerName}'s motorcycle build on Boys of ADV.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: build.coverImageUrl
        ? [
            {
              url: build.coverImageUrl,
              width: 1200,
              height: 630,
              alt: buildTitle,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: build.coverImageUrl ? [build.coverImageUrl] : [],
    },
  };
}

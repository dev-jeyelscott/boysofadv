import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://boysofadv.vercel.app",
      lastModified: new Date(),
    },
    {
      url: "https://boysofadv.vercel.app/about",
      lastModified: new Date(),
    },
    {
      url: "https://boysofadv.vercel.app/builds",
      lastModified: new Date(),
    },
    {
      url: "https://boysofadv.vercel.app/partners",
      lastModified: new Date(),
    },
    {
      url: "https://boysofadv.vercel.app/events",
      lastModified: new Date(),
    },
    {
      url: "https://boysofadv.vercel.app/be-a-partner",
      lastModified: new Date(),
    },
  ];
}

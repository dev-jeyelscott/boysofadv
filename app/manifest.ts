import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Boys of ADV",
    short_name: "Boys of ADV",
    description: "Not Your Ordinary ADV.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#dc2626",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

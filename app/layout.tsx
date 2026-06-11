import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PushNotificationModal } from "@/components/push-notification-modal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://boysofadv.vercel.app"),

  title: {
    default: "Boys of ADV",
    template: "%s | Boys of ADV",
  },

  description:
    "The official Boys of ADV community platform. Discover custom Honda ADV builds, connect with fellow riders, explore events, partners, and the lifestyle behind the ADV scene.",

  keywords: [
    "Boys of ADV",
    "Honda ADV",
    "Honda ADV 160",
    "Honda ADV 150",
    "ADV builds",
    "Motorcycle builds",
    "Scooter lifestyle",
    "Motorcycle community",
    "Custom motorcycles",
    "Philippines motorcycle community",
    "ADV 150 Indo Build",
    "ADV 160 Indo Build",
    "ADV 160 Circuit Concept",
    "ADV 150 Circuit Concept",
    "ADV 160 Malaysian Concept",
    "ADV 150 Malaysian Concept",
    "ADV 160 Track Ready",
    "ADV 150 Track Ready",
    "ADV 160 Thai Concept",
    "ADV 150 Thai Concept",
    "ADV 160 Street Legal",
    "ADV 150 Street Legal",
    "ADV 160 Clean Build",
    "ADV 150 Clean Build",
    "ADV 160 Modifikasi",
    "ADV 150 Modifikasi",
    "ADV Modifikasi",
  ],

  authors: [
    {
      name: "John Leward Escote",
    },
  ],

  creator: "John Leward Escote",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://boysofadv.vercel.app",
    siteName: "Boys of ADV",
    title: "Boys of ADV",
    description:
      "Discover custom ADV builds, events, partners, and the community driving the ADV lifestyle.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Boys of ADV",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Boys of ADV",
    description:
      "Discover custom ADV builds, events, partners, and the community driving the ADV lifestyle.",
    images: ["/images/og-image.jpg"],
  },

  alternates: {
    canonical: "https://boysofadv.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <PushNotificationModal />
        <body className="min-h-screen bg-black text-white">
          {children}

          <Toaster richColors position="top-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}

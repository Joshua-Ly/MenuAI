import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";

const inter = Inter({ subsets: ["latin"] });
const title = "PicMenu – Visualize your menu items with nice images";
const description = "Visualize your menu items with nice images";
const url = "https://www.picmenu.co/";
const ogimage = "https://www.picmenu.co/og-image.png";
const sitename = "picmenu.co";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="picmenu.co" />
      </head>
      <body
        className={`${inter.className} flex flex-col min-h-screen bg-white text-gray-800`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

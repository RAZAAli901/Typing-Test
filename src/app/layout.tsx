import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CrtSettingsProvider } from "@/lib/CrtSettingsContext";
import RetroFrame from "@/components/RetroFrame";
import AppClientWrapper from "@/components/AppClientWrapper";
// SECURITY AUDIT: Fonts consume Next.js `next/font/google` self-hosted optimization.
// External third-party scripts are strictly consent-gated and disabled prior to user opt-in.
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TypeMaster: Free Online Typing Test and WPM Trainer",
    template: "%s | TypeMaster",
  },
  applicationName: "TypeMaster",
  description:
    "Test and improve your typing speed with TypeMaster. Practice custom modes, analyze detailed accuracy metrics, and compete on the global live leaderboard.",
  openGraph: {
    title: "TypeMaster: Free Online Typing Test and WPM Trainer",
    description:
      "Test and improve your typing speed with TypeMaster. Practice custom modes, analyze detailed accuracy metrics, and compete on the global live leaderboard.",
    url: SITE_URL,
    siteName: "TypeMaster",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeMaster: Free Online Typing Test and WPM Trainer",
    description:
      "Test and improve your typing speed with TypeMaster. Practice custom modes, analyze detailed accuracy metrics, and compete on the global live leaderboard.",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23060606%22/><text y=%2270%22 font-size=%2280%22 font-family=%22monospace%22 fill=%22%2339ff14%22 font-weight=%22bold%22>▮</text></svg>",
  },
  ...(ADSENSE_CLIENT_ID ? { other: { "google-adsense-account": ADSENSE_CLIENT_ID } } : {}),
};

import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { ADSENSE_CLIENT_ID, SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${outfit.variable} ${jetbrainsMono.variable} ${vt323.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <head>
        <JsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('typemaster_booted')==='true'){document.documentElement.setAttribute('data-booted','true');}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-crt-primary/30 selection:text-crt-primary p-2 sm:p-4 md:p-6 bg-zinc-950">
        <SessionProviderWrapper>
          <CrtSettingsProvider>
            <AppClientWrapper>
              <RetroFrame>
                <a
                  href="#main"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-crt-primary focus:text-black focus:font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-crt-primary"
                >
                  Skip to content
                </a>
                <Navbar />
                <main id="main" className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </main>
                <Footer />
              </RetroFrame>
            </AppClientWrapper>
          </CrtSettingsProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

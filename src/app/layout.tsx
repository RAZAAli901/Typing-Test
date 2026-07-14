import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CrtSettingsProvider } from "@/lib/CrtSettingsContext";
import RetroFrame from "@/components/RetroFrame";
import AppClientWrapper from "@/components/AppClientWrapper";

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
  title: "TYPEMASTER_v1 ▮",
  description: "Test, analyze, and master your typing speed and accuracy with global live leaderboards and analytics.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23060606%22/><text y=%2270%22 font-size=%2280%22 font-family=%22monospace%22 fill=%22%2339ff14%22 font-weight=%22bold%22>▮</text></svg>",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${vt323.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-crt-primary/30 selection:text-crt-primary p-2 sm:p-4 md:p-6 bg-zinc-950">
        <CrtSettingsProvider>
          <AppClientWrapper>
            <RetroFrame>
              <Navbar />
              <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <Footer />
            </RetroFrame>
          </AppClientWrapper>
        </CrtSettingsProvider>
      </body>
    </html>
  );
}

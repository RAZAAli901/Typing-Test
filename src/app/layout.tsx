import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, VT323, Press_Start_2P } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CrtSettingsProvider } from "@/lib/CrtSettingsContext";
import RetroFrame from "@/components/RetroFrame";

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
  title: "TypeMaster Web - Speed Typing Platform",
  description: "Test, analyze, and master your typing speed and accuracy with global live leaderboards and analytics.",
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
          <RetroFrame>
            <Navbar />
            <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </RetroFrame>
        </CrtSettingsProvider>
      </body>
    </html>
  );
}

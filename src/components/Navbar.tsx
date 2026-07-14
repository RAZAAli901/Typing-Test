"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [username, setUsername] = useState<string>("Anonymous");

  // Fetch username from localStorage client-side
  useEffect(() => {
    const stored = localStorage.getItem("typemaster_username");
    if (stored) {
      setUsername(stored);
    }

    // Set up a listener for storage changes so the username stays in sync
    const handleStorage = () => {
      const u = localStorage.getItem("typemaster_username");
      if (u) setUsername(u);
    };
    window.addEventListener("storage", handleStorage);
    // Also support custom event for local updates
    window.addEventListener("usernameChanged", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("usernameChanged", handleStorage);
    };
  }, []);

  const navLinks = [
    { href: "/play", label: "PLAY", icon: "⚡" },
    { href: "/leaderboard", label: "LEADERBOARD", icon: "🏆" },
    { href: "/stats", label: "STATS", icon: "📊" },
    { href: "/about", label: "ABOUT", icon: "ℹ️" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-crt-dim/40 bg-[#060606]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group font-press-start text-[10px] md:text-[12px]">
          <span className="text-crt-primary drop-shadow-[0_0_4px_var(--color-crt-primary)] animate-pulse">⚡</span>
          <span className="tracking-tight text-white group-hover:text-crt-primary group-hover:drop-shadow-[0_0_5px_var(--color-crt-primary)] transition-all">
            TYPEMASTER <span className="text-crt-primary font-black">v1.0</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 font-vt323 text-lg md:text-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2 py-1 transition-all duration-200 relative ${
                  isActive
                    ? "text-crt-primary drop-shadow-[0_0_4px_var(--color-crt-primary)] font-bold"
                    : "text-crt-dim hover:text-crt-primary hover:drop-shadow-[0_0_4px_var(--color-crt-primary)]"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-crt-primary shadow-[0_0_6px_var(--color-crt-primary)] animate-[blink_0.8s_infinite]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Identity HUD */}
        <div className="flex items-center gap-4 font-vt323 text-lg md:text-xl">
          <div className="flex items-center gap-2 bg-[#0a0a0a] border border-crt-dim/50 rounded px-3 py-1 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
            <span className="text-sm">👤</span>
            <span className="font-bold text-crt-primary tracking-wide max-w-[120px] truncate" title={username}>
              {username}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Link List */}
      <div className="md:hidden flex justify-around border-t border-crt-dim/30 bg-[#060606]/95 py-2 font-vt323 text-base">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-0.5 transition-all duration-200 ${
                isActive ? "text-crt-primary drop-shadow-[0_0_4px_var(--color-crt-primary)]" : "text-crt-dim hover:text-crt-primary"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

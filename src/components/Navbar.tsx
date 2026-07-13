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
    { href: "/play", label: "Play", icon: "⚡" },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { href: "/stats", label: "Stats", icon: "📊" },
    { href: "/about", label: "About", icon: "ℹ️" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl animate-pulse">⚡</span>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            TypeMaster <span className="text-cyan-400 font-light">Web</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  isActive
                    ? "text-cyan-400 bg-cyan-950/30 border border-cyan-800/30"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Identity HUD */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-full py-1.5 px-4">
            <span className="text-sm">👤</span>
            <span className="text-xs font-semibold text-slate-300 max-w-[120px] truncate" title={username}>
              {username}
            </span>
          </div>
          {/* Mobile menu trigger button or toggle could go here if needed */}
        </div>
      </div>

      {/* Mobile Nav Link List (always render, stacked design, visible on small screen) */}
      <div className="md:hidden flex justify-around border-t border-white/5 bg-slate-950/95 py-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
                isActive ? "text-cyan-400" : "text-slate-400 hover:text-white"
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

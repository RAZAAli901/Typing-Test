"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Icon, { IconName } from "@/components/Icon";
import { useSession, signOut } from "next-auth/react";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/8bit/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/8bit/dropdown-menu";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState<string>("Anonymous");

  // Fetch username from localStorage client-side as fallback for guests
  useEffect(() => {
    const stored = localStorage.getItem("typemaster_username");
    if (stored) {
      setUsername(stored);
    }

    const handleStorage = () => {
      const u = localStorage.getItem("typemaster_username");
      if (u) setUsername(u);
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("usernameChanged", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("usernameChanged", handleStorage);
    };
  }, []);

  const navLinks: { href: string; label: string; icon: IconName }[] = [
    { href: "/play", label: "PLAY", icon: "play" },
    { href: "/leaderboard", label: "LEADERBOARD", icon: "trophy" },
    { href: "/stats", label: "STATS", icon: "stats" },
    { href: "/about", label: "ABOUT", icon: "info" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-crt-dim/40 bg-[#060606]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Area */}
        {/* CRT Phosphor styling with glow effects */}
        <Link href="/" className="flex items-center gap-2 group font-press-start text-[10px] md:text-[12px]">
          <Icon name="play" size={14} className="text-crt-primary drop-shadow-[0_0_4px_var(--color-crt-primary)] animate-pulse" />
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
                <Icon name={link.icon} size={18} className={isActive ? "text-crt-primary" : "text-crt-dim"} />
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
          {status === "authenticated" && session?.user ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="flex items-center gap-2 bg-[#0a0a0a] border border-crt-dim/50 rounded px-3 py-1 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)] hover:border-crt-primary transition-colors cursor-pointer group">
                    <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center bg-zinc-950">
                      {session.user.image ? (
                        <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <DefaultAvatar className="w-4 h-4 text-crt-primary" />
                      )}
                    </div>
                    <span className="font-bold text-crt-primary group-hover:text-white tracking-wide max-w-[100px] truncate" title={session.user.name || ""}>
                      {session.user.name}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>IDENTITY: {session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full cursor-pointer">VIEW PROFILE</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/stats" className="w-full cursor-pointer">STATS DASHBOARD</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="text-red-500 cursor-pointer">
                    LOGOUT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Fallback anonymous indicator */}
              <div className="hidden sm:flex items-center gap-1.5 bg-[#0a0a0a] border border-crt-dim/30 rounded px-2.5 py-0.5 text-xs text-crt-dim/80">
                <Icon name="user" size={12} className="text-crt-dim/50" />
                <span className="max-w-[70px] truncate">{username}</span>
              </div>
              <Button asChild size="sm">
                <Link href="/login">
                  <Icon name="user" size={12} />
                  <span>LOGIN</span>
                </Link>
              </Button>
            </div>
          )}
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
              <Icon name={link.icon} size={16} className={isActive ? "text-crt-primary" : "text-crt-dim"} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

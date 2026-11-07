import { IconName } from "@/components/Icon";

export interface NavLink {
  href: string;
  label: string;
  icon?: IconName;
}

export const PRIMARY_NAV_LINKS: (NavLink & { icon: IconName })[] = [
  { href: "/play", label: "PLAY", icon: "play" },
  { href: "/learn", label: "LEARN", icon: "standard" },
  { href: "/leaderboard", label: "LEADERBOARD", icon: "trophy" },
  { href: "/stats", label: "STATS", icon: "stats" },
  { href: "/about", label: "ABOUT", icon: "info" },
];

export const FOOTER_PRIMARY_LINKS: NavLink[] = [
  { href: "/play", label: "Play test" },
  { href: "/learn", label: "Learn" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/about", label: "About" },
];

export const LEGAL_NAV_LINKS: NavLink[] = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/contact", label: "Contact" },
  { href: "/editorial-policy", label: "Editorial policy" },
];

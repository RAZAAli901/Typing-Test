import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Sign In",
  description:
    "Sign in to your TypeMaster account to track typing analytics and global leaderboard rankings.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

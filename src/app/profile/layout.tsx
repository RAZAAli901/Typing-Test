import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile & Settings",
  description:
    "Manage your TypeMaster profile, avatar, security settings, and data preferences.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

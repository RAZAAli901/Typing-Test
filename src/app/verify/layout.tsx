import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Access Key",
  description:
    "Verify your email address to activate your TypeMaster account.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

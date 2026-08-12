import { checkAccountLockout, recordFailedLoginAttempt, resetAccountLockout } from "@/lib/passwords";
import { logSecurityEvent } from "@/lib/logger";

// Server-only file - RESTRICTED TO SERVER EXECUTION (Reads NEXTAUTH_SECRET)
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// Extend session user types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: boolean;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const emailLower = credentials.email.toLowerCase();

        // Account lockout pre-check
        const lockout = checkAccountLockout(emailLower);
        if (lockout.isLocked) {
          throw new Error(
            `Account temporarily locked. Please try again in ${lockout.remainingMinutes} minutes.`
          );
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user) {
          recordFailedLoginAttempt(emailLower);
          logSecurityEvent({
            event: "LOGIN_FAILED",
            email: emailLower,
            reason: "Non-existent user email",
          });
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          const failure = recordFailedLoginAttempt(emailLower);
          logSecurityEvent({
            event: failure.isLocked ? "ACCOUNT_LOCKED" : "LOGIN_FAILED",
            email: emailLower,
            reason: failure.isLocked ? "Account locked after 5 failed attempts" : "Incorrect password",
          });
          throw new Error("Invalid credentials");
        }

        // On successful authentication, reset lockout counter
        resetAccountLockout(emailLower);

        // Guest access bypasses NextAuth credentials authorize entirely (handled client-side or anonymous storage).
        // Verified users have user.emailVerified === true and bypass the unverified gate check.
        // Gate login: reject if email is not verified
        if (!user.emailVerified) {
          throw new Error("UNVERIFIED_EMAIL");
        }

        return {
          id: user.username,
          name: user.username,
          email: user.email,
          image: user.avatarUrl,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.emailVerified = (user as any).emailVerified;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.picture !== undefined) token.picture = session.picture;
        if (session.email) token.email = session.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },
  // Server-only NEXTAUTH_SECRET for JWT decryption & signature verification.
  // Upon NEXTAUTH_SECRET rotation, invalid signatures gracefully evaluate to null (unauthenticated).
  secret: process.env.NEXTAUTH_SECRET || "development-fallback-secret-key-32-chars-long",
};


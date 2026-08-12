import { checkAccountLockout, recordFailedLoginAttempt, resetAccountLockout, DUMMY_BCRYPT_HASH } from "@/lib/passwords";
import { logSecurityEvent } from "@/lib/logger";
import { sendNewDeviceLoginNotification } from "@/lib/email";

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
          // Dummy hash comparison to ensure equal execution timing regardless of email existence
          await bcrypt.compare(credentials.password, DUMMY_BCRYPT_HASH);
          recordFailedLoginAttempt(emailLower);
          logSecurityEvent({
            event: "LOGIN_FAILED",
            email: emailLower,
            reason: "Non-existent user email",
          });
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          const failure = recordFailedLoginAttempt(emailLower);
          logSecurityEvent({
            event: failure.isLocked ? "ACCOUNT_LOCKED" : "LOGIN_FAILED",
            email: emailLower,
            reason: failure.isLocked ? "Account locked after 5 failed attempts" : "Incorrect password",
          });
          throw new Error("Invalid email or password");
        }

        // On successful authentication, reset lockout counter
        resetAccountLockout(emailLower);

        // Send login alert notification email asynchronously
        sendNewDeviceLoginNotification(user.email, "Web Browser", "Active Connection").catch((err) =>
          console.error("Login notification dispatch failed:", err)
        );

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
    maxAge: 30 * 24 * 60 * 60, // 30 days maximum session inactivity expiry
    updateAge: 24 * 60 * 60, // Refresh session token every 24 hours
  },
  // JWT Configuration Security: Uses default strong HMAC-SHA256 / HKDF encryption
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  // Cookie Security: sameSite: 'lax' balances CSRF defense with cross-site top-level navigation usability.
  // Extended Remember Me sessions inherit identical httpOnly, secure, and sameSite cookie attributes.
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.callback-url" : "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? "__Host-next-auth.csrf-token" : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
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
        token.iat = Math.floor(Date.now() / 1000);
      }
      if (token.email) {
        // Enforce maximum absolute session lifetime limit (90 days = 7,776,000 seconds)
        const MAX_ABSOLUTE_LIFETIME_SECONDS = 90 * 24 * 60 * 60;
        if (token.iat && Math.floor(Date.now() / 1000) - (token.iat as number) > MAX_ABSOLUTE_LIFETIME_SECONDS) {
          logSecurityEvent({
            event: "SESSION_REJECTED",
            email: token.email,
            reason: "Absolute session lifetime limit of 90 days exceeded",
          });
          return {};
        }

        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: { passwordChangedAt: true, sessionInvalidatedAt: true },
        });
        const invalidatedAt = dbUser?.sessionInvalidatedAt || dbUser?.passwordChangedAt;
        if (invalidatedAt && token.iat) {
          const invalidatedAtSeconds = Math.floor(invalidatedAt.getTime() / 1000);
          if (token.iat < invalidatedAtSeconds) {
            logSecurityEvent({
              event: "SESSION_REJECTED",
              email: token.email,
              reason: "JWT issued prior to password reset / session invalidation",
            });
            return {};
          }
        }
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


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            // HTTPS Enforcement & Asset Isolation: Allow self, HTTPS images (Supabase CDN), and HTTPS/WSS connect-src for Supabase REST & Realtime
            value: "default-src 'self'; connect-src 'self' https: wss:; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests;",
          },

          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      // CORS Security: Enforce explicit allowed methods & headers on all API routes and OPTIONS preflights
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-Requested-With",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

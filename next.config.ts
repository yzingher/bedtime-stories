import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ymjcuctbzfsmweebdpzi.supabase.co",
      },
    ],
  },
};

export default nextConfig;

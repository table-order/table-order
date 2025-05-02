import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ptrgxcgkobowwhhliveh.supabase.co",
        pathname: "**",
      },
      new URL("https://static.toss.im/3d-emojis/u1F44F-apng.png"),
      new URL("https://static.toss.im/lotties/error-spot-apng.png"),
    ],
  },
};

export default nextConfig;

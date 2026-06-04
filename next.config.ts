import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "openweathermap.org" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  env: {
    FARM_LAT: process.env.FARM_LAT ?? "17.3850",
    FARM_LON: process.env.FARM_LON ?? "78.4867",
  },
};
export default nextConfig;

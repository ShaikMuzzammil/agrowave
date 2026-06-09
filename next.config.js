/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["openweathermap.org", "images.unsplash.com"],
  },
  env: {
    FARM_LAT: process.env.FARM_LAT || "17.3850",
    FARM_LON: process.env.FARM_LON || "78.4867",
  },
};

module.exports = nextConfig;
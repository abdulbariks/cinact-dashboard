import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.7.12",
        port: "9000",
      },
      {
        protocol: "http",
        hostname: "10.10.9.51",
        port: "9000",
      },
      {
        protocol: "http",
        hostname: "192.168.7.14",
        port: "9000",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9000",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "walls-kissing-finish-bracelets.trycloudflare.com",
      },
    ],
  },
};

export default nextConfig;
